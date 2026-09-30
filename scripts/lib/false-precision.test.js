// Run: node scripts/lib/false-precision.test.js
const assert = require('assert');
const { hedgeSentence, hedgeArticle } = require('./false-precision');
const Q = require('./article-quality');

assert.equal(hedgeSentence('Fees rose 14.7% last year.'), 'Fees rose roughly 15% last year.');
assert.equal(hedgeSentence('About 14.7% of loads are late.'), 'About 15% of loads are late.', 'already hedged');
assert.equal(hedgeSentence('The average claim costs $2,113 per incident.'), 'The average claim costs roughly $2,100 per incident.');
assert.equal(hedgeSentence('A lumper fee of $127 is common.'), 'A lumper fee of roughly $150 is common.');
assert.equal(hedgeSentence('Budget $1,500 for permits.'), 'Budget $1,500 for permits.', 'round amounts untouched');
assert.equal(hedgeSentence('Losses reach $2.5 million a year.'), 'Losses reach $2.5 million a year.', 'millions untouched');
assert.equal(hedgeSentence('Transit takes 2.3 days on average.'), 'Transit takes about 2 days on average.');
assert.equal(hedgeSentence('Liability is limited to 8.33 SDR per kg.'), 'Liability is limited to 8.33 SDR per kg.', 'real legal figure');
assert.equal(hedgeSentence('Trucks average 6.5 mpg.'), 'Trucks average 6.5 mpg.', 'mpg is technical');
assert.equal(hedgeSentence('Rates of 0.05% - 0.2% apply.'), 'Rates of 0.05% - 0.2% apply.', 'tiny percentages untouched');
assert.equal(hedgeSentence('A 2.5% fee applies.'), 'A 2.5% fee applies.', 'x.5 is natural');
assert.equal(hedgeSentence('Uptime of 99.8% is typical.'), 'Uptime of 99.8% is typical.', 'very high untouched');
assert.equal(hedgeSentence('Prices run EUR 80 to 120.'), 'Prices run EUR 80 to 120.');
assert.equal(hedgeSentence('The EUA price (€80-€120/tonne) matters.'), 'The EUA price (€80-€120/tonne) matters.', 'ranges untouched');
assert.equal(hedgeSentence('Charging takes 2.5-3.5 hours.'), 'Charging takes 2.5-3.5 hours.', 'ranges untouched');
assert.equal(hedgeSentence('“My broker quoted $180 for this load.”'), '“My broker quoted $180 for this load.”', 'quoted scripts untouched');
assert.equal(hedgeSentence('Claims rose 4.7% last year.'), 'Claims rose roughly 4.5% last year.');

assert.equal(hedgeSentence('Shippers lose an average of $1,840 per truck annually.'), 'Shippers lose thousands of dollars per truck annually.', 'signature figure');
assert.equal(hedgeSentence('Costs fell by 14.3% in a year.'), 'Costs fell significantly in a year.');
assert.equal(hedgeSentence('Expect a 14.3% reduction in errors.'), 'Expect a reduction in errors.');
assert.equal(hedgeSentence('Some 14.3% of claims are denied.'), 'Some a notable share of claims are denied.'.replace('Some a', 'Some a'));
assert.equal(require('./false-precision').hedgeArticle('<p>They lose an estimated <strong>$2,113</strong> per truck.</p>'), '<p>They lose an estimated <strong>$2,100</strong> per truck.</p>', 'hedge word before a tag');
const html = '<p>Delays cost $2,113 per load.</p><blockquote>"Claims rose 14.7% in 2023," said the agency.</blockquote><ul><li>Dwell was 2.3 days.</li></ul>';
const out = hedgeArticle(html);
assert.ok(out.includes('roughly $2,100'));
assert.ok(out.includes('14.7%'), 'blockquote citation untouched');
assert.ok(out.includes('about 2 days'));

// the article-quality "false precision" counter must go to zero for the edited text
const sample = '<p>Rose 14.7% and 3.2% and cost $1,847 and $2,113 and took 2.3 days.</p>';
const before = Q.countFalsePrecision(sample).total;
const after = Q.countFalsePrecision(hedgeArticle(sample)).total;
assert.ok(before >= 5 && after === 0, `precision ${before} -> ${after}`);
console.log('false-precision: all assertions passed');
