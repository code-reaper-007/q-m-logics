import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Activity, Zap } from 'lucide-react';
import { ANDGateSVG, ORGateSVG, NOTGateSVG, NANDGateSVG, NORGateSVGComponent as NORGateSVG, XORGateSVG, XNORGateSVG } from './GateSymbols';

export const GateNode = memo(({ data }) => {
  const isAnd = data.type === 'AND';
  const isOr = data.type === 'OR';
  const isNot = data.type === 'NOT';
  const isNand = data.type === 'NAND';
  const isNor = data.type === 'NOR';
  const isXor = data.type === 'XOR';
  const isXnor = data.type === 'XNOR';
  const isInput = data.type === 'INPUT';
  const isOutput = data.type === 'OUTPUT';
  const isActive = data.isActive;
  const mode = data.mode || 'SOP';
  
  const cyan = '#00f3ff';
  const purple = '#bc13fe';
  const pink = '#ff00ff';
  const accent = mode === 'POS' ? purple : cyan;

  const getGateSVG = () => {
    if (isAnd) return <ANDGateSVG color={accent} size={40} isActive={isActive} />;
    if (isOr) return <ORGateSVG color={purple} size={40} isActive={isActive} />;
    if (isNot) return <NOTGateSVG color={pink} size={36} isActive={isActive} />;
    if (isNand) return <NANDGateSVG color={accent} size={40} isActive={isActive} />;
    if (isNor) return <NORGateSVG color={purple} size={40} isActive={isActive} />;
    if (isXor) return <XORGateSVG color={accent} size={40} isActive={isActive} />;
    if (isXnor) return <XNORGateSVG color={purple} size={40} isActive={isActive} />;
    return null;
  };

  const getInputIcon = () => {
    if (isInput) {
      return (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md border border-white/30 flex items-center justify-center bg-white/5">
            <span className="text-xs font-bold text-white">
              {isActive ? '+' : '−'}
            </span>
          </div>
        </div>
      );
    }
    if (isOutput) return <Zap className={`w-5 h-5 ${isActive ? 'text-yellow-400 fill-yellow-400' : 'text-white/30'}`} />;
    return null;
  };

  const borderColor = isActive ? accent : 'rgba(255,255,255,0.1)';
  const bgColor = isActive ? `${accent}10` : 'rgba(255,255,255,0.03)';
  const textColor = isActive ? accent : 'rgba(255,255,255,0.5)';
  const handleColor = isActive ? accent : 'rgba(255,255,255,0.2)';
  const glow = isActive 
    ? `0 0 20px ${accent}50, 0 0 40px ${accent}20, inset 0 0 15px ${accent}15` 
    : `0 0 1px rgba(255,255,255,0.1)`;

  return (
    <div 
      className={`px-4 py-3 rounded-xl border min-w-[80px] flex flex-col items-center justify-center gap-2 transition-all duration-300 ${isActive ? 'animate-pulse-subtle' : ''}`}
      onClick={isInput ? data.onToggle : undefined}
      style={{ 
        borderColor, 
        backgroundColor: bgColor, 
        color: textColor, 
        boxShadow: glow,
        cursor: isInput ? 'pointer' : 'default',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {!isInput && (
        <Handle 
          type="target" 
          position={Position.Left} 
          className="!w-2.5 !h-2.5 transition-all duration-300" 
          style={{ 
            backgroundColor: handleColor, 
            borderColor: handleColor,
            boxShadow: isActive ? `0 0 8px ${accent}` : 'none',
          }} 
        />
      )}
      
      <div className="flex items-center gap-2.5">
        {isInput || isOutput ? getInputIcon() : getGateSVG()}
        <span className="text-[11px] font-bold uppercase tracking-wider" style={{ textShadow: isActive ? `0 0 8px ${accent}80` : 'none' }}>
          {isInput ? data.label : isOutput ? 'OUT' : data.label}
        </span>
      </div>
      
      {!isOutput && (
        <Handle 
          type="source" 
          position={Position.Right} 
          className="!w-2.5 !h-2.5 transition-all duration-300" 
          style={{ 
            backgroundColor: handleColor, 
            borderColor: handleColor,
            boxShadow: isActive ? `0 0 8px ${accent}` : 'none',
          }} 
        />
      )}
    </div>
  );
});
