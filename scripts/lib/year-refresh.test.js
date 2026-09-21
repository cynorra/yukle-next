// Run: node scripts/lib/year-refresh.test.js
const assert = require('assert');
const { refreshHtml, findYearFragments, checkEdit } = require('./year-refresh');

const eq = (input, expected) => assert.strictEqual(refreshHtml(input), expected, `input: ${input}`);

// headings / framing phrases (no other figures) -> year dropped, grammar kept
eq('<h2>Optimizing Your 2025 EU Cabotage Strategy</h2>', '<h2>Optimizing Your EU Cabotage Strategy</h2>');
eq('<h2>Key Takeaways for 2025 EU Cabotage Compliance</h2>', '<h2>Key Takeaways for EU Cabotage Compliance</h2>');
eq('<h2>Negotiating 2025 LTL Freight Costs: Strategies for a Volatile Market</h2>', '<h2>Negotiating LTL Freight Costs: Strategies for a Volatile Market</h2>');
eq('<h2>What are common LTL accessorial charges in 2025?</h2>', '<h2>What are common LTL accessorial charges?</h2>');
eq('<h2>Why Traditional LTL Carrier Selection Fails in 2025: The Hidden Costs</h2>', '<h2>Why Traditional LTL Carrier Selection Fails: The Hidden Costs</h2>');
eq("<p>Don't sign a single LTL carrier contract in 2025 without these five clauses.</p>", "<p>Don't sign a single LTL carrier contract without these five clauses.</p>");
eq('<p>Successful negotiation in 2025 isn\'t about strong-arming carriers.</p>', '<p>Successful negotiation isn\'t about strong-arming carriers.</p>');
eq('<p>In 2025, carriers should audit every accessorial charge.</p>', '<p>Carriers should audit every accessorial charge.</p>'.replace('Carriers', 'Carriers'));
eq('<p>The LTL market is volatile. In 2025, carriers should audit every charge.</p>', '<p>The LTL market is volatile. Carriers should audit every charge.</p>');
eq('<p>Rates will keep rising in 2025 and beyond.</p>', '<p>Rates will keep rising.</p>');
eq('<h2>Freight Guide (2025)</h2>', '<h2>Freight Guide</h2>');
eq('<p>This is the 2025 freight market for shippers.</p>', '<p>This is the freight market for shippers.</p>');
eq('<h2>2025 Freight Rate Outlook: What Shippers Need</h2>', '<h2>Freight Rate Outlook: What Shippers Need</h2>');

// figures / real dates / references -> left alone (or only the safe adjective form is dropped)
eq('<p>Rates fell 8% in 2025 compared with the year before.</p>', '<p>Rates fell 8% in 2025 compared with the year before.</p>');
eq('<p>In 2025, diesel averaged $3.80 per gallon.</p>', '<p>In 2025, diesel averaged $3.80 per gallon.</p>');
eq('<p>Between 2024 and 2025 volumes doubled.</p>', '<p>Between 2024 and 2025 volumes doubled.</p>');
eq('<p>Results for Q4 2025 were strong.</p>', '<p>Results for Q4 2025 were strong.</p>');
eq('<p>Since 2025 the rule has applied.</p>', '<p>Since 2025 the rule has applied.</p>');
eq('<p>By 2025 most carriers had adopted it.</p>', '<p>By 2025 most carriers had adopted it.</p>');
eq('<p>The 2025 tariffs changed sourcing.</p>', '<p>The 2025 tariffs changed sourcing.</p>');
eq('<p>The 2025 ATA report shows a decline.</p>', '<p>The 2025 ATA report shows a decline.</p>');
eq('<p>The 2025 iteration of the package is stricter.</p>', '<p>The 2025 iteration of the package is stricter.</p>');
eq('<p>In 2025 and 2026 the limit changes.</p>', '<p>In 2025 and 2026 the limit changes.</p>');
eq('<p>Carriers in 2025-2026 face limits.</p>', '<p>Carriers in 2025-2026 face limits.</p>');
eq('<p>March 2025 saw new rules.</p>', '<p>March 2025 saw new rules.</p>');

// a figure in the fragment: the framing adjective may still go, "in 2025" stays
eq('<p>Under the 2025 EU rules a fine reaches €10,000.</p>', '<p>Under the EU rules a fine reaches €10,000.</p>');
eq('<p>Fines in 2025 reach €10,000.</p>', '<p>Fines in 2025 reach €10,000.</p>');

// grammar guards found by reading a review sample of the first plan run
eq('<p>The reality of 2025 is that many carriers underestimate costs.</p>', '<p>The reality is that many carriers underestimate costs.</p>');
eq('<p>The crucial differentiator for 2025 is understanding when to choose 20-foot units.</p>', '<p>The crucial differentiator for 2025 is understanding when to choose 20-foot units.</p>'); // figures in fragment: left alone, never "for is"
eq('<p>The upfront investment in compliance tools and programs for 2025 yields significant ROI.</p>', '<p>The upfront investment in compliance tools and programs yields significant ROI.</p>');
eq('<p>To survive a 2025 IFTA audit, keep records.</p>', '<p>To survive a 2025 IFTA audit, keep records.</p>'); // "a IFTA" would be wrong
eq('<p>It is a 2025 reality with real incentives.</p>', '<p>It is a reality with real incentives.</p>');
eq('<p>The best of 2025.</p>', '<p>The best of 2025.</p>'); // "the best." would lose meaning
eq('<p>Plan for 2025 planning cycles.</p>', '<p>Plan for 2025 planning cycles.</p>'); // noun after a preposition: keep the year rather than risk "for planning cycles"
eq("<p>One of 2025's biggest risks.</p>", "<p>One of 2025's biggest risks.</p>");
eq('<h2>Mastering Harmonized System Codes: Your Edge for 2025 Compliance</h2>', '<h2>Mastering Harmonized System Codes: Your Edge for Compliance</h2>');
assert.strictEqual(checkEdit('The reality of 2025 is that', 'The reality of is that'), 'preposition before verb');

// attributes and links are never touched
eq('<p>Read the <a href="/en/blog/ltl-guide-2025-en">2025 LTL guide</a> first.</p>', '<p>Read the <a href="/en/blog/ltl-guide-2025-en">LTL guide</a> first.</p>');

// finder + validator
const content = '<h2>Plan for 2025</h2><p>No year here.</p><ul><li>Budget in 2025 carefully</li></ul><blockquote><p>Quoted 2025 report</p></blockquote>';
const frags = findYearFragments(content);
assert.deepStrictEqual(frags.map((f) => f.tag), ['h2', 'li'], 'finder should skip blockquotes and yearless blocks');
assert.strictEqual(checkEdit('Plan for 2025', 'Plan for'), 'dangling end');
assert.strictEqual(checkEdit('Is it worth it for 2025?', 'Is it worth it for?'), 'dangling preposition');
assert.strictEqual(checkEdit('Plan for 2025', 'Plan'), 'removed too much');
assert.strictEqual(checkEdit('<b>x</b> in 2025 y', '<i>x</i> y'), 'tags changed');
assert.strictEqual(checkEdit('Budget in 2025 carefully now', 'Budget carefully now'), null);
assert.strictEqual(checkEdit('same', 'same'), 'unchanged');

console.log('year-refresh: all assertions passed');
