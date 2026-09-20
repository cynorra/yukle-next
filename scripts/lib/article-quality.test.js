// Run: node scripts/lib/article-quality.test.js   (no test framework in this repo — plain asserts)
const assert = require('assert');
const Q = require('./article-quality');

const flagged = [
  ['first-party: our data', 'Our internal Loadly data shows that carriers cut empty miles.'],
  ['first-party: our analysis', 'In our analysis of thousands of Loadly shipments, we found delays.'],
  ['first-party: our clients', 'It cost one of our clients $8,900 on a single delivery.'],
  ['first-party: marketplace', 'On the Loadly marketplace, shippers can connect with carriers.'],
  ['first-party: Loadly platform', "Loadly's platform allows shippers to upload documents."],
  ['first-party: we consulted', 'One fleet we consulted extended its tire lifespan.'],
  ['first-party: client of ours', 'A client of ours saved money last year.'],
  ['product pitch: Loadly helps', 'Loadly helps you instantly connect with a vast network of shippers across Europe.'],
  ['product pitch: at Loadly', 'In our experience at Loadly, carriers who prioritize compliance win more freight.'],
  ['product pitch: we built', 'We built Loadly for owner-operators just like you.'],
  ['product pitch: join', 'Join the Loadly network now and find trusted partners.'],
  ['product pitch: for Loadly users', 'Advanced AI Load Board Hacks for Loadly Users'],
];
for (const [name, text] of flagged) assert.ok(Q.findFirstPartyClaim(text), `should flag: ${name}`);

const clean = [
  'Our expert guide walks through the process step by step.', // "our expert guide" is self-reference, not a data claim
  'FMCSA data shows that drivers spend hours waiting at ports.',
  'Carriers and shippers should compare quotes. Veteran dispatchers know the pattern.',
  'We recommend documenting every delay in writing.',
  'Read more in the Loadly blog archive.',
];
for (const text of clean) assert.strictEqual(Q.findFirstPartyClaim(text), null, `should NOT flag: ${text}`);

// Invented case study vs. labelled hypothetical
assert.ok(Q.findFabricatedAnecdote('<p>Last quarter, a mid-sized electronics distributor in Ohio paid extra on LTL shipments.</p>'));
assert.ok(Q.findFabricatedAnecdote('<p>A mid-sized Texas-based carrier lost $12,500 in detention fees.</p>'));
assert.strictEqual(Q.findFabricatedAnecdote('<p>Imagine a mid-sized carrier that lost $12,500 in detention fees over a quarter.</p>'), null);
assert.strictEqual(Q.findFabricatedAnecdote('<p>For example, a small fleet might pay detention after two hours.</p>'), null);

// False precision: decimals and odd dollar amounts count; round ranges do not
assert.strictEqual(Q.countFalsePrecision('<p>Costs range from $1,500 to $2,500 and about 12-16% of loads.</p>').total, 0);
assert.ok(Q.countFalsePrecision('<p>It rose 14.3% to $1,847 over 2.3 days.</p>').total >= 3);
assert.strictEqual(Q.countFalsePrecision('<blockquote>Freight fell 14.3% — FMCSA</blockquote>').total, 0, 'figures inside blockquotes are checked elsewhere');

// Numbers in title/meta/excerpt, and years in titles
assert.ok(Q.findInventedNumberInMeta('Cut costs by 18% today.', '', '', ''));
assert.ok(Q.findInventedNumberInMeta('', 'Save $500 per truck.', '', ''));
assert.strictEqual(Q.findInventedNumberInMeta('A guide to disputing detention charges.', 'Learn how to dispute fees.', 'Dispute Detention Fees', 'How to Dispute Detention Charges'), null);
assert.strictEqual(Q.titleHasYear('The 2025 LTL Playbook'), '2025');
assert.strictEqual(Q.titleHasYear('The LTL Playbook'), null);

// validateArticle end to end
const good = { title: 'How to Dispute Detention Charges', excerpt: 'A guide to contesting fees.', meta_title: 'Dispute Detention Charges', meta_description: 'Learn how to contest fees.', content: '<p>Imagine a 10-truck fleet paying detention.</p>' };
assert.deepStrictEqual(Q.validateArticle(good), []);
assert.ok(Q.validateArticle({ ...good, title: 'The 2025 Detention Playbook' }).some((i) => i.startsWith('YEAR IN TITLE')));
assert.ok(Q.validateArticle({ ...good, content: '<p>Our data shows this.</p>' }).some((i) => i.startsWith('FIRST-PARTY')));

// Resources: every cluster resolves to real entries, unknown cluster falls back, block has only https links
for (const [needle] of Q.CLUSTER_RESOURCES) {
  const r = Q.resourcesForCluster(needle);
  assert.ok(r.length >= 3, `cluster "${needle}" should map to 3 resources`);
  for (const [label, url] of r) { assert.ok(label && /^https:\/\//.test(url), `bad resource for ${needle}`); }
}
assert.ok(Q.resourcesForCluster('Something unknown').length >= 3);
assert.ok(Q.officialResourcesHtml('Hazmat & Dangerous Goods Compliance').includes('phmsa.dot.gov'));

console.log('article-quality: all assertions passed');
