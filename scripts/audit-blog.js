// Full content audit of every published English post, using the same gates the generator enforces.
//
//   node scripts/audit-blog.js            # summary + first offenders per category
//   node scripts/audit-blog.js --all      # list every offender
//   node scripts/audit-blog.js --json     # machine-readable
//
// Exit code 1 when any BLOCKING category has an offender, so it can gate a deploy or run in CI.
// Written after the 2026-09-30 AdSense "low value content" rejection, which found: fabricated first-person
// credentials in 549/806 posts, unsourced numbers/hype in nearly every title and meta description, stale
// years, and health / tax / explosives posts a single-person freight blog has no credentials to write.

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const Q = require('./lib/article-quality');

const ROOT = path.join(__dirname, '..');
const envLocal = path.join(ROOT, '.env.local');
if (fs.existsSync(envLocal)) {
  for (const line of fs.readFileSync(envLocal, 'utf8').split('\n')) {
    const i = line.indexOf('=');
    if (i > 0 && !process.env[line.slice(0, i).trim()]) process.env[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
  }
}
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const ALL = process.argv.includes('--all');
const JSON_OUT = process.argv.includes('--json');
const words = (html) => Q.stripTags(html).split(/\s+/).filter(Boolean).length;

async function loadPosts() {
  const rows = [];
  for (let from = 0; ; from += 100) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id,slug,title,meta_title,excerpt,meta_description,content,topic_cluster')
      .eq('published', true).eq('language', 'en').order('id').range(from, from + 99);
    if (error) throw error;
    rows.push(...data);
    if (data.length < 100) break;
  }
  return rows;
}

// [key, blocking?, description, test(post) -> offender text | null]
const CHECKS = [
  ['first_person', true, 'invented first-person experience', (p) => Q.findFirstPersonExperience(p.title, p.excerpt, p.meta_description, p.content)],
  ['indirect_experience', true, 'indirect experience claim / "we predict"', (p) => Q.findIndirectExperience(p.title, p.excerpt, p.meta_description, p.content)],
  ['first_party', true, 'first-party data/client/platform claim', (p) => Q.findFirstPartyClaim(p.title, p.excerpt, p.meta_description, p.content)],
  ['brand_mention', true, '"Loadly" named in title/meta/body', (p) => Q.findBrandMention(p.title, p.excerpt, p.meta_title, p.meta_description, p.content)],
  ['hype', true, 'guarantee / hype language', (p) => Q.findHypeClaim(p)],
  ['number_in_meta', true, 'percent/$/"Nx" in title, meta or excerpt', (p) => Q.findInventedNumberInMeta(p.excerpt, p.meta_description, p.meta_title, p.title)],
  ['year_in_title', true, 'year in title/meta_title', (p) => Q.titleHasYear(p.title, p.meta_title)],
  ['ymyl', true, 'YMYL / sensitive topic (health, personal tax, explosives...)', (p) => { const t = Q.findYmylTopic(p.title, p.meta_title, p.excerpt, p.meta_description, p.slug.replace(/-/g, ' ')); if (t) return t; const n = Q.countYmylBody(p.content); return n > Q.MAX_YMYL_BODY ? `${n} advice-topic mentions in body` : null; }],
  ['site_suffix', true, '"| Loadly" suffix stored in title/meta_title', (p) => (/[|]\s*Loadly/i.test(`${p.title} ${p.meta_title || ''}`) ? 'suffix' : null)],
  ['meta_length', true, 'meta_description outside 90-185 chars or empty title/excerpt', (p) => {
    const d = (p.meta_description || '').length;
    if (d < 90 || d > 185) return `meta_description ${d}`;
    if (!p.title || !p.excerpt) return 'missing title/excerpt';
    return null;
  }],
  ['thin', true, 'body under 700 words', (p) => { const w = words(p.content); return w < 700 ? `${w} words` : null; }],
  ['false_precision', false, 'more than 3 decimal-precision figures', (p) => { const f = Q.countFalsePrecision(p.content); return f.total > Q.MAX_FALSE_PRECISION ? `${f.total} figures` : null; }],
  ['fabricated_anecdote', false, 'unlabelled invented case study', (p) => Q.findFabricatedAnecdote(p.content)],
  ['year_framing', false, 'body habitually framed around a year', (p) => { const n = Q.countYearFraming(p.content); return n > Q.MAX_YEAR_FRAMING ? `${n} phrases` : null; }],
];

(async () => {
  const posts = await loadPosts();
  const slugs = new Set(posts.map((p) => p.slug));
  const report = { posts: posts.length, checks: {}, extra: {} };
  for (const [key, blocking, desc] of CHECKS) report.checks[key] = { blocking, desc, offenders: [] };
  const titleSeen = new Map();
  let deadLinks = 0; const deadList = [];
  let mentions2025 = 0;
  for (const p of posts) {
    for (const [key, , , test] of CHECKS) {
      const hit = test(p);
      if (hit) report.checks[key].offenders.push({ slug: p.slug, hit: String(hit).slice(0, 140) });
    }
    const t = (p.title || '').toLowerCase().trim();
    if (titleSeen.has(t)) report.checks.duplicate_title = report.checks.duplicate_title || { blocking: true, desc: 'duplicate title', offenders: [] }, report.checks.duplicate_title.offenders.push({ slug: p.slug, hit: titleSeen.get(t) });
    else titleSeen.set(t, p.slug);
    for (const m of p.content.matchAll(/href="(?:https?:\/\/(?:www\.)?loadlyapp\.com)?\/en\/blog\/([a-z0-9-]+)"/g)) {
      if (!slugs.has(m[1])) { deadLinks++; if (deadList.length < 20) deadList.push(`${p.slug} -> ${m[1]}`); }
    }
    mentions2025 += (Q.stripTags(p.content).match(/\b2025\b/g) || []).length;
  }
  // The same non-round figure in many unrelated posts ("$1,840 per truck" in 94 posts, "14.3%" in 46) is the clearest
  // fingerprint of fabricated statistics. Round amounts and x.5 percentages are naturally common and ignored.
  const figureCount = new Map();
  for (const p of posts) {
    const text = Q.stripTags(p.content);
    const seen = new Set();
    for (const m of text.matchAll(/\b\d{1,2}\.\d{1,2}%/g)) { const v = parseFloat(m[0]); if (v >= 2 && v < 90 && !/\.50?%$/.test(m[0])) seen.add(m[0]); }
    for (const m of text.matchAll(/[$€£]\s?\d{1,3}(?:,\d{3})+(?![\d,])/g)) { const n = parseFloat(m[0].replace(/[^\d.]/g, '')); if (n % 100 !== 0) seen.add(m[0].replace(/\s/g, '')); }
    for (const f of seen) figureCount.set(f, (figureCount.get(f) || 0) + 1);
  }
  const repeated = [...figureCount.entries()].filter(([, n]) => n >= 6).sort((a, b) => b[1] - a[1]);
  if (repeated.length) report.checks.repeated_figures = { blocking: true, desc: 'same non-round figure in 6+ posts (fabricated-statistic fingerprint)', offenders: repeated.map(([f, n]) => ({ slug: f, hit: `${n} posts` })) };
  if (deadLinks) report.checks.dead_internal_links = { blocking: true, desc: 'internal links to unpublished posts', offenders: deadList.map((x) => ({ slug: x, hit: '' })) };
  report.extra = { mentions_of_2025_in_bodies: mentions2025 };

  const blockingFail = Object.values(report.checks).filter((c) => c.blocking && c.offenders.length);
  if (JSON_OUT) { console.log(JSON.stringify(report, null, 2)); process.exit(blockingFail.length ? 1 : 0); }

  console.log(`\nBlog audit — ${posts.length} published English posts\n`);
  for (const [key, c] of Object.entries(report.checks)) {
    const n = c.offenders.length;
    console.log(`${n === 0 ? 'OK  ' : c.blocking ? 'FAIL' : 'warn'}  ${key.padEnd(22)} ${String(n).padStart(4)}  ${c.desc}`);
    if (n) c.offenders.slice(0, ALL ? n : 3).forEach((o) => console.log(`        ${o.slug.slice(0, 60)}  ${o.hit}`));
  }
  console.log(`\ninfo  mentions of "2025" in bodies: ${mentions2025} (real dated references and regulation editions are expected)`);
  console.log(blockingFail.length ? `\nAUDIT FAILED: ${blockingFail.length} blocking categories` : '\nAUDIT PASSED');
  process.exit(blockingFail.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
