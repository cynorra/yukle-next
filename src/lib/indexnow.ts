/**
 * IndexNow – Push URLs to Bing, Yandex, Seznam, Naver instantly.
 * Called after new loads or blog posts are created.
 *
 * Protocol: https://www.indexnow.org/
 * Supported engines: Bing, Yandex, Seznam.cz, Naver, DuckDuckGo (via Bing)
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';
const INDEXNOW_KEY = 'b4f7e2a8d1c3956e0a1b2c3d4e5f6789';

// All IndexNow-compatible search engines
const INDEXNOW_ENDPOINTS = [
  'https://api.indexnow.org/indexnow',        // Bing + DuckDuckGo
  'https://yandex.com/indexnow',               // Yandex
  'https://searchadvisor.naver.com/indexnow',  // Naver (Korea)
  'https://search.seznam.cz/indexnow',         // Seznam (Czech)
];

/**
 * Submit a batch of URLs to all IndexNow-compatible search engines.
 * Silently catches errors so it never blocks the caller.
 */
export async function submitToIndexNow(urls: string[]): Promise<void> {
  if (!urls.length) return;

  const body = JSON.stringify({
    host: new URL(SITE_URL).host,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls.slice(0, 10000), // IndexNow limit per request
  });

  const promises = INDEXNOW_ENDPOINTS.map(async (endpoint) => {
    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body,
      });
    } catch {
      // Silently fail – indexing is best-effort
    }
  });

  await Promise.allSettled(promises);
}

/**
 * Generate all locale variants of a given path and submit them.
 * e.g. path="/marketplace/123" → submits /en/marketplace/123, /tr/marketplace/123, etc.
 */
export async function indexNowAllLocales(path: string): Promise<void> {
  const ALL_LOCALES = [
    'en', 'tr', 'es', 'pt', 'fr', 'de', 'it', 'pl', 'nl',
    'ru', 'uk', 'zh', 'ja', 'hi', 'ar', 'fa',
    'ko', 'vi', 'id', 'bn', 'ur', 'th', 'ms', 'tl',
    'ro', 'sv', 'cs', 'hu', 'el', 'az', 'kk', 'he',
    'bg', 'hr', 'sr', 'sk', 'da', 'fi', 'no', 'uz',
    'ta', 'mr', 'ka', 'lt', 'lv', 'et', 'sl'
  ];

  const urls = ALL_LOCALES.map((locale) => `${SITE_URL}/${locale}${path}`);
  await submitToIndexNow(urls);
}

export { INDEXNOW_KEY };
