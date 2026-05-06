import { QMEngine } from './src/logic/qmEngine.js';

console.log("Testing Noctis Logic Pro - Bitmasking QM Engine");

// Test 1: Simple 4 variables
// Minterms: 0(0000), 1(0001), 3(0011), 7(0111) 
// Expected SOP: A'B'C' + A'CD
const qm1 = new QMEngine(4, [0, 1, 3, 7]);
const result1 = qm1.solve();
console.log("Test 1 (4 vars SOP):", result1.expression === "A'B'C' + A'CD" ? "PASS" : "FAIL", "->", result1.expression);

// Test 2: 10 variables, complex (takes long with strings, should be fast with bitmasking)
const minterms10 = [0, 1, 2, 3, 4, 5, 6, 7, 1022, 1023]; 
const qm2 = new QMEngine(10, minterms10);
const start = performance.now();
const result2 = qm2.solve();
const end = performance.now();
console.log("Test 2 (10 vars SOP):", result2.expression === "A'B'C'D'E'F'G' + ABCDEFGHI" ? "PASS" : "FAIL", "->", result2.expression);
console.log(`Execution time for 10 variables: ${(end - start).toFixed(2)} ms`);

// Test 3: POS Mode
// Maxterms: 0, 1, 2 (Variables: 2) -> (A+B) · (A+B') · (A'+B) 
// Simplified POS: (A) · (B) -> No, Wait. 
// Maxterms 0(00), 1(01), 2(10) -> Only 3(11) is 1. 
// Function is AB. POS of AB is (A)(B)? No, (A+B') etc?
// Maxterms 0, 1, 2 means 3 is the only minterm.
// 0: 00 -> (A+B)
// 1: 01 -> (A+B')
// 2: 10 -> (A'+B)
// (0, 1) combine to 0- -> (A)
// (0, 2) combine to -0 -> (B)
// Result: (A) · (B)
const qm3 = new QMEngine(2, [0, 1, 2], [], 'POS');
const result3 = qm3.solve();
console.log("Test 3 (2 vars POS):", result3.expression === "(A) · (B)" ? "PASS" : "FAIL", "->", result3.expression);

// Test 4: All ones
const qm4 = new QMEngine(2, [0, 1, 2, 3]);
const result4 = qm4.solve();
console.log("Test 4 (All ones SOP):", result4.expression === "1" ? "PASS" : "FAIL", "->", result4.expression);

// Test 5: All zeros
const qm5 = new QMEngine(2, []);
const result5 = qm5.solve();
console.log("Test 5 (All zeros SOP):", result5.expression === "0" ? "PASS" : "FAIL", "->", result5.expression);

