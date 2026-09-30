// Second layer on top of year-refresh.js (2026-09-30): handles what the conservative first layer leaves behind.
//
//  1. "2025" used as a stale ADJECTIVE inside a text node ("the complex 2025 livestock transport regulations",
//     "a systematic 2025 carrier sales funnel") -> the year is dropped.
//  2. Headings / table cells that carry a generic year ("Freight Market Rates 2025", "What to Look For in 2025").
//  3. Present-tense statements about "2025" ("In 2025, average lumper fees range from $100 to $450") and a trailing
//     time phrase in a sentence that also has figures ("... reduced by 25% in 2025 by mastering ...").
//  4. Sentences that publish an invented FORECAST for a date that has already passed ("We predict a rate dip in
//     late February 2025") are removed - they are unsourced and now false.
//
// A year is NEVER touched when it is a real, named reference: regulation editions (ADR 2025, IATA DGR 2025, ATP,
// IMDG, ERG, CFR), EU milestones, "Mobility Package", eFTI, CSRD/CBAM, months/quarters/ranges, "by 2025", "as of 2025",
// "since/until/from 2025", reports/surveys/studies. Pure functions, unit-tested.

const PROTECT_BEFORE = /(?:\b(?:ADR|DGR|IMDG|ATP|ERG|CFR|NMFC|HTS|HS|EU['’]s|EU|eFTI|CSRD|CBAM|Package|Regulation|Directive|Q[1-4]|H[12]|FY|fiscal|calendar|since|until|till|from|through|between|by|as of|late|early|mid|end of|start of|beginning of|pre|post|January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[-\s]*)$/i;
const PROTECT_AFTER = /^(?:\s*(?:iteration|edition|version|update|updates|revision|amendment|reform|tariffs?|election|hurricane|strike|act|bill|budget|deadline|report|reports|survey|surveys|study|studies|data|figures|forecast|projection|estimate|estimates|index|rules|guidelines|requirements|regulations|emissions|targets|standard|standards|mandate|package|guidance)\b)/i;

const FORECAST_SENTENCE = /\b(?:we|our team|our analysts?)\s+(?:predict|foresee|forecast|project|anticipate|expect|estimate)\b/i;
const HEAD_NOUN = /(?:Rates|Regulations|Compliance|Playbook|Guide|Costs|Cost|Strategy|Strategies|Checklist|Requirements|Rules|Trends|Practices|Market|Outlook|Forecast|Tips|Options|Audit|Standards|Logistics|Freight|Planning|Management|Optimization|Solutions|Insights|Updates|Changes|Blueprint|Handbook|Roadmap|Software|Technology)$/;
const NOT_NOUN_START = /^(?:and|or|but|is|are|was|were|will|would|can|could|should|must|may|might|has|have|had|saw|brought|marked|won['’]t|isn['’]t|the|a|an|to|for|in|of|on|at|as|with|when|while|if)$/;
const VERB_AFTER = /^(?:include|includes|involve|involves|require|requires|demand|demands|hinge|hinges|mean|means|offer|offers|bring|brings|show|shows|see|sees|look|looks|remain|remains|pose|poses|present|presents|change|changes|reshape|reshapes|transform|transforms|create|creates|drive|drives|push|pushes|force|forces|make|makes|take|takes|leave|leaves|raise|raises|hold|holds|call|calls|put|puts|set|sets|get|gets|keep|keeps)$/;
const PAST_MARKER = /\b(?:rose|fell|grew|increased|decreased|declined|dropped|jumped|surged|spiked|hit|reached|totaled|totalled|lost|paid|reported|saw|was|were|had|according|survey|study|report|Q[1-4]|January|February|March|April|May|June|July|August|September|October|November|December)\b/;
const PRESENT_VERB = '(?:typically|generally|usually|commonly|averages?|ranges?|costs?|varies|vary|is|are|remains?|can|will|often|tends?)';

/** Remove an adjective "2025 " from a plain text run when it is safe. */
function dropAdjectiveYear(text) {
  return text.replace(/(^|[^\w])(2025)(\s+)(?=[A-Za-z])/g, (m, pre, y, sp, offset, whole) => {
    const before = whole.slice(0, offset + pre.length);
    const after = whole.slice(offset + m.length);
    if (PROTECT_BEFORE.test(before)) return m;
    if (PROTECT_AFTER.test(' ' + after)) return m;
    const next = (after.match(/^[A-Za-z][\w'’-]*/) || [''])[0].toLowerCase();
    if (NOT_NOUN_START.test(next)) return m;
    // "in/during/throughout 2025 <word>" is a point in time; "for/of 2025 <noun phrase>" uses the year as a stale adjective
    if (/(?:\bin|\bduring|\bthroughout|\bby)\s*$/i.test(before)) return m;
    if (/(?:\bof|\bfor)\s*$/i.test(before) && VERB_AFTER.test(next)) return m;
    return pre;
  });
}

/** A heading/table-cell: drop a generic year token. */
function refreshHeadingText(text) {
  if (!/\b2025\b/.test(text)) return text;
  let s = text.replace(/\bIncoterms(?:®)?\s+2025\b/g, 'Incoterms 2020');
  const guarded = (re, needPrev) => {
    s = s.replace(re, (m, ...args) => {
      const offset = args[args.length - 2];
      const whole = args[args.length - 1];
      if (PROTECT_BEFORE.test(whole.slice(0, offset))) return m;
      if (PROTECT_AFTER.test(' ' + whole.slice(offset + m.length))) return m;
      if (needPrev && !needPrev.test(whole.slice(0, offset))) return m;
      return '';
    });
  };
  guarded(/\s+(?:in|for)\s+2025\b(?=\s*(?:[:?!,.)]|$))/g, HEAD_NOUN);   // "Retreading Playbook for 2025"
  guarded(/\s*\(\s*(?:estimated\s+)?2025\s*\)/g);
  guarded(/\s+2025\s*(?:&|and)\s+Beyond\b/gi);
  guarded(/,?\s+2025\b(?=\s*(?:[:?!,.)]|$))/g, HEAD_NOUN);              // trailing "... Rates 2025" (only after a plain noun)
  s = dropAdjectiveYear(s);
  return s.replace(/\s{2,}/g, ' ').replace(/\s+([?!,.;:)])/g, '$1').replace(/:\s*$/, '').trim();
}

/** Present-tense generic statements: "In 2025, average lumper fees range from $100 to $450." -> drop the framing. */
function dropPresentTenseYear(sentence) {
  let s = sentence;
  s = s.replace(/^(\s*)(?:In|For|During)\s+2025,\s+([A-Za-z])/, (m, ws, ch) => ws + ch.toUpperCase());   // comma required
  s = s.replace(/([:;]\s+)(?:In|For|During)\s+2025,\s+([A-Za-z])/g, (m, pre, ch) => pre + ch);
  s = s.replace(/,\s+(?:in|for)\s+2025,/g, ',');
  s = s.replace(new RegExp('\\s+(?:in|for|during)\\s+2025(?=,?\\s+(?:[a-z-]+\\s+){0,3}?' + PRESENT_VERB + '\\b)', 'g'), '');
  return s;
}

/** Sentence with other figures: drop only a " in 2025" time phrase, and only when the sentence does not report a past event. */
function dropTimePhraseWithFigures(sentence) {
  if (!/\b2025\b/.test(sentence)) return sentence;
  // only when what follows is punctuation, the end, or a connector/verb ("in 2025 freight rate ..." keeps the year: it is an adjective)
  return sentence.replace(/\s+(?:in|for|during)\s+2025(?=[.,;:)]|$|\s+(?:and|or|but|by|with|without|while|which|when|because|so|due|through|via|using|to|as|is|are|can|will|could|would|should|means|requires|demands)\b)/, (m, offset, whole) => {
    const before = whole.slice(0, offset);
    if (PAST_MARKER.test(before) || PROTECT_BEFORE.test(before)) return m;
    if (PROTECT_AFTER.test(' ' + whole.slice(offset + m.length))) return m;
    return '';
  });
}

/** Delete forecast sentences about a past date. */
function dropStaleForecasts(text) {
  return text.split(/(?<=[.!?])(\s+)/).filter((seg) => !(FORECAST_SENTENCE.test(seg) && /\b2025\b/.test(seg))).join('').trim();
}

module.exports = { dropAdjectiveYear, refreshHeadingText, dropPresentTenseYear, dropTimePhraseWithFigures, dropStaleForecasts, PROTECT_BEFORE, PROTECT_AFTER, FORECAST_SENTENCE };
