import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, BookOpen, Lightbulb, CheckCircle2 } from 'lucide-react';

export const Walkthrough = ({ results, variables, mode = 'SOP', minterms = [], dontCares = [] }) => {
  const [expandedStep, setExpandedStep] = useState(0);

  if (!results) return null;

  const cyan = '#00f3ff';
  const purple = '#bc13fe';
  const accent = mode === 'POS' ? purple : cyan;
  const varNames = Array.from({ length: variables }, (_, i) => String.fromCharCode(65 + i));

  const stepData = [
    {
      title: 'Step 1: Input Specification',
      content: (
        <div className="space-y-3">
          <p className="text-xs text-white/60">
            Define the function by specifying which input combinations produce output {mode === 'SOP' ? '1' : '0'}.
          </p>
          <div className="p-3 rounded-lg border border-white/5" style={{ backgroundColor: `${accent}08` }}>
            <p className="text-xs font-mono"><span className="text-white/40">Mode:</span> {mode === 'SOP' ? 'Sum of Products (optimize 1s)' : 'Product of Sums (optimize 0s)'}</p>
            <p className="text-xs font-mono mt-1"><span className="text-white/40">Variables:</span> {variables} ({varNames.join(', ')})</p>
            <p className="text-xs font-mono mt-1">
              <span className="text-white/40">{mode === 'SOP' ? 'Minterms' : 'Maxterms'}:</span>{' '}
              {minterms.length > 0 ? minterms.join(', ') : 'None'}
            </p>
            {dontCares.length > 0 && (
              <p className="text-xs font-mono mt-1"><span className="text-white/40">Don't Cares:</span> {dontCares.join(', ')}</p>
            )}
            <p className="text-xs font-mono mt-1"><span className="text-white/40">Simplified:</span> <span style={{ color: accent }}>{results.expression}</span></p>
          </div>
        </div>
      )
    },
    {
      title: 'Step 2: Binary Grouping (Weight/Set Bits)',
      content: (
        <div className="space-y-3">
          <p className="text-xs text-white/60">
            Each term is converted to binary and grouped by the number of 1s. Adjacent groups are compared to find pairs differing by exactly one bit.
          </p>
          {results.groupingSteps && results.groupingSteps.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="p-2 text-left text-white/40 font-bold">Group</th>
                    <th className="p-2 text-left text-white/40 font-bold">Binary</th>
                    <th className="p-2 text-left text-white/40 font-bold">Terms</th>
                    <th className="p-2 text-center text-white/40 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {results.groupingSteps[0] && Object.entries(results.groupingSteps[0]).map(([group, items]) =>
                    items.map((item, idx) => (
                      <tr key={`g0-${group}-${idx}`} className="border-b border-white/5">
                        <td className="p-2 font-mono text-white/30">{group}</td>
                        <td className="p-2 font-mono" style={{ color: accent }}>{item.binary}</td>
                        <td className="p-2 font-mono text-white/50">({item.terms.join(', ')})</td>
                        <td className="p-2 text-center">
                          {item.combined ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">Combined</span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400">Prime</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Step 3: Iterative Combination',
      content: (
        <div className="space-y-3">
          <p className="text-xs text-white/60">
            Terms differing by one bit are combined, replacing that bit with "-". Process repeats until no more combinations are possible.
          </p>
          {results.groupingSteps && results.groupingSteps.length > 1 ? (
            <div className="space-y-4">
              {results.groupingSteps.slice(1).map((step, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-white/5" style={{ backgroundColor: `${accent}08` }}>
                  <p className="text-[10px] font-bold text-white/40 uppercase mb-2">Iteration {idx + 2}</p>
                  {Object.entries(step).map(([group, items]) => (
                    <div key={group} className="mb-2">
                      <p className="text-[9px] text-white/30">Group {group}:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {items.map((item, i) => (
                          <span key={i} className="text-[10px] font-mono px-2 py-1 rounded bg-white/5" style={{ color: accent }}>
                            {item.binary}
                            <span className="text-white/30 ml-1">({item.terms.join(',')})</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-white/30 italic">No further combinations possible. All prime implicants found in Stage 1.</p>
          )}
        </div>
      )
    },
    {
      title: 'Step 4: Prime Implicant Chart',
      content: (
        <div className="space-y-3">
          <p className="text-xs text-white/60">
            Build a chart: rows = Prime Implicants, columns = minterms. X marks coverage. Essential PIs uniquely cover a minterm.
          </p>
          {results.chart && results.chart.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="p-2 text-left text-white/40 font-bold">PI</th>
                    {Object.keys(results.chart[0].covers).map(m => (
                      <th key={m} className="p-2 text-center text-white/40 font-bold">{m}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.chart.map((row, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="p-2 font-mono" style={{ color: accent }}>{row.pi}</td>
                      {Object.values(row.covers).map((covered, i) => (
                        <td key={i} className="p-2 text-center">
                          {covered ? (
                            <CheckCircle2 className="w-3 h-3 mx-auto" style={{ color: accent }} />
                          ) : (
                            <span className="text-white/10">-</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-white/30 italic">Chart data not available.</p>
          )}
        </div>
      )
    },
    {
      title: 'Step 5: Final Terms & Expression',
      content: (
        <div className="space-y-4">
          <p className="text-xs text-white/60">
            {results.finalTerms ? results.finalTerms.length : 0} essential/selected term(s) cover all minterms/maxterms.
          </p>
          {results.finalTerms && results.finalTerms.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {results.finalTerms.map((term, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-white/10" style={{ backgroundColor: `${accent}08` }}>
                  <p className="text-[10px] font-bold text-white/40 mb-1">Term {idx + 1}</p>
                  <p className="text-sm font-mono font-bold" style={{ color: accent }}>{term.binary}</p>
                  <p className="text-[10px] text-white/30 mt-1">Covers: ({term.terms.join(', ')})</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-white/30 italic">No final terms computed.</p>
          )}
          
          <div className="p-4 rounded-lg border border-white/10" style={{ backgroundColor: `${accent}08` }}>
            <p className="text-[10px] font-bold text-white/40 uppercase mb-2">Simplified Expression</p>
            <p className="text-lg font-mono font-bold" style={{ color: accent }}>{results.expression}</p>
          </div>

          {results.latex && (
            <div className="p-3 rounded-lg bg-white/5 border border-white/5">
              <p className="text-[10px] font-bold text-white/40 uppercase mb-2">LaTeX Format (copy for homework)</p>
              <code className="text-xs font-mono text-white/70 break-all">{results.latex}</code>
            </div>
          )}

          <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
            <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[10px] font-bold text-yellow-400 uppercase">Verification Tip</p>
              <p className="text-xs text-white/50 mt-1">
                Cross-check: count the literals in each term. The QM algorithm guarantees the minimum number of product/sum terms. Compare with your manual K-map solution.
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const [copied, setCopied] = useState(false);

  const handleCopyExpression = () => {
    if (!results.expression) return;
    navigator.clipboard.writeText(results.expression);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-5 h-5" style={{ color: accent }} />
        <h3 className="text-sm font-bold text-white/50 uppercase tracking-[0.2em]">Algorithm Walkthrough</h3>
        <span className="text-[10px] px-2 py-1 rounded font-mono" style={{ backgroundColor: `${accent}20`, color: accent }}>{mode}</span>
      </div>

      {stepData.map((step, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.08 }}
          className="glass border-white/5 overflow-hidden"
        >
          <button
            onClick={() => setExpandedStep(expandedStep === idx ? -1 : idx)}
            className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors"
          >
            <span className="text-xs font-bold text-white/70 text-left">{step.title}</span>
            {expandedStep === idx ? (
              <ChevronUp className="w-4 h-4 text-white/40 flex-shrink-0 ml-4" />
            ) : (
              <ChevronDown className="w-4 h-4 text-white/40 flex-shrink-0 ml-4" />
            )}
          </button>
          <AnimatePresence>
            {expandedStep === idx && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="px-4 pb-4 border-t border-white/5"
              >
                <div className="pt-4">
                  {idx === 4 && results.expression && (
                    <div className="mb-6 flex flex-col gap-3">
                      <div className="p-5 rounded-2xl glass border border-white/10 relative group overflow-hidden bg-gradient-to-br from-white/[0.02] to-transparent">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Copy Result</p>
                          <button 
                            onClick={handleCopyExpression}
                            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2 group/btn active:scale-95"
                          >
                            <AnimatePresence mode="wait">
                              {copied ? (
                                <motion.div
                                  key="copied"
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0.8, opacity: 0 }}
                                  className="flex items-center gap-2"
                                >
                                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                                  <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">Copied!</span>
                                </motion.div>
                              ) : (
                                <motion.div
                                  key="copy"
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0.8, opacity: 0 }}
                                  className="flex items-center gap-2"
                                >
                                  <div className="w-3.5 h-3.5 border-2 border-white/20 rounded-sm group-hover/btn:border-white/40 transition-colors" />
                                  <span className="text-[10px] font-black text-white/70 uppercase tracking-wider">Copy Plain Text</span>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </button>
                        </div>
                        <div className="bg-black/60 p-6 rounded-xl font-mono text-xl font-black text-white shadow-inner border border-white/5 break-all select-all tracking-tight" style={{ color: accent }}>
                          {results.expression}
                        </div>
                        <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                           <div className="w-24 h-24 bg-white/5 blur-3xl rounded-full -mr-12 -mt-12" />
                        </div>
                      </div>
                    </div>
                  )}
                  {idx !== 4 && step.content}
                  {idx === 4 && (
                     <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {results.finalTerms && results.finalTerms.map((term, i) => (
                              <div key={i} className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-between">
                                 <div>
                                    <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Term {i + 1}</p>
                                    <p className="text-sm font-mono font-bold text-white/80">{term.binary}</p>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Covers</p>
                                    <p className="text-[10px] font-mono text-white/40">{term.terms.join(', ')}</p>
                                 </div>
                              </div>
                           ))}
                        </div>

                        <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/[0.03] border border-yellow-500/10">
                          <Lightbulb className="w-5 h-5 text-yellow-400/60 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-[10px] font-black text-yellow-400/60 uppercase tracking-widest">Verification Protocol</p>
                            <p className="text-xs text-white/40 mt-1 leading-relaxed">
                              Compare this result with your manual K-Map calculation. The Quine-McCluskey engine ensures global optimization by selecting the absolute minimum number of prime implicants required to cover the function.
                            </p>
                          </div>
                        </div>
                     </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};
