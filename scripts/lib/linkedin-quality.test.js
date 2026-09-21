// Run: node scripts/lib/linkedin-quality.test.js
const assert = require('assert');
const { validatePost, cleanHashtags, numbersNeedingSupport } = require('./linkedin-quality');

const SOURCE = 'Dimensional weight = (length x width x height) / divisor. A 24 x 18 x 12 in box is 5,184 in3; divided by 139 that is 37.29 lb. At $4.00 per gallon and 76.92 gallons the fuel cost is $307.69 ($0.62 per mile). Detention: 150 minutes billable at $50 per hour is $125.';

const GOOD = [
  'Carriers do not always bill you for the weight on the scale.',
  '',
  'For light but bulky parcels, the charge can come from size instead: length times width times height, divided by a carrier-specific divisor. The higher of that number and the actual weight is what gets billed.',
  '',
  'A box of 24 x 18 x 12 in is 5,184 in3. Divided by 139, it counts as 37.29 lb, even if the packed box is much lighter.',
  '',
  'Three habits that keep this under control:',
  '- Measure the packed box, including bulges',
  '- Ask the carrier which divisor applies to your service',
  '- Use the smallest box that still protects the goods',
  '',
  'The step-by-step guide and a free calculator are in the first comment.',
].join('\n');

function issuesOf(post) { return validatePost(post, SOURCE); }
const has = (issues, tag) => issues.some((i) => i.startsWith(tag));

// a well-formed, grounded post passes
assert.deepStrictEqual(issuesOf(GOOD), [], 'GOOD post should pass: ' + JSON.stringify(issuesOf(GOOD)));

// first person is rejected in every common form
for (const bad of ["In my years as a dispatcher this matters.", 'We analysed thousands of loads.', "I've seen this cost carriers dearly.", 'Our clients keep asking about this.', "We're launching a tool."]) {
  assert.ok(has(issuesOf(GOOD + '\n' + bad), 'FIRST PERSON'), 'first person not caught: ' + bad);
}
// "US" (United States) and "us" inside words must not trigger it
assert.ok(!has(issuesOf(GOOD + '\nUS parcel carriers publish their own divisors, and focus matters.'), 'FIRST PERSON'), '"US"/"focus" false positive');

// brand, links, claims, anecdotes
assert.ok(has(issuesOf(GOOD + '\nLoadly makes this easy.'), 'BRAND'));
assert.ok(has(issuesOf(GOOD + '\nRead more at loadlyapp.com/en/tools'), 'LINK'));
assert.ok(has(issuesOf(GOOD + '\nhttps://example.com/x'), 'LINK'));
assert.ok(has(issuesOf(GOOD + '\nOur internal data shows carriers overpay.'), 'FIRST-PARTY'));
assert.ok(has(issuesOf(GOOD + '\nA mid-sized carrier lost heavily after ignoring this rule last quarter.'), 'INVENTED ANECDOTE'));

// numbers must come from the source
assert.ok(has(issuesOf(GOOD + '\nThis mistake raises costs by 23%.'), 'UNSUPPORTED NUMBERS'), 'invented percentage not caught');
assert.ok(has(issuesOf(GOOD + '\nTypical fee: $1,850 per day.'), 'UNSUPPORTED NUMBERS'), 'invented dollar amount not caught');
assert.ok(!has(issuesOf(GOOD + '\nThe fuel example works out to $307.69.'), 'UNSUPPORTED NUMBERS'), 'a sourced number was rejected');
assert.ok(!has(issuesOf(GOOD + '\nThere are 3 habits to build.'), 'UNSUPPORTED NUMBERS'), 'small list counts should be allowed');
// strict mode (article posts): even a sourced figure is rejected
assert.ok(validatePost(GOOD, SOURCE, { strictNumbers: true }).some((i) => i.startsWith('NO FIGURES ALLOWED')), 'strict mode should reject figures');
assert.deepStrictEqual(validatePost(GOOD.replace('A box of 24 x 18 x 12 in is 5,184 in3. Divided by 139, it counts as 37.29 lb, even if the packed box is much lighter.', 'A bulky box can count as far heavier than it is on the scale.'), SOURCE, { strictNumbers: true }), [], 'a figure-free post should pass strict mode');
const FIGURE_FREE = GOOD.replace('A box of 24 x 18 x 12 in is 5,184 in3. Divided by 139, it counts as 37.29 lb, even if the packed box is much lighter.', 'A bulky box can count as far heavier than it is on the scale.');
const strictIssues = (extra) => validatePost(FIGURE_FREE + '\n' + extra, SOURCE, { strictNumbers: true });
assert.ok(strictIssues('Pull ninety days of invoices first.').some((i) => i.startsWith('NO FIGURES ALLOWED')), 'spelled-out number not caught');
assert.ok(strictIssues('Use LTL above one hundred fifty pounds.').some((i) => i.startsWith('NO FIGURES ALLOWED')), 'spelled-out number not caught');
for (const claim of ['Permit complexity is the single biggest money pit in this business.', 'Minor errors routinely flag trucks.', 'Documentation errors are the leading cause of border delays.', 'Top-earning owner-operators plan ahead.', 'Studies show carriers save money.', 'Most carriers overpay.', 'According to industry experts, this helps.']) {
  assert.ok(strictIssues(claim).some((i) => i.startsWith('UNSOURCED CLAIM')), 'unsourced claim not caught: ' + claim);
}
assert.deepStrictEqual(strictIssues('Measure the packed box and ask which divisor applies.'), [], 'plain advice should pass strict mode');
assert.ok(!validatePost(GOOD + '\nThere are dozens of options.', SOURCE).some((i) => i.startsWith('UNSOURCED')), 'authority gate must not run for tool posts');
assert.deepStrictEqual(numbersNeedingSupport('3 tips, 5,184 in3, 37.29 lb, $307.69, 12%').sort(), ['12', '307.69', '37.29', '5184'].sort());

// length, hook, bait, cliche, emoji
assert.ok(has(issuesOf('Too short.'), 'TOO SHORT'));
assert.ok(has(issuesOf(GOOD + '\n' + 'x'.repeat(1300)), 'TOO LONG'));
assert.ok(has(issuesOf('A'.repeat(200) + '\n\n' + GOOD.split('\n').slice(2).join('\n')), 'HOOK TOO LONG'));
assert.ok(has(issuesOf(GOOD + '\nComment below if this helps. Agree?'), 'ENGAGEMENT BAIT'));
assert.ok(has(issuesOf(GOOD + '\nThis is a game-changer that will unlock savings.'), 'CLICHE'));
assert.ok(has(issuesOf(GOOD + '\n📦 🚚'), 'EMOJI'));
assert.ok(!has(issuesOf(GOOD + '\n📦'), 'EMOJI'), 'one emoji is allowed');
assert.deepStrictEqual(validatePost('', SOURCE), ['EMPTY POST']);

// hashtags
assert.deepStrictEqual(cleanHashtags(['#Freight', 'freight', 'Supply Chain!', '#LTL', 'x', '#Logistics']), ['#Freight', '#SupplyChain', '#LTL']);
assert.deepStrictEqual(cleanHashtags(null), []);

console.log('linkedin-quality: all assertions passed');
