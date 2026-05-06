import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Activity } from 'lucide-react';

export const AnalyticsHUD = ({ gateReduction, transistorCount, mode = 'SOP' }) => {
  const accent = mode === 'POS' ? '#bc13fe' : '#00f3ff';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="absolute bottom-8 right-8 flex gap-4 z-50 pointer-events-none"
      data-tutorial="analytics-hud"
    >
      <div className="glass px-6 py-4 flex items-center gap-4 pointer-events-auto shadow-2xl border border-white/5">
        <div className="w-10 h-10 rounded-full flex items-center justify-center border" style={{ backgroundColor: `${accent}10`, borderColor: `${accent}30` }}>
          <Activity className="w-5 h-5" style={{ color: accent }} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Gate Reduction</p>
          <p className="text-xl font-bold text-white">{gateReduction}%</p>
        </div>
      </div>

      <div className="glass px-6 py-4 flex items-center gap-4 pointer-events-auto shadow-2xl border border-white/5">
        <div className="w-10 h-10 rounded-full flex items-center justify-center border" style={{ backgroundColor: `${accent}10`, borderColor: `${accent}30` }}>
          <Cpu className="w-5 h-5" style={{ color: accent }} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Est. Transistors</p>
          <p className="text-xl font-bold text-white">{transistorCount}</p>
        </div>
      </div>
    </motion.div>
  );
};
