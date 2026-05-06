import { QMEngine } from './qmEngine.js';

self.onmessage = (e) => {
  const { variables, minterms, dontCares, mode } = e.data;
  
  try {
    const qm = new QMEngine(variables, minterms, dontCares, mode || 'SOP');
    const results = qm.solve();
    self.postMessage({ success: true, results });
  } catch (error) {
    self.postMessage({ success: false, error: error.message });
  }
};
