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
    
    const addedNodeIds = new Set();
    const safePushNode = (node) => {
      if (!addedNodeIds.has(node.id)) {
        newNodes.push(node);
        addedNodeIds.add(node.id);
      }
    };

    const spacing = variables > 6 ? 75 : 110;
    varNames.forEach((name, i) => {
      safePushNode({
        id: `in-${name}`,
        type: 'gate',
        data: { label: name, type: 'INPUT', varName: name, mode },
        position: { x: 500, y: i * spacing + 150 },
      });
    });

    const invertedNodes = new Set();
    finalTerms.forEach(term => {
      const binary = term.binary;
      for (let i = 0; i < binary.length; i++) {
        const needsInversion = mode === 'SOP' ? binary[i] === '0' : binary[i] === '1';
        if (needsInversion) {
          const varName = varNames[i];
          if (!invertedNodes.has(varName)) {
            const notId = `not-${varName}`;
            safePushNode({
              id: notId,
              type: 'gate',
              data: { label: 'NOT', type: 'NOT', mode },
              position: { x: 650, y: i * spacing + 150 },
            });
            newEdges.push({
              id: `e-in-${varName}-not`,
              source: `in-${varName}`,
              target: notId,
              animated: false,
              markerEnd: { type: MarkerType.ArrowClosed, width: 10, height: 10, color: 'rgba(255,255,255,0.1)' },
            });
            invertedNodes.add(varName);
          }
        }
      }
    });

    const termNodes = [];
    const totalInputHeight = variables * spacing;
    const termSpacing = Math.max(120, totalInputHeight / (finalTerms.length || 1));
    const termOffset = Math.max(0, (totalInputHeight - (finalTerms.length * termSpacing)) / 2);

    finalTerms.forEach((term, idx) => {
      // ... same literals logic ...
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
        safePushNode({
          id: gateId,
          type: 'gate',
          data: { label: gateType, type: gateType, mode },
          position: { x: 1000, y: idx * termSpacing + 150 + termOffset },
        });
        termNodes.push(gateId);

        literals.forEach((lit, litIdx) => {
          const varName = varNames[lit.varIndex];
          const needsInversion = mode === 'SOP' ? lit.value === '0' : lit.value === '1';
          const sourceId = needsInversion ? `not-${varName}` : `in-${varName}`;
          newEdges.push({
            id: `e-${sourceId}-${gateId}-${litIdx}`,
            source: sourceId,
            target: gateId,
            animated: false,
            markerEnd: { type: MarkerType.ArrowClosed, width: 10, height: 10, color: 'rgba(255,255,255,0.1)' },
          });
        });
      }
    });

    let lastId = null;
    const finalY = termNodes.length > 0 
      ? (termNodes.length * termSpacing) / 2 + 150 + termOffset - (termSpacing / 2)
      : 150 + (totalInputHeight / 2);

    if (termNodes.length === 1) {
      lastId = termNodes[0];
    } else if (termNodes.length > 1) {
      const finalGateId = mode === 'SOP' ? 'or-final' : 'and-final';
      const finalGateType = mode === 'SOP' ? 'OR' : 'AND';
      safePushNode({
        id: finalGateId,
        type: 'gate',
        data: { label: finalGateType, type: finalGateType, mode },
        position: { x: 1350, y: finalY },
      });
      termNodes.forEach((tId) => {
        newEdges.push({
          id: `e-${tId}-${finalGateId}`,
          source: tId,
          target: finalGateId,
          animated: false,
          markerEnd: { type: MarkerType.ArrowClosed, width: 10, height: 10, color: 'rgba(255,255,255,0.1)' },
        });
      });
      lastId = finalGateId;
    }

    if (lastId) {
      safePushNode({
        id: 'out-y',
        type: 'gate',
        data: { label: 'OUT', type: 'OUTPUT', mode },
        position: { x: 1600, y: finalY },
      });
      newEdges.push({
        id: `e-${lastId}-out`,
        source: lastId,
        target: 'out-y',
        animated: false,
        markerEnd: { type: MarkerType.ArrowClosed, width: 10, height: 10, color: 'rgba(255,255,255,0.1)' },
      });
    }

    // Handle Constant Outputs
    if (finalTerms.length === 1 && (finalTerms[0].binary === '1' || finalTerms[0].binary === '0')) {
      const isOne = finalTerms[0].binary === '1';
      newNodes.push({
        id: 'const-node',
        type: 'gate',
        data: { label: isOne ? 'HIGH' : 'LOW', type: 'INPUT', isActive: isOne, mode },
        position: { x: 500, y: 200 },
      });
      newNodes.push({
        id: 'out-y',
        type: 'gate',
        data: { label: 'OUT', type: 'OUTPUT', mode },
        position: { x: 800, y: 200 },
      });
      newEdges.push({
        id: 'e-const-out',
        source: 'const-node',
        target: 'out-y',
        animated: isOne,
      });
      return { nodes: newNodes, edges: newEdges };
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
          stroke: isActive ? accentColor : 'rgba(255,255,255,0.06)',
          strokeWidth: isActive ? 3 : 1.5,
          filter: isActive ? `drop-shadow(0 0 8px ${accentColor}80)` : 'none',
          transition: 'all 0.5s ease',
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 12,
          height: 12,
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
      link.download = `noctis-circuit-${mode.toLowerCase()}.${format}`;
      link.href = dataUrl;
      link.click();
    }).catch(err => console.error('Export failed:', err));
  };

  return (
    <div ref={canvasRef} className="flex-1 relative h-full group bg-cyber-grid border border-white/5 rounded-xl overflow-hidden shadow-2xl" data-tutorial="circuit-canvas">
      <div className="absolute top-6 right-6 z-10 flex gap-3">
        <button 
          onClick={() => exportImage('png')}
          className="flex items-center gap-2 px-4 py-2 glass hover:bg-white/10 transition-colors text-xs font-bold text-white shadow-xl"
        >
          <Download className="w-3 h-3" /> PNG
        </button>
        <button 
          onClick={() => exportImage('svg')}
          className="flex items-center gap-2 px-4 py-2 glass hover:bg-white/10 transition-colors text-xs font-bold text-white shadow-xl"
        >
          <FileText className="w-3 h-3" /> SVG
        </button>
      </div>

      <div className="absolute top-6 left-6 z-10 flex flex-col gap-3">
        <div className="glass px-6 py-4 border-l-4 shadow-[0_0_30px_rgba(0,0,0,0.5)]" style={{ borderColor: accentColor }}>
          <div className="text-[11px] font-black uppercase tracking-[0.3em] text-white/50 mb-3">Signal Analysis</div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: accentColor, boxShadow: `0 0 15px ${accentColor}` }} />
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-white uppercase tracking-wider">Conducting</span>
                <span className="text-[8px] text-white/40 uppercase font-bold tracking-widest">Logic State 1</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-white/30 uppercase tracking-wider">Passive</span>
                <span className="text-[8px] text-white/20 uppercase font-bold tracking-widest">Logic State 0</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
            <span className="text-[9px] font-mono text-white/40">{mode} OPTIMIZATION</span>
            <div className="px-2 py-0.5 rounded bg-green-500/10 border border-green-500/30 text-green-400 text-[8px] font-bold">STABLE</div>
          </div>
        </div>
        <div className="glass px-4 py-2 text-[10px] font-mono text-white/60 backdrop-blur-2xl">
          Click inputs to toggle signal flow
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ 
          padding: 0.4,
          duration: 800,
          includeHiddenNodes: false,
          minZoom: 0.1,
          maxZoom: 1.2
        }}
        className="w-full h-full"
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { strokeWidth: 2 },
        }}
        panOnScroll
        zoomOnScroll
        panOnDrag
        minZoom={0.2}
        maxZoom={3}
      >
        <Background color="rgba(255,255,255,0.03)" gap={30} size={1} />
        <Controls className="fill-white bg-[#111] border-white/10 shadow-xl" />
        <MiniMap 
          nodeColor={(n) => {
            if (n.data.type === 'AND') return '#00f3ff';
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
