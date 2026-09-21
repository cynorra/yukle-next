// Generates LinkedIn post DRAFTS for loadlyapp.com content. It never posts anything: every draft is a
// markdown file in linkedin-drafts/ that a person reads, edits and publishes by hand.
//
//   node scripts/linkedin-drafts.js              # 1 draft: calculators first, then the newest undrafted article
//   node scripts/linkedin-drafts.js --count 3    # 3 drafts
//   node scripts/linkedin-drafts.js --tools      # all calculator drafts that do not exist yet
//   node scripts/linkedin-drafts.js --slug some-article-slug-en
//   node scripts/linkedin-drafts.js --dry        # print, write nothing
//   node scripts/linkedin-drafts.js --include-sensitive   # also draft health/legal/tax/customs/regulation articles
//
// Needs GEMINI_API_KEY and NEXT_PUBLIC_SUPABASE_URL (+ SUPABASE_SERVICE_ROLE_KEY or the anon key),
// read from the environment or .env.local. Quality gates live in scripts/lib/linkedin-quality.js:
// neutral voice (no "I/we"), no invented anecdotes/data, every figure must appear in the source.

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const Quality = require('./lib/article-quality');
const Post = require('./lib/linkedin-quality');

const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'linkedin-drafts');
const INDEX_FILE = path.join(OUT_DIR, 'index.json');
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';
const MAX_ATTEMPTS = 4;

// ── env ─────────────────────────────────────────────────────────────────────────
const envLocal = path.join(ROOT, '.env.local');
if (fs.existsSync(envLocal)) {
  for (const line of fs.readFileSync(envLocal, 'utf8').split('\n')) {
    const i = line.indexOf('=');
    if (i > 0) {
      const key = line.slice(0, i).trim();
      if (!process.env[key]) process.env[key] = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
    }
  }
}
const GEMINI_KEY = process.env.GEMINI_API_KEY;
// Separate models/quota from the blog generator (gemini-2.5-flash, 20 requests/day on the free tier).
const MODELS = (process.env.LINKEDIN_MODELS || 'gemini-3.5-flash-lite,gemini-3.5-flash,gemini-2.5-flash').split(',').map((m) => m.trim()).filter(Boolean);

// ── calculator sources ──────────────────────────────────────────────────────────
// Facts the tool posts may use (same numbers as the worked examples on the pages, which are
// computed by src/lib/tools/calculations.ts). Nothing outside this text may be claimed.
const TOOLS = [
  {
    id: 'dimensional-weight-calculator',
    name: 'Dimensional Weight Calculator',
    audience: 'shippers, e-commerce sellers and carriers who ship parcels, air or sea freight',
    facts: [
      'Free calculator that shows whether a shipment is billed on its size or its weight.',
      'Dimensional weight = (length x width x height) / divisor. Chargeable weight is the higher of actual weight and dimensional weight.',
      'Common divisors: 139 in3 per lb and 166 in3 per lb (US parcel), 5,000 or 6,000 cm3 per kg (air), sea LCL 1 m3 = 1,000 kg. Carriers set their own divisor, so it must be confirmed.',
      'Worked example: a 24 x 18 x 12 in box is 5,184 in3. Divided by 139 that is 37.29 lb. If the packed box weighs 10 lb it is billed at 37.29 lb.',
      'Ways to lower it: smallest protective box, less void fill, measure the packed box including bulges, compare carriers divisors.',
      'Does not apply to full truckload (priced per truck or mile); LTL uses freight classes based on density.',
      'Runs in the browser; nothing entered is sent or stored.',
    ].join('\n'),
  },
  {
    id: 'fuel-cost-calculator',
    name: 'Fuel Cost Calculator',
    audience: 'owner-operators, small fleets, dispatchers and brokers estimating a trip',
    facts: [
      'Free trip fuel cost calculator. Works in miles and gallons or kilometres and litres, with mpg or L per 100 km, and an optional round trip.',
      'Fuel needed = distance / fuel economy. Cost = fuel needed x fuel price. Dividing by the distance gives cost per mile or km.',
      'Worked example: 500 miles at 6.5 mpg needs 76.92 gallons. At $4.00 per gallon that is about $307.69, or $0.62 per mile.',
      'Fuel is only one part of cost per mile. Not included: driver pay, tolls, permits, maintenance, tires, insurance, deadhead miles (use the round-trip option for a return leg).',
      'Real fuel economy varies with load weight, speed, terrain, weather and idling, so use your own recent average rather than a rating.',
      'Runs in the browser; nothing entered is sent or stored.',
    ].join('\n'),
  },
  {
    id: 'detention-fee-calculator',
    name: 'Detention Fee Calculator',
    audience: 'drivers, carriers and brokers who wait at pickups and deliveries',
    facts: [
      'Free calculator that turns time on site, free time, an hourly rate and a billing increment into a detention charge.',
      'Billable time = time on site minus free time, rounded up to the billing increment. Charge = billable hours x hourly rate, limited to a maximum if the terms set one.',
      'Worked example: 4 hours 20 minutes on site with 2 hours free leaves 140 minutes. With 15-minute increments that rounds up to 150 minutes, 2.5 hours. At $50 per hour the charge is $125.',
      'There is no universal rate or free time. They come from the rate confirmation or contract.',
      'Getting it paid: read free time and rate before accepting the load, record arrival and departure times, tell the broker while waiting, invoice with proof.',
      'Detention (waiting during the day), layover (waiting overnight) and TONU (truck ordered not used) are different charges with their own terms.',
      'Runs in the browser; nothing entered is sent or stored.',
    ].join('\n'),
  },
];

// ── small helpers ───────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const opt = (name) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : undefined; };

function readIndex() {
  try { return JSON.parse(fs.readFileSync(INDEX_FILE, 'utf8')); } catch { return { drafts: [] }; }
}
function writeIndex(index) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2) + '\n');
}

// ── Gemini ──────────────────────────────────────────────────────────────────────
async function askGemini(prompt) {
  if (!GEMINI_KEY) throw new Error('GEMINI_API_KEY is not set');
  let lastErr;
  for (const model of MODELS) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json', temperature: 0.8 },
          }),
        });
        const body = await res.json().catch(() => ({}));
        if (res.status === 429 || res.status === 404) { lastErr = new Error(`${model}: HTTP ${res.status}`); break; } // next model
        if (!res.ok) throw new Error(`${model}: HTTP ${res.status} ${body.error?.message || ''}`.trim());
        const text = body.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error(`${model}: empty response (${body.candidates?.[0]?.finishReason || 'unknown'})`);
        const parsed = JSON.parse(text.replace(/^```json\s*|```$/g, ''));
        return { model, data: parsed };
      } catch (err) {
        lastErr = err;
        await sleep(3000 * attempt);
      }
    }
  }
  throw lastErr || new Error('no Gemini model produced a result');
}

const RULES = `HARD RULES (a script rejects the draft if any is broken):
- Neutral editorial voice. NEVER use I, me, my, we, our or us. The person who will publish this has no personal story, team, clients or dataset to refer to.
- Use ONLY facts that appear in the SOURCE below. Do not add statistics, numbers, examples, case studies, named companies or quotes that are not in it. Every figure you write must be in the SOURCE.
- Do not write the word "Loadly" and do not write any URL or domain. The link is added separately as the first comment; end with one plain line that points to the guide "in the first comment".
- Do not invent anecdotes ("a carrier lost...", "one shipper found...").
- No engagement bait ("comment below", "tag someone", "agree?"), no hype words (game-changer, unlock, revolutionize, delve, deep dive, fast-paced, ever-evolving, elevate, supercharge, "in today's").
- At most one emoji. No hashtags inside the post text (they are added from the "hashtags" field).
- Length: 500 to 1300 characters. Line 1 is the hook: a specific, concrete statement of at most 140 characters, no clickbait, no question like "Did you know".
- Formatting for LinkedIn: short paragraphs separated by blank lines; a short list of 2 to 4 lines starting with "- " is welcome. Plain text only, no markdown bold or headings.

STYLE (this is what makes it worth reading):
- Line 1 states the single most surprising or useful TRUE fact from the SOURCE as a plain sentence, so a reader who stops there still learned something (for example a concrete result, a common mistake, or a rule that people get wrong). Do not start with "Calculate", "Learn", "Discover", "Introducing", "Here is" or the name of the article.
- Then 1 to 2 sentences of context, then ONE concrete example or 3 short takeaways taken from the SOURCE. Do not restate the whole source: pick what a busy dispatcher, shipper or broker would actually use.
- Short sentences, plain words, no jargon without a few words of explanation. Sound like a knowledgeable colleague, not a brochure.
- Aim for 600 to 1000 characters. The last line is one short plain sentence saying the full guide (or the free calculator) is in the first comment.`;

function buildPrompt(kind, item, feedback) {
  const head = kind === 'tool'
    ? `Write ONE LinkedIn post announcing and explaining a free calculator, for ${item.audience}. Line 1 (the hook) must state the RESULT of the worked example from the SOURCE as one plain sentence, for example what a specific input turns into. Then explain the rule and who it helps.`
    : `Write ONE LinkedIn post that shares the most useful takeaways of the article below with logistics professionals, so a reader learns something real even without clicking. Do NOT use any statistic, percentage, currency amount or year from the article (they are not independently verified): state each takeaway in words. Small counts such as "three habits" are fine. Do not write quantities out in words either (no "ninety days", "one hundred fifty pounds"). Do not claim who does something most or what causes something most ("the leading cause of", "top-earning drivers", "most carriers", "studies show"): the article's claims are unverified, so give practical steps and plain definitions instead.`;
  const source = kind === 'tool'
    ? `CALCULATOR: ${item.name}\n${item.facts}`
    : `ARTICLE TITLE: ${item.title}\nARTICLE SUMMARY: ${item.excerpt || ''}\nARTICLE TEXT:\n${item.text.slice(0, 7000)}`;
  const retry = feedback
    ? `\n\nYOUR PREVIOUS DRAFT WAS REJECTED FOR THESE REASONS — FIX ALL OF THEM:\n${feedback.map((f) => `- ${f}`).join('\n')}\n`
    : '';
  return `${head}\n\n${RULES}\n\nReturn JSON only: {"post": "<the post text>", "hashtags": ["<Tag1>", "<Tag2>", "<Tag3>"]} where hashtags are 2 to 3 relevant industry tags without spaces.${retry}\n\nSOURCE:\n${source}`;
}

async function draftFor(kind, item, sourceText) {
  const strictNumbers = kind === 'article';
  let feedback = null;
  let lastIssues = [];
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const { model, data } = await askGemini(buildPrompt(kind, item, feedback));
    const post = String(data.post || '').replace(/\r\n/g, '\n').trim();
    const issues = Post.validatePost(post, sourceText, { strictNumbers });
    console.log(`  attempt ${attempt} (${model}): ${issues.length ? 'rejected — ' + issues.map((i) => i.split(':')[0]).join(', ') : 'passed all checks'}`);
    if (!issues.length) return { model, post, hashtags: Post.cleanHashtags(data.hashtags), attempts: attempt };
    feedback = issues;
    lastIssues = issues;
  }
  throw new Error(`no draft passed the checks after ${MAX_ATTEMPTS} attempts: ${lastIssues.join(' | ')}`);
}

// ── article selection ───────────────────────────────────────────────────────────
function supabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('NEXT_PUBLIC_SUPABASE_URL and a Supabase key are required to read articles');
  return createClient(url, key);
}

async function pickArticle(index, slugArg) {
  const sb = supabase();
  const cols = 'slug,title,excerpt,content,topic_cluster,created_at';
  if (slugArg) {
    const { data, error } = await sb.from('blog_posts').select(cols).eq('slug', slugArg).eq('published', true).single();
    if (error || !data) throw new Error(`article not found or unpublished: ${slugArg}`);
    return data;
  }
  const drafted = new Set(index.drafts.filter((d) => d.kind === 'article').map((d) => d.ref));
  const recentClusters = index.drafts.filter((d) => d.kind === 'article').slice(-2).map((d) => d.cluster).filter(Boolean);
  // Metadata first (cheap); the article body is only fetched for candidates that survive the cheap filters.
  const { data: meta, error } = await sb.from('blog_posts')
    .select('slug,title,meta_title,excerpt,topic_cluster,created_at')
    .eq('language', 'en').eq('published', true).order('created_at', { ascending: false }).limit(1000);
  if (error) throw new Error(`could not read articles: ${error.message}`);
  // Dated content is skipped: many older articles still carry a past year in the URL and body ("... 2025 ...")
  // and would look stale on LinkedIn. A post is stale if a past year appears in its slug/title/meta/excerpt,
  // or twice or more in the body (a single mention can be a legitimate historical reference).
  // Pass --include-stale to draft them anyway.
  const currentYear = new Date().getFullYear();
  const pastYears = (text) => (String(text || '').match(/\b20[12]\d\b/g) || []).filter((y) => Number(y) < currentYear);
  const headStale = (p) => pastYears(`${p.slug.replace(/-/g, ' ')} ${p.title} ${p.meta_title || ''} ${p.excerpt || ''}`).length > 0;
  const data = [];
  for (const p of meta || []) {
    if (drafted.has(p.slug) || (!flag('include-sensitive') && SENSITIVE.test(`${p.title} ${p.topic_cluster || ''}`))) continue;
    // A title/meta title with a percentage or amount ("Why 73% of Claims Get Denied") is an unverified statistic that
    // LinkedIn would show in the link preview under the poster's name, so those articles are skipped as well.
    if (/\d+(?:\.\d+)?\s?%|[$€£]\s?\d/.test(`${p.title} ${p.meta_title || ''}`)) continue;
    if (!flag('include-stale')) {
      if (headStale(p)) continue;
      const { data: body } = await sb.from('blog_posts').select('content').eq('slug', p.slug).single();
      if (pastYears(Quality.stripTags(body?.content)).length >= 2) continue;
    }
    data.push(p);
    if (data.length >= 12) break; // enough candidates to pick a fresh topic from
  }
  if (data.length) {
    // fetch the full record only for the ones we might actually use
    const { data: full } = await sb.from('blog_posts').select(cols).in('slug', data.map((p) => p.slug));
    const bySlug = new Map((full || []).map((r) => [r.slug, r]));
    data.forEach((p, i) => { data[i] = bySlug.get(p.slug) || p; });
  }
  // Health, legal, tax, customs and regulatory articles are skipped by default: the model cannot judge whether
  // their claims are right (a draft on CMR paperwork got the three copies wrong), and a wrong claim about the
  // law or someone's health posted under a real name is the costliest kind of mistake.
  // Pass --include-sensitive to draft them anyway; the draft then carries a verify-first warning.
  const fresh = (data || []).filter((p) => !drafted.has(p.slug) && (flag('include-sensitive') || !SENSITIVE.test(`${p.title} ${p.topic_cluster || ''}`)));
  // Prefer a topic the last two drafts did not cover, so the feed does not repeat itself.
  return fresh.find((p) => !recentClusters.includes(p.topic_cluster)) || fresh[0] || null;
}

// ── output ──────────────────────────────────────────────────────────────────────
function utm(url, campaign) {
  return `${url}?utm_source=linkedin&utm_medium=social&utm_campaign=${encodeURIComponent(campaign)}`;
}

// Health, legal, tax, customs and regulatory topics: the model can repeat an article's claim confidently
// without being able to tell whether it is right, so those drafts carry an explicit verify-first warning.
const SENSITIVE = /\b(?:sleep apnea|medical|health|drugs?|alcohol|clearinghouse|fmcsa|dot|osha|hazmat|hazardous|customs|tariffs?|dut(?:y|ies)|tax(?:es)?|irs|ifta|insurance|liabilit\w+|legal|laws?|lawsuits?|regulat\w+|compliance|cdl|hours[- ]of[- ]service|eld|permits?|carnet|tir|borders?|cross-border|import(?:s|ing|ers?)?|export(?:s|ing|ers?)?|incoterms?|sanctions?|embargo\w*|visas?)\b/i;

function writeDraft({ kind, ref, title, url, campaign, result, cluster, sourceText }) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const date = new Date().toISOString().slice(0, 10);
  const file = `${date}-${kind}-${ref.slice(0, 70)}.md`;
  const body = [result.post, '', result.hashtags.join(' ')].join('\n').trim();
  const link = utm(url, campaign);
  const sensitiveNote = kind === 'article' && SENSITIVE.test(`${title} ${cluster || ''}`)
    ? '- **Sensitive topic (health, legal, tax, customs or regulation).** The model cannot tell whether the article\'s claims are right. Check every statement against the official source linked at the end of the article before you post, or skip this draft.\n'
    : '';
  const md = `---
kind: ${kind}
title: ${JSON.stringify(title)}
source: ${url}
generated: ${new Date().toISOString()}
model: ${result.model}
status: draft   # change to "published" (and add the date) after you post it
---

# ${title}

## Post — copy everything in this block

\`\`\`text
${body}
\`\`\`

## First comment — post it right after publishing

\`\`\`text
${kind === 'tool' ? 'Free calculator' : 'Full guide'}: ${link}
\`\`\`

## Before you publish

- Read it once. If a sentence is not something you would stand behind, cut or rewrite it. It goes out under your name.
- Every figure in the post was checked against the source; the link goes in the first comment, not the post.
${sensitiveNote}- ${result.attempts > 1 ? `This draft needed ${result.attempts} attempts to pass the automatic checks.` : 'This draft passed the automatic checks on the first attempt.'}
`;
  fs.writeFileSync(path.join(OUT_DIR, file), md);
  return { file, body };
}

async function makeOne(index, mode) {
  const tools = TOOLS.filter((t) => !index.drafts.some((d) => d.kind === 'tool' && d.ref === t.id));
  const slugArg = opt('slug');
  const wantTool = mode === 'tools' || (mode === 'auto' && !slugArg && tools.length > 0);

  if (wantTool) {
    if (!tools.length) { console.log('All calculator drafts already exist.'); return false; }
    const tool = tools[0];
    console.log(`Drafting calculator post: ${tool.name}`);
    const url = `${SITE_URL}/en/tools/${tool.id}`;
    const result = await draftFor('tool', tool, tool.facts + ' ' + tool.name);
    if (flag('dry')) {
      console.log('\n' + result.post + '\n' + result.hashtags.join(' ') + '\n');
      index.drafts.push({ kind: 'tool', ref: tool.id }); // in memory only, so --dry --tools walks through every tool
      return true;
    }
    const { file } = writeDraft({ kind: 'tool', ref: tool.id, title: tool.name, url, campaign: `tool-${tool.id}`, result });
    index.drafts.push({ kind: 'tool', ref: tool.id, file, createdAt: new Date().toISOString() });
    console.log(`  saved linkedin-drafts/${file}`);
    return true;
  }

  const article = await pickArticle(index, slugArg);
  if (!article) { console.log('No undrafted articles left.'); return false; }
  console.log(`Drafting article post: ${article.title}`);
  const text = Quality.stripTags(article.content);
  const url = `${SITE_URL}/en/blog/${article.slug}`;
  let result;
  try {
    result = await draftFor('article', { ...article, text }, `${article.title} ${article.excerpt || ''} ${text}`);
  } catch (err) {
    // An article the model cannot summarise within the rules is remembered and skipped, so one bad article
    // never blocks the schedule. API/quota errors are NOT remembered: those should simply be retried later.
    if (!/^no draft passed the checks/.test(err.message) || slugArg) throw err;
    console.log(`  skipping this article: ${err.message.slice(0, 160)}`);
    if (!flag('dry')) {
      index.drafts.push({ kind: 'article', ref: article.slug, cluster: article.topic_cluster || null, failed: true, reason: err.message.slice(0, 300), createdAt: new Date().toISOString() });
    }
    return 'skipped';
  }
  if (flag('dry')) {
    console.log('\n' + result.post + '\n' + result.hashtags.join(' ') + '\n');
    index.drafts.push({ kind: 'article', ref: article.slug, cluster: article.topic_cluster || null });
    return true;
  }
  const { file } = writeDraft({
    kind: 'article', ref: article.slug, title: article.title, url,
    campaign: `blog-${article.slug.replace(/-en$/, '')}`, result, cluster: article.topic_cluster,
  });
  index.drafts.push({ kind: 'article', ref: article.slug, cluster: article.topic_cluster || null, file, createdAt: new Date().toISOString() });
  console.log(`  saved linkedin-drafts/${file}`);
  return true;
}

(async () => {
  const index = readIndex();
  const mode = flag('tools') ? 'tools' : 'auto';
  const count = flag('tools') ? TOOLS.length : parseInt(opt('count') || '1', 10);
  let made = 0;
  let skipped = 0;
  while (made < count && skipped < 5) {
    const ok = await makeOne(index, mode);
    if (!ok) break;
    if (ok === 'skipped') { skipped++; if (!flag('dry')) writeIndex(index); continue; }
    made++;
    if (!flag('dry')) writeIndex(index);
  }
  console.log(`Done: ${made} draft${made === 1 ? '' : 's'} ${flag('dry') ? '(dry run, nothing written)' : 'written to linkedin-drafts/'}.`);
})().catch((err) => {
  console.error('FAILED:', err.message);
  process.exit(1);
});
