import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { GroupingTables } from './components/GroupingTables';
import { TruthTable } from './components/TruthTable';
import { CircuitCanvas } from './components/CircuitCanvas';
import { AnalyticsHUD } from './components/AnalyticsHUD';
import { Walkthrough } from './components/Walkthrough';
import { TutorialOverlay } from './components/Tutorial';
import { LabReportExport } from './components/LabReportExport';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [variables, setVariables] = useState(4);
  const [mintermsInput, setMintermsInput] = useState("0, 1, 3, 7");
  const [dontCaresInput, setDontCaresInput] = useState("");
  const [isSolving, setIsSolving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState("circuit");
  const [mode, setMode] = useState("SOP");
  const [showTutorial, setShowTutorial] = useState(false);

  const workerRef = useRef(null);

  const parseNumbers = useCallback((input, maxVal) => {
    return input
      .split(',')
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n) && n >= 0 && n <= 15 && n < maxVal);
  }, []);

  const handleSolve = useCallback(() => {
    if (workerRef.current) {
      setIsLoading(true);
      setError(null);
      const maxVal = Math.pow(2, variables);
      const minterms = parseNumbers(mintermsInput, maxVal);
      const dontCares = parseNumbers(dontCaresInput, maxVal);
      workerRef.current.postMessage({ variables, minterms, dontCares, mode });
    }
  }, [variables, mintermsInput, dontCaresInput, mode, parseNumbers]);

  useEffect(() => {
    workerRef.current = new Worker(new URL('./logic/qm.worker.js', import.meta.url), { type: 'module' });
    
    workerRef.current.onmessage = (e) => {
      setIsLoading(false);
      setIsSolving(false);
      if (e.data.success) {
        setResults(e.data.results);
        setError(null);
      } else {
        setError(e.data.error);
        setResults(null);
      }
    };

    workerRef.current.onerror = (err) => {
      console.error("Worker error:", err);
      setError("An unexpected error occurred in logic engine.");
      setIsLoading(false);
      setIsSolving(false);
    };

    return () => {
      if (workerRef.current) workerRef.current.terminate();
    };
  }, []);

  useEffect(() => {
    handleSolve();
  }, [handleSolve]);

  const analytics = useMemo(() => {
    if (!results || !results.finalTerms || results.finalTerms.length === 0) {
      return { reduction: 0, transistors: 0, before: 0, after: 0 };
    }
    
    const termCount = parseNumbers(mintermsInput, Math.pow(2, variables)).length;
    const initialGates = termCount > 0 ? termCount : 1;
    
    let minimizedGates = 0;
    let transistors = 0;
    const terms = results.finalTerms;
    const notGates = new Set();
    
    terms.forEach(term => {
      const literals = term.binary.replace(/-/g, '').length;
      if (literals > 1) {
        minimizedGates++;
        transistors += (2 * literals) + 2;
      } else if (literals === 1) {
        minimizedGates++;
        transistors += 2;
      }
      for (let i = 0; i < term.binary.length; i++) {
        if (term.binary[i] === '0' && !notGates.has(i)) {
          notGates.add(i);
          minimizedGates++;
          transistors += 2;
        }
      }
    });

    if (terms.length > 1) {
      minimizedGates++;
      transistors += (2 * terms.length) + 2;
    } else if (terms.length === 1 && terms[0].binary.replace(/-/g, '').length === 1) {
      minimizedGates = notGates.size + 1;
      transistors = 2 * minimizedGates;
    }

    const reduction = initialGates > 0 ? Math.max(0, Math.round(((initialGates - minimizedGates) / initialGates) * 100)) : 0;
    
    return { 
      reduction, 
      transistors, 
      before: initialGates, 
      after: minimizedGates 
    };
  }, [results, mintermsInput, variables, parseNumbers]);

  const minterms = useMemo(() => 
    parseNumbers(mintermsInput, Math.pow(2, variables)),
    [mintermsInput, variables, parseNumbers]
  );

  const dontCares = useMemo(() => 
    parseNumbers(dontCaresInput, Math.pow(2, variables)),
    [dontCaresInput, variables, parseNumbers]
  );

  const accentColor = mode === 'POS' ? '#bc13fe' : '#00f3ff';

  return (
    <div 
      className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans"
      style={{ '--accent': accentColor }}
    >
      <Sidebar 
        variables={variables}
        setVariables={setVariables}
        mintermsInput={mintermsInput}
        setMintermsInput={setMintermsInput}
        dontCaresInput={dontCaresInput}
        setDontCaresInput={setDontCaresInput}
        onSolve={handleSolve}
        isSolving={isSolving}
        mode={mode}
        setMode={setMode}
      />

      <main className="flex-1 flex flex-col relative z-10">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-xl flex items-center gap-3 text-red-400 text-xs font-bold shadow-2xl"
          >
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            {error}
            <button onClick={() => setError(null)} className="ml-4 hover:text-white transition-colors">Dismiss</button>
          </motion.div>
        )}

        <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 relative z-10 backdrop-blur-md">
          <div className="flex gap-8 h-full" data-tutorial="tab-navigation">
            {["circuit", "steps", "walkthrough", "table"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`h-full px-2 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative group ${
                  activeTab === tab ? "text-white" : "text-white/30 hover:text-white/60"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1"
                    style={{ backgroundColor: accentColor }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6">
            {results && (
              <LabReportExport 
                results={results} 
                variables={variables} 
                minterms={minterms}
                dontCares={dontCares}
                mode={mode}
              />
            )}
            <TutorialOverlay showTutorial={showTutorial} setShowTutorial={setShowTutorial} mode={mode} />
          </div>
        </header>

        <div className="flex-1 relative p-8 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${mode}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
              className="h-full flex flex-col"
            >
              {results && activeTab === "circuit" && (
                <div className="flex flex-col gap-6 h-full overflow-y-auto pr-2 custom-scrollbar">
                  <Dashboard 
                    before={analytics.before}
                    after={analytics.after}
                    simplifiedExpression={results.expression}
                    mode={mode}
                  />
                  <CircuitCanvas 
                    finalTerms={results.finalTerms} 
                    variables={variables}
                    mode={mode}
                  />
                  <AnalyticsHUD 
                    gateReduction={analytics.reduction} 
                    transistorCount={analytics.transistors}
                    mode={mode}
                  />
                </div>
              )}

              {results && activeTab === "steps" && (
                <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar min-h-0">
                  <GroupingTables steps={results} mode={mode} />
                </div>
              )}

              {results && activeTab === "walkthrough" && (
                <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar min-h-0">
                  <Walkthrough 
                    results={results} 
                    variables={variables} 
                    mode={mode} 
                    minterms={minterms}
                    dontCares={dontCares}
                  />
                </div>
              )}

              {activeTab === "table" && (
                <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar min-h-0">
                  <TruthTable 
                    variables={variables} 
                    minterms={minterms}
                    dontCares={dontCares}
                    mode={mode}
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default App;
