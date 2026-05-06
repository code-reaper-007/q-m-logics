import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Star, Info, Layers, ChevronRight } from 'lucide-react';

export const GroupingTables = ({ steps, mode = 'SOP' }) => {
  const [hoveredTerm, setHoveredTerm] = useState(null);
  const [hoveredPI, setHoveredPI] = useState(null);

  if (!steps || !steps.groupingSteps) return null;

  const accent = mode === 'POS' ? '#bc13fe' : '#00f3ff';
  const mutedAccent = `${accent}33`;

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Grouping Steps Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-4 border-b border-white/5 pb-4">
          <div className="p-2 rounded-lg bg-white/5 border border-white/10">
            <Layers className="w-5 h-5 text-white/60" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Implicant Reduction</h3>
            <p className="text-xs text-white/30 uppercase tracking-[0.2em] font-medium mt-0.5">Iterative Bitwise Elimination</p>
          </div>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-8 custom-scrollbar">
          {steps.groupingSteps.map((group, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="min-w-[300px] flex-shrink-0 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between px-2">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                  Stage {idx + 1}
                </span>
                <span className="h-px flex-1 mx-4 bg-white/5" />
                {idx < steps.groupingSteps.length - 1 && <ChevronRight className="w-3 h-3 text-white/20" />}
              </div>

              <div className="glass p-5 border-white/5 space-y-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {Object.entries(group).map(([groupNum, items]) => (
                  <div key={`${idx}-${groupNum}`} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Weight {groupNum}</span>
                      <div className="h-[1px] flex-1 bg-white/[0.03]" />
                    </div>
                    
                    <div className="space-y-2">
                      {items.map((item, i) => {
                        const isHovered = hoveredTerm === `${item.binary}-${idx}`;
                        return (
                          <div 
                            key={i} 
                            className={`flex justify-between items-center px-3 py-2 rounded-lg transition-all duration-200 border ${
                              isHovered 
                                ? 'bg-white/5 border-white/10 shadow-lg translate-x-1' 
                                : 'bg-white/[0.01] border-transparent'
                            }`}
                            onMouseEnter={() => setHoveredTerm(`${item.binary}-${idx}`)}
                            onMouseLeave={() => setHoveredTerm(null)}
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-sm font-bold tracking-wider" style={{ color: item.combined ? 'rgba(255,255,255,0.4)' : accent }}>
                                {item.binary}
                              </span>
                              {!item.combined && (
                                <motion.span 
                                  initial={{ scale: 0.8 }}
                                  animate={{ scale: 1 }}
                                  className="text-[8px] px-1.5 py-0.5 rounded-md font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                                >
                                  PI
                                </motion.span>
                              )}
                            </div>
                            <span className="text-[9px] font-mono text-white/20 tracking-tighter">
                              {item.terms.length > 2 ? `${item.terms[0]}...${item.terms[item.terms.length-1]}` : item.terms.join(',')}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 2. PI Chart Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
              <Star className="w-5 h-5 text-yellow-500/60" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Prime Implicant Chart</h3>
              <p className="text-xs text-white/30 uppercase tracking-[0.2em] font-medium mt-0.5">Essential Selection Process</p>
            </div>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                <div className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(234,179,8,0.5)]" style={{ backgroundColor: '#eab308' }} />
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Essential (EPI)</span>
             </div>
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Selected</span>
             </div>
          </div>
        </div>

        {steps.chart && steps.chart.length > 0 ? (
          <div className="glass border-white/5 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.02]">
                    <th className="p-5 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] min-w-[180px] border-b border-white/5">
                      Prime Implicants
                    </th>
                    {Object.keys(steps.chart[0].covers).map(m => (
                      <th key={m} className="p-5 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] text-center min-w-[50px] border-b border-white/5 border-l border-white/[0.02]">
                        {m}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {steps.chart.map((row, idx) => {
                    const isHovered = hoveredPI === idx;
                    const rowAccent = row.isEssential ? '#eab308' : accent;
                    
                    return (
                      <tr 
                        key={idx} 
                        className={`transition-all duration-150 border-b border-white/[0.02] ${
                          isHovered ? 'bg-white/[0.04]' : 'hover:bg-white/[0.01]'
                        }`}
                        onMouseEnter={() => setHoveredPI(idx)}
                        onMouseLeave={() => setHoveredPI(null)}
                      >
                        <td className="p-5 relative group">
                          <div className="flex items-center gap-3">
                             <div className="flex flex-col">
                                <span className="font-mono text-sm font-bold tracking-widest" style={{ color: row.isSelected ? rowAccent : 'rgba(255,255,255,0.3)' }}>
                                  {row.pi}
                                </span>
                                <span className="text-[9px] text-white/20 font-mono mt-0.5">m({row.terms.join(',')})</span>
                             </div>
                             {row.isEssential && (
                               <motion.div 
                                 initial={{ scale: 0 }} 
                                 animate={{ scale: 1 }}
                                 className="p-1 rounded bg-yellow-500/10 border border-yellow-500/20"
                               >
                                 <Star className="w-3 h-3 text-yellow-500" fill="currentColor" />
                               </motion.div>
                             )}
                          </div>
                          {row.isSelected && (
                             <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r" style={{ backgroundColor: rowAccent }} />
                          )}
                        </td>
                        {Object.values(row.covers).map((isCovered, i) => (
                          <td key={i} className={`p-5 text-center border-l border-white/[0.02] transition-colors ${isCovered && isHovered ? 'bg-white/[0.03]' : ''}`}>
                            {isCovered ? (
                              <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="relative flex items-center justify-center"
                              >
                                {row.isSelected ? (
                                  <div className="relative">
                                    <div className="absolute inset-0 blur-md opacity-50" style={{ backgroundColor: rowAccent }} />
                                    <Check className="w-4 h-4 relative z-10" style={{ color: rowAccent }} strokeWidth={3} />
                                  </div>
                                ) : (
                                  <div className="w-2.5 h-2.5 rounded-full bg-white/10 border border-white/20" />
                                )}
                              </motion.div>
                            ) : (
                              <span className="text-white/[0.03] text-[10px] font-mono">·</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="glass p-12 flex flex-col items-center justify-center border-white/5 border-dashed">
            <Info className="w-8 h-8 text-white/10 mb-4" />
            <p className="text-sm text-white/30 italic">Detailed chart data not available for this expression.</p>
          </div>
        )}
      </section>
    </div>
  );
};
