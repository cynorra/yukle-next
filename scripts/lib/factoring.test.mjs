// node scripts/lib/factoring.test.mjs — hand-calculated cases for the factoring arithmetic.
import assert from 'node:assert/strict';
import { factoringNet } from '../../src/lib/tools/calculations.ts';
let r = factoringNet({ invoice: 2000, advancePct: 90, feePct: 3, daysEarly: 30 });
assert.deepEqual([r.advance, r.fee, r.reserveReleased, r.totalReceived, r.totalCost], [1800, 60, 140, 1940, 60]);
assert.equal(r.feeAsPercentOfAdvance, 3.33);   // 60 / 1800
assert.equal(r.costPerDayEarly, 2);            // 60 / 30
r = factoringNet({ invoice: 1500, advancePct: 95, feePct: 2.5 });
assert.deepEqual([r.advance, r.fee, r.reserveReleased, r.totalReceived], [1425, 37.5, 37.5, 1462.5]);
assert.equal(r.costPerDayEarly, null);
r = factoringNet({ invoice: 3000, advancePct: 100, feePct: 0 }); assert.deepEqual([r.advance, r.reserveReleased, r.totalCost], [3000, 0, 0]);
assert.equal(factoringNet({ invoice: 1000, advancePct: 98, feePct: 3 }), null);  // advance + fee exceed the invoice
assert.equal(factoringNet({ invoice: 0, advancePct: 90, feePct: 3 }), null);
console.log('factoring tests passed');
