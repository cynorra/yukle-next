// node scripts/lib/weight-rules.test.mjs — hand-calculated cases for 49 CFR 390.5 (CMV) and 383.5 (CDL groups).
import assert from 'node:assert/strict';
import { weightRules } from '../../src/lib/tools/calculations.ts';
const w = (powerGvwr, towedGvwr, interstate = true, placardedHazmat = false, actualWeight) => weightRules({ powerGvwr, towedGvwr, interstate, placardedHazmat, actualWeight });
let r;
r = w(9500, 0); assert.deepEqual([r.federalCmv, r.cdlGroup], [false, null]);                 // cargo van
r = w(9900, 7000); assert.deepEqual([r.weightForCmv, r.federalCmv, r.cdlGroup], [16900, true, null]); // pickup + trailer
r = w(16000, 0); assert.deepEqual([r.federalCmv, r.cdlGroup], [true, null]);                 // box truck
r = w(26001, 0); assert.deepEqual([r.federalCmv, r.cdlGroup], [true, 'B']);                  // heavy straight vehicle
r = w(26000, 0); assert.equal(r.cdlGroup, null);
r = w(26000, 10000); assert.deepEqual([r.weightForCmv, r.cdlGroup], [36000, null]);          // towed unit not over 10,000
r = w(26000, 10001); assert.equal(r.cdlGroup, 'A');                                           // towed unit over 10,000 and combination >= 26,001
r = w(26001, 10000); assert.equal(r.cdlGroup, 'B');                                           // heavy truck with a small trailer
r = w(20000, 10001); assert.deepEqual([r.weightForCmv, r.cdlGroup], [30001, 'A']);
r = w(9500, 0, true, true); assert.deepEqual([r.federalCmv, r.cdlGroup], [true, 'C']);       // placarded hazmat at any size
r = w(16000, 0, false); assert.deepEqual([r.federalCmv, r.cdlGroup], [false, null]);         // intrastate: not a federal CMV
r = w(26001, 0, false); assert.deepEqual([r.federalCmv, r.cdlGroup], [false, 'B']);          // CDL still applies intrastate (390.3(b))
r = w(9000, 0, true, false, 10500); assert.deepEqual([r.weightForCmv, r.federalCmv], [10500, true]); // actual weight above rating
assert.equal(weightRules({ powerGvwr: 0, towedGvwr: 0, interstate: true, placardedHazmat: false }), null);
console.log('weight-rules tests passed');
