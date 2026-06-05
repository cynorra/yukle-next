/**
 * translate-free.js
 *
 * Free multi-language translation using MyMemory API.
 * - No API key required
 * - 10,000 words/day on free tier (with email param)
 * - Supports 85+ languages
 * - Parallel requests (5 at a time) for speed
 *
 * For 47 languages, title + short desc ≈ 94 requests
 * With 5 parallel: ~19 bursts × 200ms gap ≈ ~5 seconds per listing
 */

const https = require('https');

// ---------------------------------------------------------------------------
// Language code mapping: our 47 locales → MyMemory langpair codes
// ---------------------------------------------------------------------------
const LANG_MAP = {
  'en': 'en-US', 'tr': 'tr-TR', 'de': 'de-DE', 'fr': 'fr-FR',
  'es': 'es-ES', 'pt': 'pt-PT', 'it': 'it-IT', 'pl': 'pl-PL',
  'nl': 'nl-NL', 'ru': 'ru-RU', 'uk': 'uk-UA', 'zh': 'zh-CN',
  'ja': 'ja-JP', 'ko': 'ko-KR', 'hi': 'hi-IN', 'ar': 'ar-SA',
  'fa': 'fa-IR', 'ur': 'ur-PK', 'bn': 'bn-BD', 'id': 'id-ID',
  'ms': 'ms-MY', 'vi': 'vi-VN', 'th': 'th-TH', 'tl': 'tl-PH',
  'sw': 'sw-KE', 'ha': 'ha-NG', 'am': 'am-ET', 'yo': 'yo-NG',
  'ig': 'ig-NG', 'zu': 'zu-ZA', 'ro': 'ro-RO', 'hu': 'hu-HU',
  'cs': 'cs-CZ', 'sk': 'sk-SK', 'bg': 'bg-BG', 'hr': 'hr-HR',
  'sr': 'sr-RS', 'sl': 'sl-SI', 'et': 'et-EE', 'lv': 'lv-LV',
  'lt': 'lt-LT', 'fi': 'fi-FI', 'sv': 'sv-SE', 'da': 'da-DK',
  'no': 'no-NO', 'he': 'he-IL', 'el': 'el-GR',
};

// Languages MyMemory may not support well — fallback to English for these
const UNSUPPORTED = new Set(['ha', 'ig', 'yo', 'zu', 'am']);

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ---------------------------------------------------------------------------
// Single translation request
// ---------------------------------------------------------------------------
function translateOne(text, targetLocale, sourceLocale = 'en') {
  return new Promise((resolve) => {
    if (!text || !text.trim()) { resolve(text); return; }

    // For unsupported languages, return English
    if (UNSUPPORTED.has(targetLocale)) { resolve(text); return; }

    const srcCode = LANG_MAP[sourceLocale] || 'en-US';
    const tgtCode = LANG_MAP[targetLocale] || targetLocale;

    // Same language → no translation needed
    if (srcCode === tgtCode) { resolve(text); return; }

    const q = encodeURIComponent(text.slice(0, 500));
    const langpair = encodeURIComponent(`${srcCode}|${tgtCode}`);

    const req = https.request({
      hostname: 'api.mymemory.translated.net',
      port: 443,
      path: `/get?q=${q}&langpair=${langpair}&de=contact@yukle.app`,
      method: 'GET',
      headers: { 'User-Agent': 'YukleGlobalApp/2.0' },
      timeout: 12000,
    }, (res) => {
      let data = '';
      res.on('data', c => { data += c; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.responseStatus === 200 && json.responseData?.translatedText) {
            resolve(json.responseData.translatedText);
          } else {
            resolve(text); // fallback to source
          }
        } catch (e) { resolve(text); }
      });
    });
    req.on('error', () => resolve(text));
    req.on('timeout', () => { req.destroy(); resolve(text); });
    req.end();
  });
}

// ---------------------------------------------------------------------------
// Parallel batch translation (max N concurrent requests)
// ---------------------------------------------------------------------------
async function parallelTranslate(text, locales, sourceLocale = 'en', concurrency = 5) {
  const results = {};
  results[sourceLocale] = text; // source language as-is

  const targets = locales.filter(l => l !== sourceLocale);
  
  // Process in chunks of `concurrency`
  for (let i = 0; i < targets.length; i += concurrency) {
    const chunk = targets.slice(i, i + concurrency);
    const translations = await Promise.all(
      chunk.map(locale => translateOne(text, locale, sourceLocale))
    );
    chunk.forEach((locale, idx) => {
      results[locale] = translations[idx];
    });
    // Small delay between bursts to be polite to the API
    if (i + concurrency < targets.length) {
      await sleep(200);
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// Main export: translate title + description into all 47 locales
// ---------------------------------------------------------------------------
async function translateListing(title, description, locales, sourceLocale = 'en') {
  // Translate title in parallel (short text, fast)
  const titleTrans = await parallelTranslate(title, locales, sourceLocale, 6);
  await sleep(150);

  // For description: create a condensed version (route + company info only)
  // to keep within MyMemory's 500 char limit per call
  const condensedDesc = extractRouteInfo(description);

  const descTrans = await parallelTranslate(condensedDesc, locales, sourceLocale, 6);

  // For description, merge translated condensed + original full desc in English
  const finalDescTrans = {};
  locales.forEach(l => {
    if (l === sourceLocale) {
      finalDescTrans[l] = description; // full English description
    } else {
      // Translated condensed + original description reference
      finalDescTrans[l] = descTrans[l] || description;
    }
  });

  return {
    title_translations: titleTrans,
    description_translations: finalDescTrans,
  };
}

// Extract key route information (< 500 chars) from a description
function extractRouteInfo(description) {
  const lines = description.split('\n').map(l => l.trim()).filter(Boolean);
  const key = lines.filter(l =>
    l.startsWith('Company:') ||
    l.startsWith('Phone:') ||
    l.startsWith('Route:') ||
    l.startsWith('Equipment:') ||
    l.startsWith('Available:') ||
    l.startsWith('[')
  ).join(' | ');
  return key.slice(0, 490) || description.slice(0, 490);
}

// ---------------------------------------------------------------------------
// Translate a BATCH of listings (used by scraper)
// Returns array of { item_index, title_translations, description_translations }
// ---------------------------------------------------------------------------
async function translateListingsBatch(items, locales, sourceLocale = 'en') {
  const results = [];
  for (let i = 0; i < items.length; i++) {
    const { title, description } = items[i];
    console.log(`    [MyMemory] Translating item ${i + 1}/${items.length}: "${title.slice(0, 50)}..."`);
    const trans = await translateListing(title, description, locales, sourceLocale);
    results.push({
      item_index: i,
      title_translations: trans.title_translations,
      description_translations: trans.description_translations,
    });
    if (i < items.length - 1) await sleep(100); // brief pause between items
  }
  return results;
}

module.exports = {
  translateListing,
  translateListingsBatch,
  translateOne,
  LANG_MAP,
  UNSUPPORTED,
};
