import React, { useCallback, useState, useEffect, useMemo, useRef } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { GateNode } from './GateNode';
import { Download, FileText, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { toPng, toSvg } from 'html-to-image';

const nodeTypes = {
  gate: GateNode,
};

const edgeTypes = {};

const defaultEdgeOptions = {
  type: 'smoothstep',
  animated: false,
  style: {
    stroke: 'rgba(255,255,255,0.15)',
    strokeWidth: 1,
    strokeDasharray: '4 4',
  },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 10,
    height: 10,
    color: 'rgba(255,255,255,0.2)',
  },
};

function CanvasContent({ finalTerms, variables, mode = 'SOP' }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [inputStates, setInputStates] = useState({});
  const [isExporting, setIsExporting] = useState(false);
  const canvasRef = useRef(null);
  const reactFlowWrapper = useRef(null);
  const { fitView, zoomIn, zoomOut, setCenter } = useReactFlow();

  const accentColor = mode === 'POS' ? '#bc13fe' : '#00f3ff';
  const cyan = '#00f3ff';
  const purple = '#bc13fe';
  const pink = '#ff00ff';

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const toggleInput = useCallback((varName) => {
    setInputStates(prev => ({
      ...prev,
      [varName]: !prev[varName]
    }));
  }, []);

  const graphTopology = useMemo(() => {
    if (!finalTerms || finalTerms.length === 0) return { nodes: [], edges: [] };
    
    const newNodes = [];
    const newEdges = [];
    const varNames = Array.from({ length: variables }, (_, i) => String.fromCharCode(65 + i));
    
    const spacingY = 100;
    const spacingX = 140;

    varNames.forEach((name, i) => {
      newNodes.push({
        id: `in-${name}`,
        type: 'gate',
        data: { label: name, type: 'INPUT', varName: name, mode },
        position: { x: 40, y: i * spacingY + 50 },
      });
    });

    const invertedNodes = new Set();
    
    finalTerms.forEach(term => {
      const binary = term.binary;
      for (let i = 0; i < binary.length; i++) {
        if (binary[i] === '0') {
          const varName = varNames[i];
          if (!invertedNodes.has(varName)) {
            const notId = `not-${varName}`;
            newNodes.push({
              id: notId,
              type: 'gate',
              data: { label: 'NOT', type: 'NOT', mode },
              position: { x: 200, y: i * spacingY + 50 },
            });
            newEdges.push({
              id: `e-in-${varName}-not`,
              source: `in-${varName}`,
              target: notId,
            });
            invertedNodes.add(varName);
          }
        }
      }
    });

    const termNodes = [];
    finalTerms.forEach((term, idx) => {
      const literals = [];
      const binary = term.binary;
      for (let i = 0; i < binary.length; i++) {
        if (binary[i] !== '-') {
          literals.push({ varIndex: i, value: binary[i] });
        }
      }

      if (literals.length > 0) {
        const gateId = mode === 'SOP' ? `and-${idx}` : `or-${idx}`;
        const gateType = mode === 'SOP' ? 'AND' : 'OR';
        newNodes.push({
          id: gateId,
          type: 'gate',
          data: { label: gateType, type: gateType, mode },
          position: { x: 360, y: idx * spacingX + 50 },
        });
        termNodes.push(gateId);

        literals.forEach(lit => {
          const varName = varNames[lit.varIndex];
          const sourceId = lit.value === '0' ? `not-${varName}` : `in-${varName}`;
          newEdges.push({
            id: `e-${sourceId}-${gateId}`,
            source: sourceId,
            target: gateId,
          });
        });
      }
    });

    let lastId = null;
    if (termNodes.length === 1) {
      lastId = termNodes[0];
    } else if (termNodes.length > 1) {
      const finalGateId = mode === 'SOP' ? 'or-final' : 'and-final';
      const finalGateType = mode === 'SOP' ? 'OR' : 'AND';
      const termCount = termNodes.length;
      const firstY = (termNodes.length > 0 && finalTerms[termCount - 1]) 
        ? termCount * spacingX + 50 
        : 150;
      
      newNodes.push({
        id: finalGateId,
        type: 'gate',
        data: { label: finalGateType, type: finalGateType, mode },
        position: { x: 520, y: Math.max(100, (firstY - 50) / 2 + 50) },
      });
      termNodes.forEach((tId) => {
        newEdges.push({
          id: `e-${tId}-${finalGateId}`,
          source: tId,
          target: finalGateId,
        });
      });
      lastId = finalGateId;
    }

    if (lastId) {
      const outY = termNodes.length > 1 ? Math.max(100, (termNodes.length * spacingX) / 2 + 25) : 50;
      newNodes.push({
        id: 'out-y',
        type: 'gate',
        data: { label: 'OUT', type: 'OUTPUT', mode },
        position: { x: 680, y: outY },
      });
      newEdges.push({
        id: `e-${lastId}-out`,
        source: lastId,
        target: 'out-y',
      });
    }

    return { nodes: newNodes, edges: newEdges };
  }, [finalTerms, variables, mode]);

  useEffect(() => {
    if (!graphTopology.nodes.length) {
      setNodes([]);
      setEdges([]);
      return;
    }

    const nodeStates = {};
    const edgeStates = {};
    
    graphTopology.nodes.forEach(n => {
      if (n.data.type === 'INPUT') {
        nodeStates[n.id] = !!inputStates[n.data.varName];
      }
    });

    const sortedNodes = [...graphTopology.nodes].sort((a, b) => {
      const order = { INPUT: 0, NOT: 1, AND: 2, OR: 3, OUTPUT: 4 };
      return (order[a.data.type] || 5) - (order[b.data.type] || 5);
    });

    for (let iter = 0; iter < 10; iter++) {
      let changed = false;
      sortedNodes.forEach(n => {
        if (n.data.type === 'INPUT') return;

        const incomingEdges = graphTopology.edges.filter(e => e.target === n.id);
        const incomingValues = incomingEdges.map(e => nodeStates[e.source] ?? false);

        let outVal = false;
        if (n.data.type === 'NOT') outVal = !(incomingValues[0] ?? false);
        else if (n.data.type === 'AND') outVal = incomingValues.length > 0 && incomingValues.every(v => v);
        else if (n.data.type === 'OR') outVal = incomingValues.length > 0 && incomingValues.some(v => v);
        else if (n.data.type === 'OUTPUT') outVal = incomingValues.length > 0 ? (incomingValues[0] ?? false) : false;

        if (nodeStates[n.id] !== outVal) {
          nodeStates[n.id] = outVal;
          changed = true;
        }
      });
      if (!changed) break;
    }

    graphTopology.edges.forEach(e => {
      edgeStates[e.id] = !!(nodeStates[e.source]);
    });

    const updatedNodes = graphTopology.nodes.map(n => ({
      ...n,
      data: {
        ...n.data,
        isActive: nodeStates[n.id] || false,
        mode,
        onToggle: n.data.type === 'INPUT' ? () => toggleInput(n.data.varName) : undefined
      }
    }));

    const updatedEdges = graphTopology.edges.map(e => {
      const isActive = edgeStates[e.id] || false;
      return {
        ...e,
        animated: isActive,
        style: {
          stroke: isActive ? cyan : 'rgba(255,255,255,0.12)',
          strokeWidth: isActive ? 2 : 1,
          strokeDasharray: isActive ? '6 3' : '4 4',
          transition: 'stroke 0.3s ease, stroke-width 0.3s ease',
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: isActive ? 12 : 10,
          height: isActive ? 12 : 10,
          color: isActive ? cyan : 'rgba(255,255,255,0.2)',
        },
      };
    });

    setNodes(updatedNodes);
    setEdges(updatedEdges);

    setTimeout(() => {
      fitView({ padding: 0.2, duration: 400 });
    }, 100);
  }, [graphTopology, inputStates, toggleInput, mode, fitView]);

  const exportImage = async (format) => {
    const el = canvasRef.current?.querySelector('.react-flow__viewport');
    if (!el || isExporting) return;
    
    setIsExporting(true);
    const fn = format === 'png' ? toPng : toSvg;
    
    try {
      const dataUrl = await fn(el, {
        backgroundColor: '#050505',
        pixelRatio: 2,
        style: {
          transform: 'none',
        }
      });
      const link = document.createElement('a');
      link.download = `qm-logics-circuit-${mode.toLowerCase()}.${format}`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleResetView = () => {
    fitView({ padding: 0.2, duration: 400 });
  };

  return (
    <div ref={canvasRef} className="flex-1 relative h-full min-h-0 bg-[#050505]">
      {/* Control bar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="glass px-3 py-2 flex items-center gap-2 border border-white/10">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
            <span className="text-[10px] font-mono font-bold tracking-wider" style={{ color: accentColor }}>
              {mode} MODE
            </span>
          </div>
          <div className="glass px-3 py-2 text-[10px] text-white/40 font-mono border border-white/10 hidden sm:block">
            Tap inputs to simulate
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button 
            onClick={zoomIn}
            className="glass p-2 hover:bg-white/10 transition-colors border border-white/10"
          >
            <ZoomIn className="w-3.5 h-3.5 text-white/60" />
          </button>
          <button 
            onClick={zoomOut}
            className="glass p-2 hover:bg-white/10 transition-colors border border-white/10"
          >
            <ZoomOut className="w-3.5 h-3.5 text-white/60" />
          </button>
          <button 
            onClick={handleResetView}
            className="glass p-2 hover:bg-white/10 transition-colors border border-white/10"
          >
            <Maximize2 className="w-3.5 h-3.5 text-white/60" />
          </button>
          <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block" />
          <button 
            onClick={() => exportImage('png')}
            disabled={isExporting}
            className="glass px-3 py-2 hover:bg-white/10 transition-colors border border-white/10 flex items-center gap-1.5 disabled:opacity-50"
          >
            <Download className="w-3 h-3 text-white/60" />
            <span className="text-[10px] font-bold text-white/60 hidden sm:inline">PNG</span>
          </button>
          <button 
            onClick={() => exportImage('svg')}
            disabled={isExporting}
            className="glass px-3 py-2 hover:bg-white/10 transition-colors border border-white/10 flex items-center gap-1.5 disabled:opacity-50 hidden sm:flex"
          >
            <FileText className="w-3 h-3 text-white/60" />
            <span className="text-[10px] font-bold text-white/60">SVG</span>
          </button>
        </div>
      </div>

      {/* ReactFlow Canvas */}
      <div ref={reactFlowWrapper} className="absolute inset-0">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          className="w-full h-full"
          panOnScroll
          zoomOnScroll
          panOnDrag
          minZoom={0.1}
          maxZoom={4}
          attributionPosition="bottom-right"
          proOptions={{ hideAttribution: true }}
        >
          <Background 
            color="rgba(255,255,255,0.04)" 
            gap={24} 
            size={1} 
            variant="dots"
          />
          <Controls showInteractive={false} className="!bg-transparent !border-0 !shadow-none !bottom-20 !right-4" />
        </ReactFlow>
      </div>
    </div>
  );
}

export const CircuitCanvas = React.memo((props) => (
  <ReactFlowProvider>
    <CanvasContent {...props} />
  </ReactFlowProvider>
));
