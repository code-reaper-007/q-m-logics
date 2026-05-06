/**
 * Noctis Logic Pro - Bitmasking Quine-McCluskey Engine
 * Supports SOP (Minterms) and POS (Maxterms) modes.
 * Optimized for up to 10 variables using integer bitwise operations.
 */

function countBits(n) {
  let count = 0;
  while (n > 0) {
    count += n & 1;
    n >>= 1;
  }
  return count;
}

function isPowerOfTwo(n) {
  return n > 0 && (n & (n - 1)) === 0;
}

export class QMEngine {
  constructor(variables, minterms, dontCares = [], mode = 'SOP') {
    this.variables = variables;
    this.minterms = [...new Set(minterms)].sort((a, b) => a - b);
    this.dontCares = [...new Set(dontCares)].sort((a, b) => a - b);
    this.mode = mode;
  }

  cloneGroups(groups) {
    return groups.map(g => g.map(t => ({...t})));
  }

  solve() {
    const termsToOptimize = this.minterms;

    if (termsToOptimize.length === 0 && this.dontCares.length === 0) {
      return {
        groupingSteps: [],
        chart: [],
        finalTerms: [],
        expression: this.mode === 'SOP' ? "0" : "1",
        latex: this.mode === 'SOP' ? "$$0$$" : "$$1$$",
        mode: this.mode
      };
    }

    let allTerms = [...new Set([...termsToOptimize, ...this.dontCares])].sort((a, b) => a - b);
    let groups = Array.from({ length: this.variables + 1 }, () => []);

    for (const m of allTerms) {
      groups[countBits(m)].push({
        value: m,
        mask: 0,
        combined: false,
        coveredMinterms: [m]
      });
    }

    let primeImplicants = [];
    let groupingSteps = [this.cloneGroups(groups)];

    let hasCombined = true;
    while (hasCombined) {
      hasCombined = false;
      let nextGroups = Array.from({ length: this.variables + 1 }, () => []);
      let termSet = new Set();

      for (let i = 0; i < groups.length - 1; i++) {
        for (let t1 of groups[i]) {
          for (let t2 of groups[i + 1]) {
            if (t1.mask === t2.mask) {
              let diff = t1.value ^ t2.value;
              if (isPowerOfTwo(diff)) {
                t1.combined = true;
                t2.combined = true;
                hasCombined = true;

                let newMask = t1.mask | diff;
                let newValue = t1.value & ~newMask;
                let key = `${newValue}-${newMask}`;

                if (!termSet.has(key)) {
                  termSet.add(key);
                  let combinedMinterms = [...new Set([...t1.coveredMinterms, ...t2.coveredMinterms])].sort((a, b) => a - b);
                  nextGroups[countBits(newValue)].push({
                    value: newValue,
                    mask: newMask,
                    combined: false,
                    coveredMinterms: combinedMinterms
                  });
                }
              }
            }
          }
        }
      }

      for (let g of groups) {
        for (let t of g) {
          if (!t.combined) {
            primeImplicants.push(t);
          }
        }
      }

      if (hasCombined) {
        groupingSteps.push(this.cloneGroups(nextGroups));
        groups = nextGroups;
      }
    }

    let uniquePIs = [];
    let piSet = new Set();
    for (let pi of primeImplicants) {
      let k = `${pi.value}-${pi.mask}`;
      if (!piSet.has(k)) {
        piSet.add(k);
        uniquePIs.push(pi);
      }
    }

    const { chart, finalTerms } = this.solveChart(uniquePIs, termsToOptimize);
    const formattedFinalTerms = this.formatTermsForUI(finalTerms);

    return {
      groupingSteps: this.formatStepsForUI(groupingSteps),
      chart: this.formatChartForUI(chart),
      finalTerms: formattedFinalTerms,
      expression: this.formatExpression(formattedFinalTerms),
      latex: this.formatLatex(formattedFinalTerms),
      mode: this.mode
    };
  }

  solveChart(primeImplicants, termsToCover) {
    const chart = primeImplicants.map(pi => {
      const covers = {};
      termsToCover.forEach(m => {
        covers[m] = pi.coveredMinterms.includes(m);
      });
      return { pi, covers, isEssential: false, isSelected: false };
    });

    let remainingMinterms = new Set(termsToCover);
    let essentialPIs = [];

    termsToCover.forEach(m => {
      if (!remainingMinterms.has(m)) return;
      const coveringRows = chart.filter(row => row.covers[m]);
      if (coveringRows.length === 1) {
        const row = coveringRows[0];
        if (!essentialPIs.includes(row.pi)) {
          essentialPIs.push(row.pi);
          row.isEssential = true;
          row.isSelected = true;
          row.pi.coveredMinterms.forEach(t => remainingMinterms.delete(t));
        }
      }
    });

    let finalTerms = [...essentialPIs];
    while (remainingMinterms.size > 0) {
      let bestRow = null;
      let maxCover = 0;

      chart.forEach(row => {
        if (row.isSelected) return;
        let coverCount = 0;
        row.pi.coveredMinterms.forEach(t => {
          if (remainingMinterms.has(t)) coverCount++;
        });

        if (coverCount > maxCover) {
          maxCover = coverCount;
          bestRow = row;
        }
      });

      if (bestRow && maxCover > 0) {
        finalTerms.push(bestRow.pi);
        bestRow.isSelected = true;
        bestRow.pi.coveredMinterms.forEach(t => remainingMinterms.delete(t));
      } else {
        break;
      }
    }

    return { chart, finalTerms };
  }

  toBinaryString(value, mask) {
    let str = '';
    for (let i = this.variables - 1; i >= 0; i--) {
      if ((mask & (1 << i)) !== 0) {
        str += '-';
      } else {
        str += ((value & (1 << i)) !== 0) ? '1' : '0';
      }
    }
    return str;
  }

  formatStepsForUI(groupingSteps) {
    return groupingSteps.map(groups => {
      let formattedGroups = {};
      groups.forEach((g, idx) => {
        if (g.length > 0) {
          formattedGroups[idx] = g.map(t => ({
            binary: this.toBinaryString(t.value, t.mask),
            terms: t.coveredMinterms,
            combined: t.combined
          }));
        }
      });
      return formattedGroups;
    });
  }

  formatChartForUI(chart) {
    return chart.map(row => ({
      pi: this.toBinaryString(row.pi.value, row.pi.mask),
      covers: row.covers,
      terms: row.pi.coveredMinterms,
      isEssential: row.isEssential,
      isSelected: row.isSelected
    }));
  }

  formatTermsForUI(terms) {
    return terms.map(t => ({
      binary: this.toBinaryString(t.value, t.mask),
      terms: t.coveredMinterms
    }));
  }

  binaryToTermSOP(binary) {
    let part = "";
    for (let i = 0; i < binary.length; i++) {
      if (binary[i] !== '-') {
        const varName = String.fromCharCode(65 + i);
        if (binary[i] === '1') {
          part += varName;
        } else {
          part += varName + "'";
        }
      }
    }
    return part || "1";
  }

  binaryToTermPOS(binary) {
    let literals = [];
    for (let i = 0; i < binary.length; i++) {
      if (binary[i] !== '-') {
        const varName = String.fromCharCode(65 + i);
        if (binary[i] === '1') {
          literals.push(varName + "'");
        } else {
          literals.push(varName);
        }
      }
    }
    return literals.length > 0 ? literals.join(" + ") : "1";
  }

  formatExpression(finalTerms) {
    if (finalTerms.length === 0) {
      return this.mode === 'SOP' ? "0" : "1";
    }

    const allOnes = finalTerms.every(t => t.binary.split('').every(c => c === '-'));
    if (allOnes) {
      return this.mode === 'SOP' ? "1" : "0";
    }

    return finalTerms.map(term => {
      return this.mode === 'SOP'
        ? this.binaryToTermSOP(term.binary)
        : `(${this.binaryToTermPOS(term.binary)})`;
    }).join(this.mode === 'SOP' ? " + " : " · ");
  }

  formatLatex(finalTerms) {
    if (finalTerms.length === 0) {
      return this.mode === 'SOP' ? "$$0$$" : "$$1$$";
    }

    const allOnes = finalTerms.every(t => t.binary.split('').every(c => c === '-'));
    if (allOnes) {
      return this.mode === 'SOP' ? "$$1$$" : "$$0$$";
    }

    const terms = finalTerms.map(term => {
      if (this.mode === 'SOP') {
        return this.binaryToTermSOP(term.binary).replace(/([A-Z])'/g, "\\overline{$1}");
      } else {
        return this.binaryToTermPOS(term.binary).replace(/([A-Z])'/g, "\\overline{$1}");
      }
    });

    if (this.mode === 'SOP') {
      return `$$${terms.join(" + ")}$$`;
    } else {
      return `$$${terms.map(t => `\\left(${t}\\right)`).join(" \\cdot ")}$$`;
    }
  }
}
