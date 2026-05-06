import React, { useState } from 'react';
import { Layers, Zap, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export const Dashboard = ({ before, after, simplifiedExpression, mode = 'SOP' }) => {
  const [copied, setCopied] = useState(false);
  const accent = mode === 'POS' ? '#bc13fe' : '#00f3ff';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(simplifiedExpression);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      const textarea = document.createElement('textarea');
      textarea.value = simplifiedExpression;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-6 flex items-center justify-between border border-white/5"
      >
        <div className="space-y-1">
          <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Original Terms</p>
          <p className="text-3xl font-bold text-white">{before}</p>
        </div>
        <Layers className="w-10 h-10 text-white/10" />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass p-6 flex items-center justify-between border border-white/5"
      >
        <div className="space-y-1">
          <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Optimized Terms</p>
          <p className="text-3xl font-bold" style={{ color: accent }}>{after}</p>
        </div>
        <Zap className="w-10 h-10 text-white/10" />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass p-6 border border-white/5 flex flex-col justify-center gap-3 relative"
      >
        <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Minimized Expression</p>
        <div className="flex items-center justify-between">
          <p className="text-lg font-mono font-bold truncate pr-10" style={{ color: accent }}>{simplifiedExpression}</p>
          <button 
            onClick={copyToClipboard}
            className="absolute right-6 p-2 rounded-md hover:bg-white/10 transition-colors text-white/40 hover:text-white"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
