// node scripts/lib/cdl-group.test.mjs — hand cases for 49 CFR 383.91 groups.
import assert from 'node:assert/strict';
import { cdlGroupFor } from '../../src/lib/tools/calculations.ts';
const g = (powerGvwr, towedGvwr = 0, passengerSeats = 2, placardedHazmat = false, actualWeight) => cdlGroupFor({ powerGvwr, towedGvwr, passengerSeats, placardedHazmat, actualWeight }).group;
assert.equal(g(16000), null);                 // box truck
assert.equal(g(26001), 'B');                   // heavy straight vehicle
assert.equal(g(26000), null);
assert.equal(g(26001, 10000), 'B');            // heavy truck towing a small trailer stays B
assert.equal(g(26000, 10001), 'A');
assert.equal(g(20000, 10001), 'A');            // 30,001 combined, towed over 10,000
assert.equal(g(20000, 6000), null);            // 26,000 combined, towed under 10,000
assert.equal(g(15000, 11000), null);           // 26,000 combined: below 26,001
assert.equal(g(15000, 11001), 'A');            // 26,001 combined, towed over 10,000
assert.equal(g(12000, 0, 16), 'C');            // 16 seats incl. driver
assert.equal(g(12000, 0, 15), null);           // 15 seats
assert.equal(g(9500, 0, 2, true), 'C');        // any size with placarded hazmat
assert.equal(g(30000, 0, 16, true), 'B');      // weight puts it in B first
assert.equal(g(24000, 0, 2, false, 26500), 'B'); // actual weight above rating counts
assert.equal(cdlGroupFor({ powerGvwr: 0, towedGvwr: 0, passengerSeats: 2, placardedHazmat: false }), null);
console.log('cdl-group tests passed');
