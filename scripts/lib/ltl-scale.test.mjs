// node scripts/lib/ltl-scale.test.mjs  — checks the NMFC standard density scale and the article's worked examples.
import assert from 'node:assert/strict';
import { ltlDensity, standardScaleClass, NMFC_STANDARD_DENSITY_SCALE } from '../../src/lib/tools/calculations.ts';

assert.equal(NMFC_STANDARD_DENSITY_SCALE.length, 13);
// boundaries: lower bound inclusive, upper exclusive
const cases = [[0.5,400],[1,300],[1.99,300],[2,250],[4,175],[6,125],[7.99,125],[8,100],[9,100],[9.99,100],[10,92.5],[12,85],[15,70],[22.5,65],[30,60],[35,55],[49.9,55],[50,50],[120,50]];
for (const [d, c] of cases) assert.equal(standardScaleClass(d), c, `${d} pcf`);
// NMFTA's published example: 48x40x45, 450 lb = 9.00 pcf
const nmfta = ltlDensity({ length: 48, width: 40, height: 45, weight: 450, units: 1 });
assert.equal(nmfta.cubicInches, 86400); assert.equal(nmfta.cubicFeet, 50); assert.equal(nmfta.densityPcf, 9);
assert.equal(standardScaleClass(nmfta.densityPcf), 100);
// Article example 2: 52x44x60, 600 lb vs. under-measured height 54
const full = ltlDensity({ length: 52, width: 44, height: 60, weight: 600, units: 1 });
assert.equal(full.cubicInches, 137280); assert.ok(Math.abs(full.cubicFeet - 79.4444) < 1e-3); assert.ok(Math.abs(full.densityPcf - 7.5524) < 1e-3);
assert.equal(standardScaleClass(full.densityPcf), 125);
const short = ltlDensity({ length: 52, width: 44, height: 54, weight: 600, units: 1 });
assert.equal(short.cubicInches, 123552); assert.equal(short.cubicFeet, 71.5); assert.ok(Math.abs(short.densityPcf - 8.3916) < 1e-3);
assert.equal(standardScaleClass(short.densityPcf), 100);
// Article example 3: two units, per-unit vs total-only
const a = ltlDensity({ length: 48, width: 40, height: 30, weight: 400, units: 1 });
const b = ltlDensity({ length: 48, width: 40, height: 60, weight: 200, units: 1 });
assert.ok(Math.abs(a.cubicFeet - 33.3333) < 1e-3); assert.ok(Math.abs(a.densityPcf - 12) < 1e-9); assert.equal(standardScaleClass(a.densityPcf), 85);
assert.ok(Math.abs(b.cubicFeet - 66.6667) < 1e-3); assert.ok(Math.abs(b.densityPcf - 3) < 1e-9); assert.equal(standardScaleClass(b.densityPcf), 250);
const totalCube = a.cubicFeet + b.cubicFeet; assert.ok(Math.abs(totalCube - 100) < 1e-9);
assert.equal(standardScaleClass(600 / totalCube), 125);
// Boundary: 0.5 inch on a 48x40x45 pallet at 450 lb
const edge = ltlDensity({ length: 48, width: 40, height: 45, weight: 450, units: 1 });
assert.ok(edge.densityPcf < 10);
console.log('ltl-scale tests passed');
