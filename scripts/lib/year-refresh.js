// Removes a stale year that is only used as FRAMING ("in 2025", "for 2025", "the 2025 freight market")
// from article text, without touching years that are data points ("Q4 2025 report", "in 2025 rates rose 8%").
//
// Background: until 2026-09-20 the blog generator hardcoded 2025, so most of the archive reads as if 2025
// were "now". Dropping the year from a framing phrase never changes a claim ("Fails in 2025" -> "Fails"),
// so this is a deterministic text edit, not a rewrite. Pure functions (no I/O), unit-tested.
//
// Conservative by design: a year is left alone when it could be a real date (ranges, quarters, months,
// "by/since/from/until 2025", "2025 tariffs", "the 2025 report/data/survey") or when the fragment also
// contains other numbers/money (then "in 2025" may be the time of a stated figure).

const STALE = '2025';

const MONTHS = 'January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec';
// Words before the year that make it a real date or a range - never touch these.
const KEEP_BEFORE = new RegExp(String.raw`(?:\b(?:by|since|from|until|till|through|thru|to|between|and|or|vs\.?|versus|early|late|mid|end of|start of|beginning of|fiscal|calendar|FY|Q[1-4]|H[12]|` + MONTHS + String.raw`)\s+|[-–—/]\s*)$`, 'i');
// Nouns after the year that make it a real reference (a data source, a dated event or a named edition).
const KEEP_AFTER = /^(?:iteration|edition|version|update|revision|amendment|reform|tariffs?|election|hurricane|strike|act|bill|budget|deadline|report|reports|survey|surveys|study|studies|data|figures|numbers|statistics|forecast|forecasts|projection|projections|estimate|estimates|results|earnings|quarter|q[1-4]\b|h[12]\b|annual|census|index|edition)\b/i;

// A lowercase word after "in/for 2025" that starts a new clause (verb, conjunction, preposition) - here the whole
// "in 2025" phrase is a time adverbial and can be dropped; a noun after it means the year is an adjective instead.
const FUNCTION_AFTER = /^(?:and|or|but|nor|yet|without|with|within|isn['’]t|doesn['’]t|don['’]t|won['’]t|can['’]t|aren['’]t|demands|requires|means|is|are|was|were|will|would|can|could|should|must|may|might|has|have|had|calls|needs|brings|comes|remains|looks|feels|sees|shows|makes|involves|takes|does|do|yields|offers|provides|delivers|creates|allows|helps|ensures|gives|drives|continues|presents|poses|holds|starts|begins|ends|depends|relies|works|matters|counts|becomes|represents|reflects|marks|signals|opens|raises|changes|affects|impacts|leads|forces|pushes|puts|sets|adds|keeps|gets|goes|runs|stays|turns|tends|appears|seems|proves|that|which|who|when|while|as|if|because|so|then|than|to|from|by|at|on|the|a|an|these|those|this|it|they|we|you|not|no)\b/i;

// The year is an adjective ("the 2025 market", "Your 2025 Strategy", "Optimizing 2025 Costs") only after one of these,
// or at the very start of the text. After anything else (notably "in") it is a point in time and is left alone.
const ALLOW_BEFORE = new RegExp(String.raw`(?:^|[:;(—–-]\s*|\b(?:the|a|an|your|our|this|these|that|its|their|for|of|under|with|across|on|about|plus|new|best|top|complete|ultimate|full|every|each|all|any|following)\s+|\b\w+ing\s+)$`, 'i');

const hasOtherFigures = (text) => /\d/.test(text.replace(/2025/g, '')) || /[$€£%]/.test(text);

function tidy(s) {
  return s
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\s+([?!,.;:])/g, '$1')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .replace(/([(,:;])\s*([)?!,.;:])/g, '$2') // "(," or ": ?" left behind by a removal
    .replace(/:\s*:/g, ':');
}

/** Refresh one plain-text segment (no tags). `figures` = the whole fragment has other numbers or money. */
function refreshText(text, figures) {
  if (!text.includes(STALE)) return text;
  let s = text;

  // "(2025)" and "in 2025 and beyond" style tails
  s = s.replace(/\s*\(\s*2025\s*\)/g, '');
  s = s.replace(/\s+(?:in|for|into|through|throughout|entering|during)\s+2025\s+and\s+beyond\b/gi, '');
  s = s.replace(/\s+(?:in|for)\s+2025\s*(?:[-–]\s*)?(?:and|&)\s+beyond\b/gi, '');

  if (!figures) {
    // Sentence-initial "In 2025, ..." / "For 2025, ..." -> drop and capitalise what follows.
    s = s.replace(/(^|[.!?:]\s+)(?:In|For|During)\s+2025,\s+([a-z])/g, (m, pre, ch) => pre + ch.toUpperCase());
    // " in 2025" / " for 2025" / " during 2025" / " throughout 2025" / " of 2025" as a time phrase, unless it is part of a
    // year range or list ("in 2025 and 2026"). It goes only when what follows is punctuation, the end, or a verb or
    // conjunction ("Fails in 2025: ...", "the reality of 2025 is that ..."). "of 2025" needs a verb after it: "the best of
    // 2025." must not become "the best.". When a noun follows ("for 2025 planning") nothing is dropped here; the
    // adjective rule below decides.
    s = s.replace(/\s+(in|for|of|during|throughout)\s+2025(?![\d])(?!\s*(?:,\s*)?(?:and|or|to|through|until|vs\.?|versus|[-–—/])\s*(?:20\d\d|the\s+(?:first|second|third|fourth)))(?=[\s.,;:!?)"]|$)/gi,
      (m, prep, offset, whole) => {
        const after = whole.slice(offset + m.length);
        const next = (after.match(/^\s+(\S+)/) || [])[1] || '';
        if (/^of$/i.test(prep)) return FUNCTION_AFTER.test(next) ? '' : m;
        if (after === '' || /^[.,;:!?)"]/.test(after)) return '';
        return FUNCTION_AFTER.test(next) ? '' : m;
      });
  }

  // "the 2025 freight market" -> "the freight market", "Optimizing Your 2025 EU Strategy" -> "Optimizing Your EU Strategy"
  s = s.replace(/(^|[^\w])2025(\s+)(?=[A-Za-z])/g, (m, pre, sp, offset, whole) => {
    const before = whole.slice(0, offset + pre.length);
    if (KEEP_BEFORE.test(before)) return m;
    if (!ALLOW_BEFORE.test(before)) return m; // e.g. "in 2025 compared ..." / "2025 saw ..." - a date, not an adjective
    const after = whole.slice(offset + m.length);
    const nextWord = (after.match(/^[A-Za-z][\w'’-]*/) || [''])[0];
    if (FUNCTION_AFTER.test(nextWord)) return m; // "for 2025 is", "2025 saw": not an adjective
    const prevWord = (before.match(/(\w+)\s*$/) || [])[1] || '';
    // after a preposition only an acronym/Title-Case word may follow ("for 2025 EU Compliance"); "for 2025 planning" would read badly
    if (/^(?:for|of|under|with|across|on|about)$/i.test(prevWord) && !/^[A-Z]/.test(nextWord)) return m;
    // a/an agreement: "a 2025 IFTA audit" -> "a IFTA audit" is wrong and picking the article by letter is unreliable
    if (/^(?:a|an)$/i.test(prevWord) && /^[aeiou]/i.test(nextWord)) return m;
    // look at the next three words: "the 2025 ATA report", "the 2025 US import tariffs" are dated references
    if (after.trim().split(/\s+/).slice(0, 3).some((w) => KEEP_AFTER.test(w.replace(/[^\w'’-]/g, '')))) return m;
    return pre;
  });

  s = tidy(s);
  return s;
}

/** Refresh a fragment of HTML: only text between tags is edited, attributes and hrefs are never touched. */
function refreshHtml(html) {
  const plain = html.replace(/<[^>]+>/g, ' ');
  if (!plain.includes(STALE)) return html;
  const figures = hasOtherFigures(plain);
  const parts = html.split(/(<[^>]+>)/);
  const out = parts.map((p, i) => (i % 2 === 1 ? p : refreshText(p, figures)));
  let res = out.join('');
  // keep the first letter capitalised if the fragment started with a capital before
  const firstText = res.match(/^(\s*(?:<[^>]+>\s*)*)([a-z])/);
  const origFirst = html.match(/^(\s*(?:<[^>]+>\s*)*)([A-Z])/);
  if (firstText && origFirst) res = res.replace(/^(\s*(?:<[^>]+>\s*)*)([a-z])/, (m, pre, ch) => pre + ch.toUpperCase());
  return res;
}

/** Leaf blocks (no block-level tag inside) that mention the stale year. Blockquotes are skipped (citations). */
function findYearFragments(content) {
  const re = /<(p|li|h[2-4]|td|th)(\s[^>]*)?>((?:(?!<(?:p|li|ul|ol|table|thead|tbody|tr|td|th|h[1-6]|blockquote|div)\b)[\s\S])*?)<\/\1>/gi;
  const found = [];
  // mask blockquotes with spaces (same length) so blocks inside them are not matched, then slice the ORIGINAL text
  const masked = content.replace(/<blockquote[\s\S]*?<\/blockquote>/gi, (q) => ' '.repeat(q.length));
  let m;
  while ((m = re.exec(masked))) {
    const outer = content.slice(m.index, m.index + m[0].length);
    const inner = content.slice(m.index + m[0].indexOf('>') + 1, m.index + m[0].length - (`</${m[1]}>`).length);
    if (inner.replace(/<[^>]+>/g, ' ').includes(STALE)) found.push({ tag: m[1].toLowerCase(), outer, attrs: m[2] || '', inner });
  }
  return found;
}

const tagSeq = (s) => (s.match(/<\/?[a-z0-9]+/gi) || []).join('|');

/** Validate a proposed edit; returns null when it is safe or a reason when it is not. */
function checkEdit(oldInner, newInner) {
  if (newInner === oldInner) return 'unchanged';
  if (tagSeq(oldInner) !== tagSeq(newInner)) return 'tags changed';
  const hrefs = (s) => (s.match(/href="[^"]*"/g) || []).join('|');
  if (hrefs(oldInner) !== hrefs(newInner)) return 'link changed';
  const plainOld = oldInner.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const plainNew = newInner.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (plainNew.length < plainOld.length * 0.6) return 'removed too much';
  if (plainNew.length < 8) return 'stub';
  if (/\s[?!,.;:]/.test(plainNew) && !/\s[?!,.;:]/.test(plainOld)) return 'punctuation gap';
  if (/\b(?:in|for|of|the|a|an|to|and|or|with)\s*[?!,.;:]/i.test(plainNew) && !/\b(?:in|for|of|the|a|an|to|and|or|with)\s*[?!,.;:]/i.test(plainOld)) return 'dangling preposition';
  // a preposition/article now directly in front of a verb ("the reality of is that", "a IFTA audit")
  const orphan = /\b(?:for|of|in|to|the)\s+(?:is|are|was|were|yields|requires|demands|means|will|can|should|must)\b/i;
  if (orphan.test(plainNew) && !orphan.test(plainOld)) return 'preposition before verb';
  if (/\ba\s+[aeiou]\w*/i.test(plainNew) && !/\ba\s+[aeiou]\w*/i.test(plainOld) && plainOld.match(/\ba\s+2025\b/i)) return 'article agreement';
  if (/\b(?:in|for|of|the|a|an|to|and|or|with)\s*$/i.test(plainNew) && !/\b(?:in|for|of|the|a|an|to|and|or|with)\s*$/i.test(plainOld)) return 'dangling end';
  return null;
}

module.exports = { refreshText, refreshHtml, findYearFragments, checkEdit, hasOtherFigures, STALE };
