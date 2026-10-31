// Editorial-depth gates, complementing article-quality.js (which only blocks fabrication/brand/hype).
// Those gates stop the worst things; these stop the *generic* article: filler clichés, stock
// "Imagine…" openers, statistics that appear in no source, and drafts that do not actually cite the
// primary sources they were given. Pure functions, no I/O.

const stripTags = (html) => String(html || '').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();

// Stock AI/SEO phrasing. Any hit is rejected: the sentence says nothing a specific rule or number could not say better.
const CLICHES = [
  /\bin today['’]s (?:fast[- ]paced|ever[- ]changing|competitive|dynamic|digital|complex)\b/i,
  /\b(?:navigat(?:e|ing) the (?:complex(?:ities)?|landscape|world|challenges))\b/i,
  /\b(?:rapidly )?evolving (?:landscape|world|industry)\b/i,
  /\bdelve(?:s|d)? into\b/i,
  /\bgame[- ]?changer\b/i,
  /\bunlock(?:s|ing)? (?:the )?(?:power|potential|secrets?|savings|efficien\w+|value|growth)\b/i,
  /\bin the (?:ever[- ]evolving|ever[- ]changing) (?:world|landscape)\b/i,
  /\bit(?:'|’)?s (?:important|crucial|essential|vital) to (?:note|remember|understand|recognize)\b/i,
  /\bat the end of the day\b/i,
  /\btake(?:s)? (?:it|things|your \w+) to the next level\b/i,
  /\bstay(?:ing)? ahead of the (?:curve|competition)\b/i,
  /\b(?:holistic|synerg(?:y|ies|istic)|paradigm shift|best[- ]in[- ]class|cutting[- ]edge|state[- ]of[- ]the[- ]art|robust (?:solution|framework|system))\b/i,
  /\bwhether you(?:'|’)?re a .{3,40}? or a\b/i,
  /\bin (?:conclusion|summary),? /i,
  /\bwithout further ado\b/i,
  /\bmany (?:companies|carriers|brokers|shippers|businesses|fleets) struggle\b/i,
  /\bupwards? of \d/i,
  /\bhidden (?:costs?|gems?|truths?)\b/i,
];

function findCliche(html) {
  const text = stripTags(html);
  for (const re of CLICHES) {
    const m = text.match(re);
    if (m) return m[0];
  }
  return null;
}

// "Imagine a 10-truck fleet…" is acceptable once as a worked example; as the opener of the piece or repeated, it is the tell-tale generic format.
function countHypotheticalCrutch(html) {
  const text = stripTags(html);
  const opener = /(?:imagine|suppose|picture this|hypothetically)/i.test(text.slice(0, 900)) ? 1 : 0;
  const all = (text.match(/\b(?:imagine|suppose|hypothetically|picture a)\b/gi) || []).length;
  return { opener: opener === 1, count: all };
}

// Every percentage in the body must trace to the supplied source text. (Round figures in a labelled worked example
// use dollars/units, not percentages; if a percentage is not in the sources it is an unsourced statistic.)
function findUnsourcedPercents(html, sourceText) {
  const body = stripTags(html);
  const src = String(sourceText || '');
  const found = [];
  const re = /(\d{1,3}(?:\.\d+)?)\s?(?:%|percent\b)/gi;
  let m;
  while ((m = re.exec(body))) {
    const n = m[1];
    const inSource = new RegExp(`(?<![\\d.])${n.replace('.', '\\.')}\\s?(?:%|percent)`, 'i').test(src);
    if (!inSource) found.push(m[0]);
  }
  return [...new Set(found)];
}

// How many of the supplied sources does the body actually cite by name (e.g. "49 CFR § 395.3", "EIA")?
function countSourceCitations(html, sources) {
  const body = stripTags(html);
  const hit = new Set();
  for (const s of sources || []) {
    const cite = String(s.cite || '').trim();
    if (!cite) continue;
    const variants = [cite, cite.replace('§ ', '§'), cite.replace('§ ', 'section ').replace(/^(\d+) CFR /, '$1 CFR ')];
    if (/CFR/.test(cite)) {
      const sec = cite.match(/§\s?([\d.]+)/);
      if (sec) variants.push(`${sec[1]}`);
    }
    if (variants.some((v) => v && body.includes(v))) hit.add(cite);
  }
  return hit.size;
}

// Sections that are only a heading plus one short paragraph read as filler.
function countThinSections(html) {
  const parts = String(html || '').split(/<h2[^>]*>/i).slice(1);
  let thin = 0;
  for (const p of parts) {
    const words = stripTags(p.split(/<\/h2>/i).slice(1).join(' ')).split(/\s+/).filter(Boolean).length;
    if (words < 70 && !/faq|frequently asked|takeaway|bottom line|at a glance|sources|resources/i.test(p.slice(0, 120))) thin++;
  }
  return thin;
}

function validateEditorial(post, grounding) {
  const issues = [];
  const content = post.content || '';
  const cliche = findCliche(content);
  if (cliche) issues.push(`STOCK PHRASE ("${cliche}") — cut filler and generic framing; replace with the specific rule, threshold or step it was standing in for.`);

  const h = countHypotheticalCrutch(content);
  if (h.opener) issues.push('GENERIC "IMAGINE…" OPENER — open the article with the rule, the number or the concrete decision the reader faces, taken from the SOURCE MATERIAL, not a made-up scenario.');
  if (h.count > 2) issues.push(`TOO MANY HYPOTHETICALS (${h.count}) — at most ONE clearly labelled worked example in the whole article; everything else must come from the sources.`);

  if (grounding && grounding.sources && grounding.sources.length) {
    const unsourced = findUnsourcedPercents(content, grounding.sourceText);
    if (unsourced.length) issues.push(`UNSOURCED PERCENTAGES (${unsourced.slice(0, 5).join(', ')}) — a percentage may appear only if it is stated in the SOURCE MATERIAL; otherwise describe the effect in words.`);
    const need = Math.min(3, grounding.sources.length);
    const cited = countSourceCitations(content, grounding.sources);
    if (cited < need) issues.push(`UNDER-CITED (${cited}/${need} sources named) — the body must name the supplied sources by their cite-as label (e.g. "49 CFR § 395.3") where it relies on them, at least ${need} different ones.`);
  }
  const thin = countThinSections(content);
  if (thin > 1) issues.push(`THIN SECTIONS (${thin} sections under ~70 words) — merge them into fuller sections or develop each with a rule, a step list or a worked calculation.`);
  return issues;
}

module.exports = { CLICHES, findCliche, countHypotheticalCrutch, findUnsourcedPercents, countSourceCitations, countThinSections, validateEditorial };
