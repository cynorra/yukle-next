// Run: node scripts/lib/editorial-quality.test.js
const assert = require('assert');
const E = require('./editorial-quality');

assert.ok(E.findCliche('<p>In today\'s fast-paced logistics world, carriers must adapt.</p>'));
assert.ok(E.findCliche('<p>This guide will help you navigate the complexities of ELDs.</p>'));
assert.ok(E.findCliche('<p>Admin work can consume upwards of 40% of the day.</p>'));
assert.strictEqual(E.findCliche('<p>A driver may not drive after the 14th consecutive hour after coming on duty.</p>'), null);

assert.strictEqual(E.countHypotheticalCrutch('<p><strong>Bottom Line:</strong> Short. Imagine a 10-truck fleet that loses time.</p>').opener, true);
assert.strictEqual(E.countHypotheticalCrutch('<p>The 11-hour driving limit applies after 10 consecutive hours off duty.</p>').opener, false);

const src = 'A driver may drive a maximum of 11 hours. The 30-minute break is required after 8 hours. 14 percent of ...';
assert.deepStrictEqual(E.findUnsourcedPercents('<p>Costs rise 40% a year.</p>', src), ['40%']);
assert.deepStrictEqual(E.findUnsourcedPercents('<p>14% of ...</p>', src), []);

const sources = [{ cite: '49 CFR § 395.3' }, { cite: '49 CFR § 395.8' }, { cite: 'FMCSA' }];
assert.strictEqual(E.countSourceCitations('<p>Under 49 CFR § 395.3 and 49 CFR § 395.8 a driver…</p>', sources), 2);
assert.strictEqual(E.countSourceCitations('<p>Generic text with no citation.</p>', sources), 0);

const thinPost = '<h2>A</h2><p>short</p><h2>B</h2><p>short</p><h2>C</h2><p>short</p>';
assert.ok(E.countThinSections(thinPost) >= 3);

const grounding = { sources, sourceText: src };
assert.ok(E.validateEditorial({ content: '<p>Imagine a fleet. Generic.</p>' }, grounding).length >= 2);
console.log('editorial-quality tests passed');
