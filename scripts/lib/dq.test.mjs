// node scripts/lib/dq.test.mjs — hand-counted dates for the driver qualification file rules.
import assert from 'node:assert/strict';
import { dqDates } from '../../src/lib/tools/calculations.ts';
let r = dqDates({ hired: '2025-03-01', separated: '2027-01-15', annualRecordDate: '2026-03-01' });
assert.equal(r.hireItemsDue, '2025-03-31');          // 1 March + 30 days
assert.equal(r.nextAnnualDue, '2026-03-01');         // 12 months after the hire-date inquiry
assert.equal(r.keepFileUntil, '2030-01-15');         // separation + 3 years
assert.equal(r.annualRecordRemovableFrom, '2029-03-01');
r = dqDates({ hired: '2025-01-31', lastAnnual: '2026-02-28' });
assert.equal(r.hireItemsDue, '2025-03-02');          // 31 Jan + 30 days (February has 28 days in 2025)
assert.equal(r.nextAnnualDue, '2027-02-28');
assert.equal(r.keepFileUntil, null);
r = dqDates({ hired: '2024-02-29', separated: '2025-02-28' });
assert.equal(r.keepFileUntil, '2028-02-28');
assert.equal(dqDates({ hired: '2025-13-01' }), null);
console.log('dq tests passed');
