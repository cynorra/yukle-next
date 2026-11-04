// node scripts/lib/bridge-formula.test.mjs — checks bridgeFormula() against FHWA's published Bridge Table
// (FHWA-HOP-19-028, pp. 5-6; values below transcribed from the table) and the article's worked example.
import assert from 'node:assert/strict';
import { bridgeFormula } from '../../src/lib/tools/calculations.ts';

const W = (n, l) => bridgeFormula(n, l).formulaWeight;
// [N, L, table value]
const table = [
  [3, 10, 43500], [3, 20, 51000], [3, 24, 54000], [3, 32, 60000],
  [4, 12, 50000], [4, 14, 51500], [4, 20, 55500], [4, 23, 57500], [4, 24, 58000], [4, 35, 65500],
  [5, 20, 60500], [5, 24, 63000], [5, 36, 70500], [5, 40, 73000], [5, 48, 78000], [5, 50, 79000], [5, 51, 80000],
  [6, 20, 66000], [6, 24, 68500], [6, 30, 72000], [6, 36, 75500], [6, 40, 78000],
  [7, 24, 74000], [8, 28, 82000], [9, 32, 90000], [9, 60, 105500],
  // exact-half cases: FHWA rounds down (raw formula gives 42,750 and 50,250 and 57,750)
  [3, 9, 42500],
];
for (const [n, l, w] of table) assert.equal(W(n, l), w, `N=${n} L=${l}`);
assert.equal(bridgeFormula(3, 9).rawWeight, 42750);
assert.equal(bridgeFormula(3, 9).halfwayRoundedDown, true);
assert.equal(bridgeFormula(4, 23).halfwayRoundedDown, false);
assert.equal(bridgeFormula(5, 51).halfwayRoundedDown, false);
// FHWA example: axles 1-4 of the single-unit truck, L=23, N=4 -> 57,500
assert.equal(W(4, 23), 57500);
// tandem check: N=2, L=4 -> 34,000
assert.equal(W(2, 4), 34000);

// Article worked example: axle positions 0, 15, 19, 44, 48 ft; weights 12,000 / 16,500 x4
const pos = [0, 15, 19, 44, 48], wt = [12000, 16500, 16500, 16500, 16500];
const rows = [];
for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) {
  const n = j - i + 1, l = pos[j] - pos[i];
  const actual = wt.slice(i, j + 1).reduce((a, b) => a + b, 0);
  rows.push({ g: `${i + 1}-${j + 1}`, n, l, actual, max: Math.min(W(n, l), 80000) });
}
const byG = Object.fromEntries(rows.map((r) => [r.g, r]));
assert.equal(byG['1-2'].max, 45000);
assert.equal(byG['1-3'].max, 50000);
assert.equal(byG['1-4'].max, 71500);
assert.equal(byG['1-5'].max, 78000); assert.equal(byG['1-5'].actual, 78000);
assert.equal(byG['2-4'].max, 57500);
assert.equal(byG['2-5'].max, 64000); assert.equal(byG['2-5'].actual, 66000);
assert.equal(byG['3-4'].max, 55000);
assert.equal(byG['3-5'].max, 57500);
const over = rows.filter((r) => r.actual > r.max && !['2-3', '4-5'].includes(r.g)).map((r) => r.g);
assert.deepEqual(over, ['2-5']);
// Fix: slide trailer tandem back 3 ft -> L(2-5)=36 ft, 34,000 tandem exception applies; 66,000 also fits the formula (500*(36*4/3+84)=66,000)
assert.equal(W(4, 36), 66000);
console.log('bridge-formula tests passed');
for (const r of rows) console.log(r.g, 'N', r.n, 'L', r.l, 'actual', r.actual, 'max', r.max);
