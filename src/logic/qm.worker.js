import { QMEngine } from './qmEngine.js';

const MAX_COMPUTATION_TIME = 10000;
const MAX_VARIABLES = 10;
const MAX_TERMS = 1024;

self.onmessage = (e) => {
  const { variables, minterms, dontCares, mode } = e.data;
  
  if (typeof variables !== 'number' || variables < 2 || variables > MAX_VARIABLES) {
    self.postMessage({ success: false, error: 'Invalid variable count (2-10 allowed).' });
    return;
  }
  
  if (!Array.isArray(minterms) || !Array.isArray(dontCares)) {
    self.postMessage({ success: false, error: 'Invalid input format.' });
    return;
  }
  
  if (minterms.length > MAX_TERMS || dontCares.length > MAX_TERMS) {
    self.postMessage({ success: false, error: 'Too many terms. Maximum 1024 allowed.' });
    return;
  }
  
  const maxVal = Math.pow(2, variables);
  for (const term of [...minterms, ...dontCares]) {
    if (typeof term !== 'number' || term < 0 || term >= maxVal) {
      self.postMessage({ success: false, error: `Invalid term: ${term}. Must be between 0 and ${maxVal - 1}.` });
      return;
    }
  }

  const timeout = setTimeout(() => {
    self.postMessage({ success: false, error: 'Computation timed out. Try fewer terms or variables.' });
  }, MAX_COMPUTATION_TIME);
  
  try {
    const qm = new QMEngine(variables, minterms, dontCares, mode || 'SOP');
    const results = qm.solve();
    clearTimeout(timeout);
    self.postMessage({ success: true, results });
  } catch (error) {
    clearTimeout(timeout);
    self.postMessage({ success: false, error: error.message });
  }
};
