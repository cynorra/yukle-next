// Run: node scripts/lib/year-refresh-extra.test.js
const assert = require('assert');
const X = require('./year-refresh-extra');

// headings
assert.equal(X.refreshHeadingText('Freight Market Rates 2025'), 'Freight Market Rates');
assert.equal(X.refreshHeadingText('Your 5-Step Retreading Playbook for 2025'), 'Your 5-Step Retreading Playbook');
assert.equal(X.refreshHeadingText('The 2025 Freight Rate Index Playbook'), 'The Freight Rate Index Playbook');
assert.equal(X.refreshHeadingText('Incoterms 2025 Explained'), 'Incoterms 2020 Explained');
assert.equal(X.refreshHeadingText('ADR 2025 Updates'), 'ADR 2025 Updates', 'real regulation edition must stay');
assert.equal(X.refreshHeadingText('Post-Mobility Package 2025 (Specifics)'), 'Post-Mobility Package 2025 (Specifics)');
assert.equal(X.refreshHeadingText('Mastering DOT Preparation for a Profitable 2025'), 'Mastering DOT Preparation for a Profitable 2025', 'no dangling adjective');

// sentences
assert.equal(X.dropPresentTenseYear('In 2025, average lumper fees can range from $100 to $450.'), 'Average lumper fees can range from $100 to $450.');
assert.equal(X.dropPresentTenseYear('For 2025 hot shot operations, certifications matter.'), 'For 2025 hot shot operations, certifications matter.', 'comma required');
assert.equal(X.dropTimePhraseWithFigures('Reduce costs by 25% in 2025 by mastering classification.'), 'Reduce costs by 25% by mastering classification.');
assert.equal(X.dropTimePhraseWithFigures('Costs rose 8% in 2025 for shippers.'), 'Costs rose 8% in 2025 for shippers.', 'past event keeps its year');
assert.equal(X.dropTimePhraseWithFigures('Save 10% in 2025 freight rate negotiation.'), 'Save 10% in 2025 freight rate negotiation.', 'adjective use keeps year here');
assert.equal(X.dropAdjectiveYear('Navigating the complex 2025 livestock regulations.'), 'Navigating the complex livestock regulations.');
assert.equal(X.dropAdjectiveYear('Follow ADR 2025 requirements.'), 'Follow ADR 2025 requirements.');
assert.equal(X.dropAdjectiveYear('Read the 2025 report on tariffs.'), 'Read the 2025 report on tariffs.');

// forecasts
assert.equal(X.dropStaleForecasts('Rates move. We predict a dip in February 2025. Plan ahead.').replace(/\s+/g, ' '), 'Rates move. Plan ahead.');
console.log('year-refresh-extra: all assertions passed');
