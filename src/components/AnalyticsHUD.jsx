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
      className="fixed bottom-4 right-4 lg:bottom-8 lg:right-8 flex gap-3 lg:gap-4 z-50 pointer-events-none"
      data-tutorial="analytics-hud"
    >
      <div className="glass px-4 lg:px-6 py-3 lg:py-4 flex items-center gap-3 lg:gap-4 pointer-events-auto shadow-2xl border border-white/5">
        <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center border" style={{ backgroundColor: `${accent}10`, borderColor: `${accent}30` }}>
          <Activity className="w-4 h-4 lg:w-5 lg:h-5" style={{ color: accent }} />
        </div>
        <div>
          <p className="text-[9px] lg:text-[10px] font-bold text-white/50 uppercase tracking-widest">Reduction</p>
          <p className="text-lg lg:text-xl font-bold text-white">{gateReduction}%</p>
        </div>
      </div>

      <div className="glass px-4 lg:px-6 py-3 lg:py-4 flex items-center gap-3 lg:gap-4 pointer-events-auto shadow-2xl border border-white/5">
        <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center border" style={{ backgroundColor: 'rgba(188,19,254,0.1)', borderColor: 'rgba(188,19,254,0.3)' }}>
          <Cpu className="w-4 h-4 lg:w-5 lg:h-5 text-accent-purple" />
        </div>
        <div>
          <p className="text-[9px] lg:text-[10px] font-bold text-white/50 uppercase tracking-widest">Transistors</p>
          <p className="text-lg lg:text-xl font-bold text-white">{transistorCount}</p>
        </div>
      </div>
    </motion.div>
  );
};
