// node scripts/lib/insurance.test.mjs — checks federalLiabilityMinimum() against 49 CFR 387.3 and the 387.9 table
// as read from eCFR (current to 2 Nov 2026; 387.9 amended 21 July 2026 by 91 FR 45660, wording of Row 2 only, amounts unchanged).
import assert from 'node:assert/strict';
import { federalLiabilityMinimum as f } from '../../src/lib/tools/calculations.ts';
const t = (carriage, commerce, big, cargo) => f({ carriage, commerce, gvwr10001OrMore: big, cargo });
// Row 1
assert.deepEqual([t('for-hire', 'interstate', true, 'general').amount, t('for-hire', 'interstate', true, 'general').row], [750000, 1]);
// general cargo outside Row 1
assert.equal(t('private', 'interstate', true, 'general').amount, null);   // private carrier, non-hazardous: not in table
assert.equal(t('for-hire', 'intrastate', true, 'general').amount, null);  // intrastate for-hire non-hazardous: 387.3(a) is interstate/foreign
assert.equal(t('for-hire', 'interstate', false, 'general').amount, null); // under 10,001 lb GVWR
// Row 2 ($5M): bulk categories, any commerce, GVWR >= 10,001, for-hire or private
for (const c of ['for-hire', 'private']) for (const m of ['interstate', 'intrastate']) {
  assert.equal(t(c, m, true, 'bulk-5m').amount, 5000000); assert.equal(t(c, m, true, 'bulk-5m').row, 2);
  assert.equal(t(c, m, true, 'highest-any').amount, 5000000);
}
assert.equal(t('for-hire', 'interstate', false, 'bulk-5m').amount, null);
// Row 3 ($1M)
assert.deepEqual([t('private', 'interstate', true, 'nonbulk-hazmat').amount, t('private', 'interstate', true, 'nonbulk-hazmat').row], [1000000, 3]);
assert.equal(t('for-hire', 'intrastate', true, 'nonbulk-hazmat').amount, null); // 387.3(c)(2)
assert.equal(t('for-hire', 'intrastate', true, 'bulk-other').amount, 1000000);  // Row 3: intrastate in bulk only
assert.equal(t('for-hire', 'interstate', false, 'nonbulk-hazmat').amount, null);
// Row 4 ($5M, under 10,001 lb, interstate)
assert.deepEqual([t('for-hire', 'interstate', false, 'highest-any').amount, t('for-hire', 'interstate', false, 'highest-any').row], [5000000, 4]);
assert.equal(t('for-hire', 'intrastate', false, 'highest-any').amount, null);
console.log('insurance tests passed');
