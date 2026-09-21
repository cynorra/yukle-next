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
  // 2026-09-21: found in old posts that the patterns above had passed
  ['data from Loadly shipments', 'Based on data from thousands of Loadly shipments, shippers cut LTL costs by 14%.'],
  ['Loadly report', 'According to a 2024 Loadly Logistics Report, 78% of shippers overpay.'],
  ['proprietary rate index', "Use Loadly's proprietary rate index, built from live lanes, to benchmark."],
  ['system identified', "Loadly’s system identified an average of $210 in overcharges."],
  ['integrated route optimization', "Tools like Loadly's integrated route optimization can save $350 per route."],
  ['Loadly assists', 'Loadly assists with freight class optimization by suggesting NMFC codes.'],
  ['Loadly was built', "That's why Loadly was built."],
  ['platforms like Loadly', 'Automate this with platforms like Loadly to compare rates.'],
  ['e.g., Loadly', 'A digital freight marketplace (e.g., Loadly) can flag discrepancies.'],
  ['CTA: sign up', 'Sign up for Loadly today and connect with quality freight.'],
  ['CTA: explore', 'Explore Loadly today and find compliant loads that pay.'],
  ['invented experience', 'When I was running my own freight brokerage, the biggest headaches were customs.'],
];
for (const [name, text] of flagged) assert.ok(Q.findFirstPartyClaim(text), `should flag: ${name}`);

const clean = [
  'Our expert guide walks through the process step by step.', // "our expert guide" is self-reference, not a data claim
  'FMCSA data shows that drivers spend hours waiting at ports.',
  'Carriers and shippers should compare quotes. Veteran dispatchers know the pattern.',
  'We recommend documenting every delay in writing.',
  'Read more in the Loadly blog archive.',
  'Explore the FMCSA website for current hours-of-service rules.', // "explore" without Loadly
  'Register your truck with the state before hauling oversize loads.', // "register" without Loadly
  'Shippers can start by comparing quotes from three carriers.',
];
for (const text of clean) assert.strictEqual(Q.findFirstPartyClaim(text), null, `should NOT flag: ${text}`);
// Fields are checked separately: a brand suffix at the end of one must not merge with the start of the next
assert.strictEqual(Q.findFirstPartyClaim('Power Only Freight: Unlock Capacity | Loadly', 'Power only freight is reshaping capacity.'), null, 'must not match across fields');
assert.ok(Q.findFirstPartyClaim('A neutral title', 'Loadly helps you connect with carriers.'), 'still flags a claim in a later field');

// Brand mention: any "Loadly" in article text is rejected, the " | Loadly" site suffix is not
assert.ok(Q.findBrandMention('<p>Loadly’s "Capacity Heatmap" feature shows tightening lanes.</p>'));
assert.ok(Q.findBrandMention('<h2>Optimize Your Pipeline Logistics with Loadly</h2>'));
assert.ok(Q.findBrandMention('Visit Loadly.com/offshore-logistics to get started.'));
assert.strictEqual(Q.findBrandMention('Direct Shipper Contracts: Winning Beyond Load Boards | Loadly'), null, 'site suffix is allowed');
assert.strictEqual(Q.findBrandMention('<p>Carriers should compare quotes from three brokers.</p>'), null);
assert.ok(Q.validateArticle({ title: 'Detention Charges', excerpt: 'A guide.', meta_title: 'Detention Charges', meta_description: 'Learn how.', content: '<p>Read on Loadly.</p>' }).some((i) => i.startsWith('BRAND MENTION')));

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
