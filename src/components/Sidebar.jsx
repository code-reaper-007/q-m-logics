import React from 'react';
import { List, Hash, Settings2, X } from 'lucide-react';
import { AdUnit } from './AdUnit';

export const Sidebar = ({ 
  variables, 
  setVariables, 
  mintermsInput, 
  setMintermsInput, 
  dontCaresInput, 
  setDontCaresInput,
  onSolve,
  isSolving,
  mode,
  setMode,
  onClose
}) => {
  const accentColor = mode === 'POS' ? '#bc13fe' : '#00f3ff';

  return (
    <aside className="w-80 h-full border-r border-white/5 bg-[#050505] flex flex-col p-4 lg:p-6 gap-6 lg:gap-8 overflow-y-auto relative z-50 shadow-[10px_0_30px_rgba(0,0,0,0.8)]">
      <button 
        onClick={onClose}
        className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
      >
        <X className="w-5 h-5 text-white/50" />
      </button>

      <div className="mt-2">
        <h1 className="text-xl font-bold tracking-tight text-white">Q-M Logics</h1>
      </div>

      <div className="space-y-6 lg:space-y-8 mt-2">
        <div className="space-y-4">
          <label className="text-xs font-bold text-white/50 uppercase tracking-wider flex items-center gap-2">
            <Settings2 className="w-4 h-4" />
            Optimization Mode
          </label>
          <div className="flex rounded-xl border border-white/10 overflow-hidden">
            <button
              onClick={() => setMode('SOP')}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 ${
                mode === 'SOP' 
                  ? 'bg-accent-cyan/10 text-accent-cyan border-r border-accent-cyan/30 shadow-[inset_0_0_20px_rgba(0,243,255,0.1)]' 
                  : 'bg-white/[0.02] text-white/30 hover:bg-white/[0.05]'
              }`}
            >
              SOP
            </button>
            <button
              onClick={() => setMode('POS')}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 ${
                mode === 'POS' 
                  ? 'bg-accent-purple/10 text-accent-purple shadow-[inset_0_0_20px_rgba(188,19,254,0.1)]' 
                  : 'bg-white/[0.02] text-white/30 hover:bg-white/[0.05]'
              }`}
            >
              POS
            </button>
          </div>
          <p className="text-[10px] text-white/30">
            {mode === 'SOP' ? 'Optimize for logic 1s (Minterms)' : 'Optimize for logic 0s (Maxterms)'}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-white/50 uppercase tracking-wider flex items-center gap-2">
              <Settings2 className="w-4 h-4" />
              Variables
            </label>
            <span className="font-mono font-bold" style={{ color: accentColor }}>{variables}</span>
          </div>
          <input 
            type="range" 
            min="2" 
            max="10" 
            value={variables} 
            onChange={(e) => setVariables(parseInt(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
            style={{ accentColor }}
          />
          <div className="flex justify-between text-[9px] text-white/30 font-mono">
            <span>2</span>
            <span>10</span>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-white/50 uppercase tracking-wider flex items-center gap-2">
            <List className="w-4 h-4" />
            {mode === 'SOP' ? 'Minterms (1s)' : 'Maxterms (0s)'}
          </label>
          <textarea
            value={mintermsInput}
            onChange={(e) => setMintermsInput(e.target.value.replace(/[^0-9,\s-]/g, ''))}
            placeholder={mode === 'SOP' ? "e.g. 0, 1, 3, 7" : "e.g. 0, 2, 5, 6"}
            className="w-full h-20 lg:h-28 bg-white/[0.02] border border-white/10 rounded-xl p-3 lg:p-4 text-white font-mono text-sm focus:outline-none transition-all resize-none shadow-inner"
            onFocus={(e) => e.target.style.borderColor = `${accentColor}80`}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-white/50 uppercase tracking-wider flex items-center gap-2">
            <Hash className="w-4 h-4" />
            Don't Cares
          </label>
          <textarea
            value={dontCaresInput}
            onChange={(e) => setDontCaresInput(e.target.value.replace(/[^0-9,\s-]/g, ''))}
            placeholder="e.g. 2, 5"
            className="w-full h-16 lg:h-20 bg-white/[0.02] border border-white/10 rounded-xl p-3 lg:p-4 text-white font-mono text-sm focus:outline-none transition-all resize-none shadow-inner"
            onFocus={(e) => e.target.style.borderColor = `${accentColor}80`}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
        </div>

        <button
          onClick={onSolve}
          disabled={isSolving}
          className={`w-full h-12 lg:h-14 rounded-xl font-bold uppercase tracking-[0.2em] text-xs transition-all duration-300 relative overflow-hidden group ${
            isSolving 
              ? 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed' 
              : 'bg-white/5 border border-white/20 text-white hover:shadow-[0_0_20px_rgba(0,243,255,0.2)]'
          }`}
          onMouseEnter={(e) => {
            if (!isSolving) {
              e.target.style.borderColor = accentColor;
              e.target.style.boxShadow = `0 0 20px ${accentColor}33`;
            }
          }}
          onMouseLeave={(e) => {
            if (!isSolving) {
              e.target.style.borderColor = 'rgba(255,255,255,0.2)';
              e.target.style.boxShadow = 'none';
            }
          }}
        >
          {isSolving ? (
            <span className="flex items-center justify-center gap-3">
              <span className="w-4 h-4 border-2 border-white/20 border-t-accent-cyan rounded-full animate-spin" />
              Minimizing...
            </span>
          ) : (
            <span className="relative z-10 flex items-center justify-center gap-2">
              <ZapIcon className="w-4 h-4 group-hover:animate-pulse" style={{ color: accentColor }} />
              Synthesize
            </span>
          )}
          {!isSolving && (
            <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan/0 via-accent-cyan/10 to-accent-cyan/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          )}
        </button>

        <AdUnit type="sidebar" className="!h-[200px] lg:!h-[250px]" />
      </div>
    </aside>
  );
};

const ZapIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
);
