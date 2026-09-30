// Turns invented-looking precision into honest estimates, without deleting sentences.
//
//   "14.7%"      -> "roughly 15%"        ("4.7%" -> "roughly 4.5%", "0.05%" / "2.5%" / "99.8%" are left alone)
//   "$1,847"     -> "roughly $1,800"     ($127 -> "roughly $150")
//   "2.3 days"   -> "about 2 days"
//
// The Editorial Policy allows "a realistic range with no invented precision", never a fabricated exact figure.
// A 2026-09-30 audit found 73 posts with 4+ such figures ("14.7%", "$1,847", "2.3 days") that read as discovered
// facts but have no source. Rounding + a hedge word keeps the sentence and the point, and removes the false
// precision. Left alone: figures inside a <blockquote> (attributed citations), figures inside a range ("€80-€120",
// "2.5-3.5 hours"), sentences that cite a rule or unit that really is decimal (SDR, CFR, HTS, NMFC, ISO, Incoterms,
// mpg, tariffs), quoted sample scripts, tiny (<1%) and very high (>=90%) percentages, and figures already hedged.
//
// Pure functions, unit-tested: only text between tags is edited.

const HEDGED_BEFORE = /(?:roughly|about|approximately|around|nearly|almost|over|under|up to|more than|less than|at least|at most|estimated|circa|~|average of|averaging|averages?)\s*$/i;
const KEEP_SENTENCE = /\b(?:SDR|CFR|HTS|HS code|NMFC|ISO|Incoterms|mpg|per gallon|per kg|per kilogram|cents?|tariff|duty rate|according to|source:|per the|as reported by)\b/i;
const RANGE_BEFORE = /[-\u2013\u2014]\s*[$\u20ac\u00a3]?\s*$|\d\s+to\s+[$\u20ac\u00a3]?\s*$/i;
const RANGE_AFTER = /^\s*(?:%|days?|hours?|hrs?|weeks?|minutes?)?\s*[-\u2013\u2014]\s*[$\u20ac\u00a3]?\d/i;

const round2 = (n) => (n >= 1000 ? Math.round(n / 100) * 100 : Math.round(n / 50) * 50);
const fmtMoney = (n) => n.toLocaleString('en-US');

// The generator kept re-using the SAME invented figures across unrelated posts ("$1,840 per truck per year" in 94
// of 806 posts, "14.3%" in 46, for claims about claims, port waits and packaging alike). Identical odd numbers in
// dozens of articles are the clearest fingerprint of fabricated statistics, so these few are replaced by plain
// language instead of being rounded to yet another repeated number.
// Figures that recur across unrelated posts (found by the archive audit). Attribution to a named body does not make a
// figure that appears in dozens of different "reports" real, so sentences/blockquotes carrying them are also purged
// (scripts/purge-signature-figures.js) and the plain occurrences are turned into words here.
const SIGNATURE_PCT = ['14.3', '18.7', '12.3', '12.7', '8.7'];
const SIGNATURE_USD = '1,?8(?:40|47|50)|3,?750';
const SIG_PCT_RE = '(?:' + SIGNATURE_PCT.map((x) => x.replace('.', '\\.')).join('|') + ')';
const SIG_ANY = new RegExp('(?:\\b' + SIG_PCT_RE + '%|\\$(?:' + SIGNATURE_USD + ')\\b)');

function neutraliseSignatures(s) {
  let out = s;
  const hedge = '(?:(?:an? )?(?:average|estimated) (?:of )?|averaging |roughly |about |approximately |nearly |over |up to |an extra |an additional )?';
  out = out.replace(new RegExp(hedge + '\\$(?:' + SIGNATURE_USD + ')\\b', 'gi'), 'thousands of dollars');
  out = out.replace(new RegExp('\\b(an? )?' + SIG_PCT_RE + '% (reduction|increase|improvement|drop|decrease|gain|rise|saving|savings|higher|lower|faster|slower|jump|decline)\\b', 'gi'), (m, art, w) => {
    const word = w.toLowerCase();
    const article = art ? (/^[aeiou]/.test(word) ? 'an ' : 'a ') : '';
    return (/^A/.test(m) ? article.toUpperCase().slice(0, 1) + article.slice(1) : article) + word;
  });
  out = out.replace(new RegExp('\\bby (?:an average of )?' + SIG_PCT_RE + '%', 'gi'), 'significantly');
  out = out.replace(new RegExp('\\b' + SIG_PCT_RE + '% of\\b', 'gi'), (m, offset, whole) => (offset === 0 || /[.!?:]\\s+$/.test(whole.slice(0, offset)) ? 'A notable share of' : 'a notable share of'));
  return out;
}

function neutraliseSignaturesLegacy(s) {
  let out = s;
  const hedge = '(?:(?:an? )?(?:average|estimated) (?:of )?|averaging |roughly |about |approximately |nearly |over |up to |an extra |an additional )?';
  out = out.replace(new RegExp(hedge + '\\$1,?84[07]\\b', 'gi'), 'thousands of dollars');
  out = out.replace(/\b(?:an? )?14\.3% (reduction|increase|improvement|drop|decrease|gain|rise|saving|savings|higher|lower|faster|slower|jump|decline)\b/gi, (m, w) => (/^an? /i.test(m) ? 'a ' : '') + w.toLowerCase());
  out = out.replace(/\bby (?:an average of )?14\.3%/gi, 'significantly');
  out = out.replace(/\b14\.3% of\b/gi, 'a notable share of');
  return out;
}

function hedgeSentence(sentence, ctx = '') {
  const t = sentence.trim();
  if (KEEP_SENTENCE.test(sentence) || /^["“]/.test(t)) return sentence;
  let s = neutraliseSignatures(sentence);
  const hedged = (whole, upto) => HEDGED_BEFORE.test((ctx + whole.slice(0, upto)));
  const inRange = (whole, start, end) => RANGE_BEFORE.test(whole.slice(0, start)) || RANGE_AFTER.test(whole.slice(end));

  // decimal percentages: 14.7% -> roughly 15% ; 4.7% -> roughly 4.5% ; keep x.5, <1 and >=90
  s = s.replace(/(^|[^\w.])(\d{1,3}\.\d{1,2})\s?%/g, (m, pre, num, offset, whole) => {
    const v = parseFloat(num);
    if (v < 1 || v >= 90 || /\.50?$/.test(num)) return m;
    if (inRange(whole, offset + pre.length, offset + m.length)) return m;
    const rounded = v < 10 ? Math.round(v * 2) / 2 : Math.round(v);
    const shown = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
    return `${pre}${hedged(whole, offset + pre.length) ? '' : 'roughly '}${shown}%`;
  });

  // odd dollar amounts (>= 100, not a multiple of 50): $1,847 -> roughly $1,800
  s = s.replace(/(^|[^\w])([$€£])\s?(\d{1,3}(?:,\d{3})+|\d{3,})(\.\d+)?(?![\d,])(?!\s?(?:million|billion|trillion|M\b|B\b|k\b|K\b))/g, (m, pre, cur, digits, dec, offset, whole) => {
    const n = parseFloat(digits.replace(/,/g, ''));
    if (n < 100 || n % 50 === 0) return m;
    if (inRange(whole, offset + pre.length, offset + m.length)) return m;
    return `${pre}${hedged(whole, offset + pre.length) ? '' : 'roughly '}${cur}${fmtMoney(round2(n))}`;
  });

  // fractional day/hour/week/minute counts: 2.3 days -> about 2 days
  s = s.replace(/(^|[^\w.])(\d+\.\d+)\s?(days?|hours?|hrs?|weeks?|minutes?)\b/gi, (m, pre, num, unit, offset, whole) => {
    if (inRange(whole, offset + pre.length, offset + m.length)) return m;
    const rounded = Math.max(1, Math.round(parseFloat(num)));
    const u = unit.toLowerCase().replace(/s$/, '');
    return `${pre}${hedged(whole, offset + pre.length) ? '' : 'about '}${rounded} ${rounded === 1 ? u : u + 's'}`;
  });

  return s;
}

/** Edit an HTML fragment: only text nodes, sentence by sentence; context before a tag is remembered ("estimated <strong>$1,847</strong>"). */
const TRAILING_HEDGE = /(?:(?:an? )?(?:average|estimated) (?:of )?|averaging |roughly |about |approximately |nearly |over |up to |an extra |an additional )$/i;

function hedgeHtml(html) {
  let ctx = '';
  const parts = html.split(/(<[^>]+>)/);
  const out = [];
  for (let i = 0; i < parts.length; i++) {
    const seg = parts[i];
    if (i % 2 === 1) { out.push(seg); continue; }
    const edited = !/\d\.\d|[$€£]\s?\d/.test(seg)
      ? seg
      : seg.split(/(?<=[.!?])(\s+)(?=[A-Z])/).map((part, k) => (k % 2 === 1 ? part : hedgeSentence(part, ctx))).join('');
    // a signature figure that opens this text node ("an average of <strong>$1,840</strong>") turned into plain words:
    // the hedge word that sits at the end of the previous text node would now be doubled - drop it there
    if (/^thousands of dollars/i.test(edited) && !/^thousands of dollars/i.test(seg) && i >= 2) {
      out[i - 2] = out[i - 2].replace(TRAILING_HEDGE, '');
    }
    out.push(edited);
    ctx = (ctx + seg).slice(-40);
  }
  return out.join('');
}

/** Whole article: blockquotes (citations) are masked and left untouched. */
function hedgeArticle(content) {
  const quotes = [];
  const masked = content.replace(/<blockquote[\s\S]*?<\/blockquote>/gi, (q) => { quotes.push(q); return `\u0000Q${quotes.length - 1}\u0000`; });
  const edited = masked.replace(/<(p|li|td|th|h[2-4])(\s[^>]*)?>([\s\S]*?)<\/\1>/gi, (m, tag, attrs, inner) => `<${tag}${attrs || ''}>${hedgeHtml(inner)}</${tag}>`);
  return edited.replace(/\u0000Q(\d+)\u0000/g, (m, i) => quotes[Number(i)]);
}

module.exports = { hedgeSentence, hedgeHtml, hedgeArticle, neutraliseSignatures, SIG_ANY, SIGNATURE_PCT, SIGNATURE_USD };
