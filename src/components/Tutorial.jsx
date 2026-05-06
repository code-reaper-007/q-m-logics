import React, { useState, useCallback } from 'react';
import { Joyride, STATUS } from 'react-joyride';
import { BookOpen, X } from 'lucide-react';

export const TutorialOverlay = ({ showTutorial, setShowTutorial, mode = 'SOP' }) => {
  const [run, setRun] = useState(showTutorial);
  const [stepIndex, setStepIndex] = useState(0);

  const cyan = '#00f3ff';
  const purple = '#bc13fe';
  const accent = mode === 'POS' ? purple : cyan;

  const steps = [
    {
      target: '[data-tutorial="mode-toggle"]',
      title: 'SOP vs POS Mode',
      content: 'Switch between Sum of Products (optimize for logic 1s) and Product of Sums (optimize for logic 0s). Each mode uses a different color scheme — Cyan for SOP, Purple for POS.',
      placement: 'bottom',
    },
    {
      target: '[data-tutorial="variables-slider"]',
      title: 'Variable Count',
      content: 'Select the number of input variables (2-10). More variables increase the truth table size exponentially (2^n rows).',
      placement: 'bottom',
    },
    {
      target: '[data-tutorial="minterms-input"]',
      title: 'Minterms / Maxterms',
      content: 'Enter the decimal indices where the output should be 1 (SOP) or 0 (POS). Separate values with commas. Example: 0, 1, 3, 7',
      placement: 'right',
    },
    {
      target: '[data-tutorial="dontcare-input"]',
      title: "Don't Care Conditions",
      content: "Specify inputs where the output doesn't matter. These help the algorithm find simpler expressions by treating them as either 0 or 1.",
      placement: 'right',
    },
    {
      target: '[data-tutorial="synthesize-btn"]',
      title: 'Synthesize',
      content: 'Click to run the Quine-McCluskey algorithm. Results appear across the Circuit, Steps, Walkthrough, and Table views.',
      placement: 'top',
    },
    {
      target: '[data-tutorial="tab-navigation"]',
      title: 'View Tabs',
      content: 'Circuit: Interactive logic gates with live simulation. Steps: Algorithm grouping tables. Walkthrough: Detailed step-by-step guide. Table: Full truth table.',
      placement: 'bottom',
    },
    {
      target: '[data-tutorial="circuit-canvas"]',
      title: 'Logic Canvas',
      content: 'Click input nodes (A, B, C...) to toggle their values between 0 and 1. Watch the signal propagate through the gates — active wires glow in the mode accent color.',
      placement: 'top',
    },
    {
      target: '[data-tutorial="analytics-hud"]',
      title: 'Analytics HUD',
      content: 'See the gate reduction percentage and estimated transistor count for your optimized circuit.',
      placement: 'left',
    },
  ];

  const handleJoyrideCallback = useCallback((data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false);
      setShowTutorial(false);
    }
    setStepIndex(data.index);
  }, [setShowTutorial]);

  return (
    <>
      <button
        onClick={() => {
          setRun(true);
          setStepIndex(0);
          setShowTutorial(true);
        }}
        className="p-3 rounded-full glass border border-white/10 hover:border-white/30 transition-all group"
        title="Start Tutorial"
      >
        <BookOpen className="w-4 h-4 text-white/60 transition-colors" style={{ color: run ? accent : undefined }} />
      </button>

      <Joyride
        steps={steps}
        run={run}
        stepIndex={stepIndex}
        continuous
        showProgress
        showSkipButton
        disableOverlayClose
        styles={{
          options: {
            primaryColor: accent,
            zIndex: 1000,
            arrowColor: '#141414',
          },
          tooltip: {
            backgroundColor: '#0a0a0a',
            borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.1)',
            fontSize: 14,
            padding: 24,
            maxWidth: 380,
            boxShadow: `0 20px 40px rgba(0,0,0,0.4), 0 0 20px ${accent}10`,
          },
          tooltipTitle: {
            color: '#ffffff',
            fontSize: 18,
            fontWeight: 800,
            marginBottom: 12,
            letterSpacing: '-0.02em',
          },
          tooltipContent: {
            color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.7,
          },
          buttonNext: {
            backgroundColor: accent,
            color: '#000',
            fontSize: 11,
            fontWeight: 900,
            padding: '10px 24px',
            borderRadius: 8,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          },
          buttonBack: {
            color: 'rgba(255,255,255,0.4)',
            marginRight: 12,
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
          },
          buttonSkip: {
            color: 'rgba(255,255,255,0.2)',
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
          },
          spotlight: {
            border: `1px solid ${accent}40`,
            borderRadius: 12,
            boxShadow: `0 0 40px ${accent}10`,
          },
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(4px)',
          },
        }}
        locale={{
          back: 'Back',
          close: <X className="w-4 h-4" />,
          last: 'Got it',
          next: 'Next',
          skip: 'Skip',
        }}
        callback={handleJoyrideCallback}
      />
    </>
  );
};
