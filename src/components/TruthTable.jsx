import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const TruthTable = ({ variables, minterms, dontCares, mode = 'SOP' }) => {
  const [hoveredRow, setHoveredRow] = useState(null);
  const rows = Math.pow(2, variables);
  const mintermSet = new Set(minterms);
  const dontCareSet = new Set(dontCares);
  const accent = mode === 'POS' ? '#bc13fe' : '#00f3ff';
  const varNames = Array.from({ length: variables }, (_, i) => String.fromCharCode(65 + i));

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6 h-full flex flex-col"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white/50 uppercase tracking-[0.2em] flex items-center gap-3">
          Truth Table
          <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-white/40 font-mono">{rows} Rows</span>
          <span className="text-[10px] px-2 py-1 rounded font-mono" style={{ backgroundColor: `${accent}20`, color: accent }}>{mode}</span>
        </h3>
        <div className="flex gap-4 text-[10px] font-mono">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} /> {mode === 'SOP' ? '1 (Minterm)' : '0 (Maxterm)'}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-accent-purple" /> X (Don't Care)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-white/10" /> {mode === 'SOP' ? '0' : '1'}
          </span>
        </div>
      </div>

      <div className="glass flex-1 overflow-hidden border-white/5 shadow-2xl relative">
        <div className="absolute inset-0 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-[#050505]/95 backdrop-blur-xl z-10 shadow-md">
              <tr>
                <th className="p-4 text-[10px] font-bold text-white/30 uppercase tracking-widest text-center border-b border-white/10">#</th>
                {varNames.map((name, i) => (
                  <th key={i} className="p-4 text-[10px] font-bold text-white/50 uppercase tracking-widest text-center border-b border-white/10">
                    {name}
                  </th>
                ))}
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-center border-b border-white/10" style={{ color: accent }}>OUT</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rows }).map((_, i) => {
                const binary = i.toString(2).padStart(variables, '0');
                const isMinterm = mintermSet.has(i);
                const isDontCare = dontCareSet.has(i);
                const isHovered = hoveredRow === i;
                const output = isDontCare ? 'X' : (isMinterm ? (mode === 'SOP' ? '1' : '0') : (mode === 'SOP' ? '0' : '1'));
                const isActiveValue = (mode === 'SOP' && isMinterm) || (mode === 'POS' && !isMinterm && !isDontCare);
                const rowBg = isHovered ? `${accent}10` : isMinterm ? `${accent}08` : 'transparent';
                
                return (
                  <tr 
                    key={i} 
                    className="border-b border-white/[0.02] transition-colors duration-150"
                    style={{ backgroundColor: rowBg }}
                    onMouseEnter={() => setHoveredRow(i)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className="p-3 text-center font-mono text-[10px] text-white/20">{i}</td>
                    {binary.split('').map((bit, idx) => (
                      <td key={idx} className={`p-3 text-center font-mono text-xs transition-colors ${
                        isHovered ? 'text-white' : isMinterm ? 'text-white/60' : 'text-white/30'
                      }`}>
                        {bit}
                      </td>
                    ))}
                    <td 
                      className="p-3 text-center font-bold font-mono text-sm transition-colors"
                      style={{ 
                        color: isDontCare ? '#bc13fe' : isMinterm ? accent : 'rgba(255,255,255,0.15)',
                      }}
                    >
                      {output}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
