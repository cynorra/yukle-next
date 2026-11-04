// node scripts/lib/tiedown.test.mjs — hand-calculated cases for 49 CFR 393.110 (count) and 393.106(d) (aggregate WLL).
import assert from 'node:assert/strict';
import { tiedownRequirement, minTiedownsByCount } from '../../src/lib/tools/calculations.ts';
const t = (weight, length, blocked, wll, counting) => tiedownRequirement({ weight, length, blocked, wll, counting });

// Count rule, unblocked (393.110(b))
assert.equal(minTiedownsByCount(1100, 5, false), 1);
assert.equal(minTiedownsByCount(1101, 5, false), 2);
assert.equal(minTiedownsByCount(5000, 5.1, false), 2);
assert.equal(minTiedownsByCount(5000, 10, false), 2);
assert.equal(minTiedownsByCount(5000, 10.1, false), 3);
assert.equal(minTiedownsByCount(5000, 20, false), 3);
assert.equal(minTiedownsByCount(5000, 20.5, false), 4);
assert.equal(minTiedownsByCount(5000, 30, false), 4);
assert.equal(minTiedownsByCount(5000, 24, false), 4); // 2 + 2 (14 ft beyond the first 10 = 1 full 10 + a fraction)
// Count rule, blocked (393.110(c)): one per 10 ft or fraction
assert.equal(minTiedownsByCount(5000, 8, true), 1);
assert.equal(minTiedownsByCount(5000, 10, true), 1);
assert.equal(minTiedownsByCount(5000, 10.5, true), 2);
assert.equal(minTiedownsByCount(5000, 24, true), 3);

// Example A: 12,000 lb, 8 ft, unblocked, 1,500 lb straps over the load to the other side
let r = t(12000, 8, false, 1500, 'full');
assert.deepEqual([r.minByCount, r.requiredAggregateWll, r.minByStrength, r.required, r.governing], [2, 6000, 4, 4, 'strength']);
// same straps as vehicle-anchor-to-article or same-side loops (half): 6,000 / 750 = 8
r = t(12000, 8, false, 1500, 'half');
assert.deepEqual([r.countedWllEach, r.minByStrength, r.required], [750, 8, 8]);
// Example B: same load blocked against a headerboard: count rule drops to 1, strength rule still 4
r = t(12000, 8, true, 1500, 'full');
assert.deepEqual([r.minByCount, r.minByStrength, r.required, r.governing], [1, 4, 4, 'strength']);
// Example C: 3,000 lb, 4 ft, unblocked, 1,500 lb straps over the load: count governs (2 vs 1)
r = t(3000, 4, false, 1500, 'full');
assert.deepEqual([r.minByCount, r.requiredAggregateWll, r.minByStrength, r.required, r.governing], [2, 1500, 1, 2, 'count']);
// Example D: 45,000 lb, 24 ft, unblocked, 5,000 lb chains over the load: 4 by count, 22,500 / 5,000 = 4.5 -> 5 by strength
r = t(45000, 24, false, 5000, 'full');
assert.deepEqual([r.minByCount, r.requiredAggregateWll, r.minByStrength, r.required, r.governing], [4, 22500, 5, 5, 'strength']);
r = t(45000, 24, false, 5000, 'half');
assert.deepEqual([r.minByStrength, r.required], [9, 9]); // 22,500 / 2,500
// Exact fit: 10,000 lb, 8 ft, 2,500 lb WLL full -> exactly 2 by strength (5,000 / 2,500), equal to count
r = t(10000, 8, false, 2500, 'full');
assert.deepEqual([r.minByCount, r.minByStrength, r.required, r.governing], [2, 2, 2, 'both']);
assert.equal(t(0, 8, false, 1500, 'full'), null);
console.log('tiedown tests passed');
