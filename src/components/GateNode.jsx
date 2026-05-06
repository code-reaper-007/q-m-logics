import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Activity, Zap } from 'lucide-react';
import { ANDGateSVG, ORGateSVG, NOTGateSVG } from './GateSymbols';

export const GateNode = memo(({ data }) => {
  const isAnd = data.type === 'AND';
  const isOr = data.type === 'OR';
  const isNot = data.type === 'NOT';
  const isInput = data.type === 'INPUT';
  const isOutput = data.type === 'OUTPUT';
  const isActive = data.isActive;
  const mode = data.mode || 'SOP';
  
  const cyan = '#00f3ff';
  const purple = '#bc13fe';
  const pink = '#ff00ff';
  const accent = mode === 'POS' ? purple : cyan;

  const getGateSVG = () => {
    if (isAnd) return <ANDGateSVG color={accent} size={32} />;
    if (isOr) return <ORGateSVG color={purple} size={32} />;
    if (isNot) return <NOTGateSVG color={pink} size={28} />;
    return null;
  };

  const getInputIcon = () => {
    if (isInput) return <Activity className={`w-3.5 h-3.5 ${isActive ? 'animate-pulse' : ''}`} style={{ color: isActive ? accent : 'rgba(255,255,255,0.4)' }} />;
    if (isOutput) return <Zap className={`w-4 h-4 ${isActive ? 'text-yellow-400 fill-yellow-400' : 'text-white/30'}`} />;
    return null;
  };

  const borderColor = isActive ? accent : 'rgba(255,255,255,0.08)';
  const bgColor = isActive ? `${accent}08` : 'rgba(255,255,255,0.02)';
  const textColor = isActive ? accent : 'rgba(255,255,255,0.35)';
  const handleColor = isActive ? accent : 'rgba(255,255,255,0.15)';
  const glow = isActive ? `0 0 12px ${accent}40, inset 0 0 12px ${accent}10` : 'none';

  return (
    <div 
      className="px-3 py-2 rounded-lg border min-w-[60px] flex flex-col items-center justify-center gap-1.5 transition-all duration-200"
      onClick={isInput ? data.onToggle : undefined}
      style={{ 
        borderColor, 
        backgroundColor: bgColor, 
        color: textColor, 
        boxShadow: glow,
        cursor: isInput ? 'pointer' : 'default',
      }}
    >
      {!isInput && (
        <Handle 
          type="target" 
          position={Position.Left} 
          className="!w-2 !h-2 transition-colors" 
          style={{ backgroundColor: handleColor, borderColor: handleColor }} 
        />
      )}
      
      <div className="flex items-center gap-2">
        {isInput || isOutput ? getInputIcon() : getGateSVG()}
        <span className="text-[10px] font-bold uppercase tracking-widest">
          {isInput ? data.label : isOutput ? 'OUT' : data.label}
        </span>
      </div>
      
      {!isOutput && (
        <Handle 
          type="source" 
          position={Position.Right} 
          className="!w-2 !h-2 transition-colors" 
          style={{ backgroundColor: handleColor, borderColor: handleColor }} 
        />
      )}
    </div>
  );
});
