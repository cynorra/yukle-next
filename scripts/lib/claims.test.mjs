// node scripts/lib/claims.test.mjs — hand-counted dates for 49 CFR 370.5 (30 days), 370.9 (120 days, then every 60) and 49 U.S.C. 14706(e).
import assert from 'node:assert/strict';
import { claimDates, addDaysIso, addMonthsIso } from '../../src/lib/tools/calculations.ts';
// 15 March 2026: +30 = 14 April (March has 31 days: 16 left in March, +14 in April), +120 = 13 July, +180 = 11 September
const c = claimDates({ claimReceived: '2026-03-15', clockStart: '2026-01-31', disallowed: '2026-08-30' });
assert.equal(c.acknowledgmentDue, '2026-04-14');
assert.equal(c.dispositionDue, '2026-07-13');
assert.deepEqual(c.statusUpdates, ['2026-07-13', '2026-09-11', '2026-11-10']);
assert.equal(c.minFilingDeadline, '2026-10-31');   // 31 Jan + 9 months
assert.equal(c.minSuitDeadline, '2028-08-30');     // 2 years from 30 Aug 2026
// month-end clamping
assert.equal(addMonthsIso('2026-05-31', 9), '2027-02-28');
assert.equal(addMonthsIso('2024-02-29', 24), '2026-02-28');
assert.equal(addMonthsIso('2026-11-30', 3), '2027-02-28');
// year rollover and leap year in the day count
assert.equal(addDaysIso('2026-12-15', 30), '2027-01-14');
assert.equal(addDaysIso('2027-12-31', 60), '2028-02-29');
// invalid input
assert.equal(claimDates({ claimReceived: '2026-02-30' }), null);
assert.equal(claimDates({ claimReceived: 'abc' }), null);
console.log('claims tests passed');
