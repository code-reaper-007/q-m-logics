import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Activity, Zap, Cpu } from 'lucide-react';
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
    if (isAnd) return <ANDGateSVG color={isActive ? accent : cyan} size={36} />;
    if (isOr) return <ORGateSVG color={isActive ? accent : purple} size={36} />;
    if (isNot) return <NOTGateSVG color={isActive ? accent : pink} size={32} />;
    if (isInput) return <Activity className="w-6 h-6" style={{ color: isActive ? accent : 'rgba(255,255,255,0.2)' }} />;
    if (isOutput) return <Cpu className="w-6 h-6" style={{ color: isActive ? accent : 'rgba(255,255,255,0.2)' }} />;
    return null;
  };

  const getInputIcon = () => {
    if (isInput) return <Activity className={`w-3 h-3 ${isActive ? 'animate-pulse' : ''}`} style={{ color: isActive ? accent : undefined }} />;
    if (isOutput) return <Zap className={`w-4 h-4 ${isActive ? 'text-yellow-400 fill-yellow-400' : ''}`} />;
    return null;
  };

  const borderColor = isActive ? accent : 'rgba(255,255,255,0.1)';
  const bgColor = isActive ? `${accent}15` : 'rgba(255,255,255,0.03)';
  const handleColor = isActive ? accent : 'rgba(255,255,255,0.2)';
  const glow = isActive ? `0 0 15px ${accent}30` : 'none';

  return (
    <div 
      className={`relative p-4 rounded-xl border-2 transition-all duration-500 backdrop-blur-xl ${
        isActive 
          ? 'bg-white/10 shadow-[0_0_30px_rgba(255,255,255,0.1)] cursor-pointer' 
          : 'bg-[#050505]/80 border-white/5 cursor-pointer'
      }`}
      onClick={isInput ? data.onToggle : undefined}
      style={{ 
        borderColor: isActive ? accent : 'rgba(255,255,255,0.05)',
        boxShadow: isActive ? `0 0 40px ${accent}20, inset 0 0 20px ${accent}10` : 'none'
      }}
    >
      <div className="flex flex-col items-center gap-3">
        {getGateSVG()}
        
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black tracking-widest text-white/40 uppercase mb-1">{data.label}</span>
          <div className="flex items-center gap-2">
            <div 
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                isActive ? 'animate-pulse' : 'bg-white/10'
              }`}
              style={{ 
                backgroundColor: isActive ? accent : undefined,
                boxShadow: isActive ? `0 0 10px ${accent}` : 'none'
              }}
            />
            <span className={`text-[9px] font-mono font-bold ${isActive ? 'text-white' : 'text-white/20'}`}>
              {isActive ? 'CONDUCTING' : 'PASSIVE'}
            </span>
          </div>
        </div>
      </div>

      <div 
        className="absolute -top-3 -right-3 w-8 h-8 rounded-lg flex items-center justify-center font-mono font-black text-xs border shadow-2xl transition-all duration-300"
        style={{ 
          backgroundColor: isActive ? accent : '#1a1a1a',
          borderColor: isActive ? '#fff' : 'rgba(255,255,255,0.1)',
          color: isActive ? '#000' : 'rgba(255,255,255,0.3)',
          boxShadow: isActive ? `0 0 20px ${accent}80` : 'none',
          transform: isActive ? 'scale(1.1) rotate(5deg)' : 'scale(1)'
        }}
      >
        {isActive ? '1' : '0'}
      </div>

      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-3 h-3 border-2 border-[#050505]"
        style={{ background: isActive ? accent : '#222' }}
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3 h-3 border-2 border-[#050505]"
        style={{ background: isActive ? accent : '#222' }}
      />
    </div>
  );
});
