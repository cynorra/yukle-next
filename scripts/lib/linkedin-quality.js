// Code-level quality gates for AI-drafted LinkedIn posts (scripts/linkedin-drafts.js).
//
// The posts are published by a person, under their own name, so the risks are different from a
// blog article: an invented "in my 15 years as a dispatcher…", "we analysed 10,000 loads…" or a
// statistic that is not in the source is a fabricated claim with a real name attached to it.
// A prompt only asks the model not to; these checks enforce it and feed the findings back for a
// retry. Pure functions (no I/O) so they can be unit-tested.

const Q = require('./article-quality');

const MIN_CHARS = 500;
const MAX_CHARS = 1400;
const MAX_HOOK_CHARS = 150;

// First person is banned outright: the drafts are written in a neutral editorial voice, so there is
// no experience, client or dataset the writer could honestly be referring to.
const FIRST_PERSON_UPPER = /\bI(?:['’](?:m|ve|ll|d))?\b/;
const FIRST_PERSON_LOWER = /\b(?:my|mine|me|myself|we|our|ours|ourselves|us)\b/;
const FIRST_PERSON_LOWER_I = /\b(?:my|mine|me|myself|we|our|ours|ourselves|we['’](?:re|ve|ll|d))\b/i;

const BAIT = /\b(?:comment\s+(?:["“”']?\w+["“”']?\s+)?(?:below|to get|and i|and we)|tag (?:a|someone|your)|like (?:and|if)|repost (?:if|this)|follow (?:me|for)|agree\?|thoughts\?)/i;
const CLICHES = /\b(?:game[- ]?chang\w+|unlock(?:s|ing)?|revolutioni[sz]\w+|delve\w*|deep dive|fast[- ]paced|ever[- ]evolving|supercharge\w*|elevate\w*|in today['’]s)\b/i;

// Article posts only. Numbers written out in words ("ninety days", "one hundred fifty pounds") slip past the
// digit check, and vague authority ("studies show", "the leading cause of", "top-earning owner-operators",
// "most carriers") is a statistic in disguise: the article's own claims are unverified model output.
const SPELLED_NUMBER = /\b(?:eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundreds?|thousands?|millions?|billions?|dozens?)\b/i;
const UNSOURCED_AUTHORITY = /\b(?:studies|research|surveys?|reports?|data|analysis|experts?|analysts?)\s+(?:show|shows|showed|suggest|suggests|indicate|indicates|confirm|confirms|found|finds|reveal|reveals)\b|\baccording to\b|\b(?:leading|number one|most common|biggest|main|primary|top) (?:cause|reason|source|driver|factor)s?\b|\btop[- ]earning\b|\bbest[- ]performing\b|\b(?:most|majority of|many|few) (?:carriers|shippers|brokers|drivers|owner-operators|companies|fleets|businesses)\b|\bthe (?:only|best|fastest|cheapest)\b|\b(?:single )?(?:biggest|largest|greatest|number one|#1)\b|\broutinely\b/i;

/** Numbers that must be traceable to the source: money, percentages, decimals and anything above ten. */
function numbersNeedingSupport(text) {
  const found = new Set();
  const money = text.match(/[$€£]\s?\d[\d,]*(?:\.\d+)?/g) || [];
  for (const m of money) found.add(m.replace(/[^\d.]/g, ''));
  const pct = text.match(/\d[\d,]*(?:\.\d+)?\s?%/g) || [];
  for (const m of pct) found.add(m.replace(/[^\d.]/g, ''));
  const plain = text.match(/(?<![\w.])\d[\d,]*(?:\.\d+)?(?![\w])/g) || [];
  for (const m of plain) {
    const n = m.replace(/,/g, '');
    if (n.includes('.') || parseFloat(n) > 10) found.add(n);
  }
  return [...found].filter(Boolean);
}

function normalizeSource(sourceText) {
  return String(sourceText || '').replace(/(\d),(?=\d{3}\b)/g, '$1');
}

function countEmoji(text) {
  return (String(text).match(/\p{Extended_Pictographic}/gu) || []).length;
}

/**
 * @param {string} post        the post body (hashtags excluded)
 * @param {string} sourceText  the article / tool facts the post is allowed to draw from
 * @param {{strictNumbers?: boolean}} [opts]  strictNumbers: no figures at all (percentages, money, decimals,
 *        numbers above ten). Used for article posts, because an article's statistics are not independently
 *        verified and repeating them under a person's name would amplify them. Tool posts leave it off:
 *        their figures are worked examples computed by the calculator code.
 * @returns {string[]} human-readable issues; empty when the post passes
 */
function validatePost(post, sourceText, opts = {}) {
  const issues = [];
  const text = String(post || '').trim();
  if (!text) return ['EMPTY POST'];

  if (text.length < MIN_CHARS) issues.push(`TOO SHORT: ${text.length} characters (minimum ${MIN_CHARS}) — add the most useful takeaways from the source`);
  if (text.length > MAX_CHARS) issues.push(`TOO LONG: ${text.length} characters (maximum ${MAX_CHARS}) — cut the least useful points`);

  const hook = text.split(/\n/)[0].trim();
  if (hook.length > MAX_HOOK_CHARS) issues.push(`HOOK TOO LONG: the first line is ${hook.length} characters (maximum ${MAX_HOOK_CHARS}); LinkedIn cuts the post off after roughly the first two lines`);

  if (FIRST_PERSON_UPPER.test(text) || FIRST_PERSON_LOWER_I.test(text) || FIRST_PERSON_LOWER.test(text)) {
    issues.push('FIRST PERSON: do not use I/me/my/we/our/us. Write in a neutral editorial voice; the writer has no personal experience or team to refer to');
  }

  if (/loadly/i.test(text)) issues.push('BRAND: do not write the word "Loadly" — the link goes in the first comment, not in the post');
  if (/https?:\/\/|www\.|\b[a-z0-9-]+\.(?:com|net|org|io|app)\b/i.test(text)) issues.push('LINK: no URLs or domains in the post body — the link is added separately as the first comment');

  const claim = Q.findFirstPartyClaim(text);
  if (claim) issues.push(`FIRST-PARTY CLAIM: "${claim}" — no data, clients, analysis or customers of our own exist`);
  const anecdote = Q.findFabricatedAnecdote(text);
  if (anecdote) issues.push(`INVENTED ANECDOTE: "${anecdote}" — do not narrate a case that is not in the source`);
  // No separate false-precision gate: every figure must already appear in the source (below), which is
  // what actually stops invented precision, and a source figure such as "37.29 lb" is legitimate.

  const source = normalizeSource(sourceText);
  const figures = numbersNeedingSupport(text);
  if (opts.strictNumbers) {
    if (figures.length) issues.push(`NO FIGURES ALLOWED: remove ${figures.join(', ')} — statistics in articles are not independently verified, so write the takeaway in words instead (small counts like "three habits" are fine)`);
    const spelled = text.match(SPELLED_NUMBER);
    if (spelled) issues.push(`NO FIGURES ALLOWED: "${spelled[0]}" is a number written out in words — do not use quantities from the article, only small counts up to ten`);
    const authority = text.match(UNSOURCED_AUTHORITY);
    if (authority) issues.push(`UNSOURCED CLAIM: "${authority[0]}" states an authority or superlative that cannot be verified — describe what to do or what a term means instead of who does it most or what causes it most`);
  } else {
    const unsupported = figures.filter((n) => !source.includes(n));
    if (unsupported.length) issues.push(`UNSUPPORTED NUMBERS: ${unsupported.join(', ')} do not appear in the source — remove them or use only figures from the source`);
  }

  if (BAIT.test(text)) issues.push('ENGAGEMENT BAIT: remove "comment below / tag someone / agree?" style prompts');
  const cliche = text.match(CLICHES);
  if (cliche) issues.push(`CLICHE: "${cliche[0]}" — use plain, specific wording`);
  if (countEmoji(text) > 1) issues.push('EMOJI: use at most one emoji');

  return issues;
}

/** Keep at most three clean hashtags (letters/digits only). */
function cleanHashtags(list) {
  const out = [];
  const seen = new Set();
  for (const raw of Array.isArray(list) ? list : []) {
    const tag = String(raw).replace(/^#+/, '').replace(/[^A-Za-z0-9]/g, '');
    if (tag.length >= 3 && tag.length <= 30 && !seen.has(tag.toLowerCase())) {
      seen.add(tag.toLowerCase());
      out.push(tag);
    }
    if (out.length === 3) break;
  }
  return out.map((t) => `#${t}`);
}

module.exports = { validatePost, cleanHashtags, numbersNeedingSupport, MIN_CHARS, MAX_CHARS, MAX_HOOK_CHARS };
