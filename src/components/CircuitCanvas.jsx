import React, { useCallback, useState, useEffect, useMemo, useRef } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  applyNodeChanges,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { GateNode } from './GateNode';
import { Download, FileText } from 'lucide-react';
import { toPng, toSvg } from 'html-to-image';

const nodeTypes = {
  gate: GateNode,
};

export const CircuitCanvas = ({ finalTerms, variables, mode = 'SOP' }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [inputStates, setInputStates] = useState({});
  const canvasRef = useRef(null);
  const isMobile = useRef(window.innerWidth < 768);

  const accentColor = mode === 'POS' ? '#bc13fe' : '#00f3ff';

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
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
    
    const spacingY = isMobile.current ? 70 : 90;
    const spacingX = isMobile.current ? 180 : 120;

    varNames.forEach((name, i) => {
      newNodes.push({
        id: `in-${name}`,
        type: 'gate',
        data: { label: name, type: 'INPUT', varName: name, mode },
        position: { x: 30, y: i * spacingY + 30 },
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
              position: { x: 180, y: i * spacingY + 30 },
            });
            newEdges.push({
              id: `e-in-${varName}-not`,
              source: `in-${varName}`,
              target: notId,
              animated: false,
              markerEnd: { type: MarkerType.ArrowClosed, width: 8, height: 8, color: 'rgba(255,255,255,0.1)' },
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
          position: { x: 330, y: idx * spacingX + 30 },
        });
        termNodes.push(gateId);

        literals.forEach(lit => {
          const varName = varNames[lit.varIndex];
          const sourceId = lit.value === '0' ? `not-${varName}` : `in-${varName}`;
          newEdges.push({
            id: `e-${sourceId}-${gateId}`,
            source: sourceId,
            target: gateId,
            animated: false,
            markerEnd: { type: MarkerType.ArrowClosed, width: 8, height: 8, color: 'rgba(255,255,255,0.1)' },
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
      newNodes.push({
        id: finalGateId,
        type: 'gate',
        data: { label: finalGateType, type: finalGateType, mode },
        position: { x: 510, y: Math.max(60, (termNodes.length * spacingX) / 2 - 60) },
      });
      termNodes.forEach((tId) => {
        newEdges.push({
          id: `e-${tId}-${finalGateId}`,
          source: tId,
          target: finalGateId,
          animated: false,
          markerEnd: { type: MarkerType.ArrowClosed, width: 8, height: 8, color: 'rgba(255,255,255,0.1)' },
        });
      });
      lastId = finalGateId;
    }

    if (lastId) {
      const outY = Math.max(60, (termNodes.length * spacingX) / 2 - 60);
      newNodes.push({
        id: 'out-y',
        type: 'gate',
        data: { label: 'OUT', type: 'OUTPUT', mode },
        position: { x: 660, y: outY },
      });
      newEdges.push({
        id: `e-${lastId}-out`,
        source: lastId,
        target: 'out-y',
        animated: false,
        markerEnd: { type: MarkerType.ArrowClosed, width: 8, height: 8, color: 'rgba(255,255,255,0.1)' },
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
          stroke: isActive ? accentColor : 'rgba(255,255,255,0.08)',
          strokeWidth: isActive ? 3 : 1,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 8,
          height: 8,
          color: isActive ? accentColor : 'rgba(255,255,255,0.1)',
        },
      };
    });

    setNodes(updatedNodes);
    setEdges(updatedEdges);
  }, [graphTopology, inputStates, toggleInput, mode, accentColor]);

  const exportImage = (format) => {
    const el = canvasRef.current?.querySelector('.react-flow__viewport') || canvasRef.current;
    if (!el) return;
    const fn = format === 'png' ? toPng : toSvg;
    fn(el, {
      backgroundColor: '#050505',
      pixelRatio: 2,
    }).then((dataUrl) => {
      const link = document.createElement('a');
      link.download = `qm-logics-circuit-${mode.toLowerCase()}.${format}`;
      link.href = dataUrl;
      link.click();
    }).catch(err => console.error('Export failed:', err));
  };

  return (
    <div ref={canvasRef} className="flex-1 relative h-full min-h-0 group bg-cyber-grid border border-white/5 rounded-xl overflow-hidden shadow-2xl" data-tutorial="circuit-canvas">
      <div className="absolute top-3 right-3 z-10 flex gap-2">
        <button 
          onClick={() => exportImage('png')}
          className="flex items-center gap-1.5 px-3 py-1.5 glass hover:bg-white/10 transition-colors text-[10px] font-bold text-white shadow-xl"
        >
          <Download className="w-3 h-3" /> PNG
        </button>
        <button 
          onClick={() => exportImage('svg')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 glass hover:bg-white/10 transition-colors text-[10px] font-bold text-white shadow-xl"
        >
          <FileText className="w-3 h-3" /> SVG
        </button>
      </div>

      <div className="absolute top-3 left-3 z-10 glass px-2.5 py-1.5 text-[9px] font-mono" style={{ color: accentColor }}>
        {mode} MODE — Tap inputs to simulate
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        className="w-full h-full"
        defaultEdgeOptions={{
          type: 'smoothstep',
        }}
        panOnScroll
        zoomOnScroll
        panOnDrag
        minZoom={0.2}
        maxZoom={3}
      >
        <Background color="rgba(255,255,255,0.03)" gap={20} size={1} />
        <Controls className="fill-white bg-[#111] border-white/10 shadow-xl" />
        <MiniMap 
          nodeColor={(n) => {
            if (n.data.type === 'AND') return accentColor;
            if (n.data.type === 'OR') return '#bc13fe';
            if (n.data.type === 'NOT') return '#ff00ff';
            return 'rgba(255,255,255,0.2)';
          }}
          maskColor="rgba(0,0,0,0.85)"
          className="bg-[#050505] border-white/10 shadow-2xl"
        />
      </ReactFlow>
    </div>
  );
};
