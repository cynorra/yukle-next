/**
 * scripts/lib/indexnow.js
 *
 * CommonJS port of src/lib/indexnow.ts + src/lib/baiduPush.ts +
 * src/lib/googleIndexing.ts for use in scripts run directly via `node` (the
 * GitHub Actions cron jobs) rather than through the Next.js build — those
 * TS files live under src/ and aren't reachable from a plain `node scripts/*.js`
 * invocation. Keep this in sync with the src/lib/ versions if either changes.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';
const INDEXNOW_KEY = 'b4f7e2a8d1c3956e0a1b2c3d4e5f6789';
const BAIDU_PUSH_TOKEN = process.env.BAIDU_PUSH_TOKEN;

const INDEXNOW_ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://yandex.com/indexnow',
  'https://searchadvisor.naver.com/indexnow',
  'https://search.seznam.cz/indexnow',
];

async function submitToIndexNow(urls) {
  if (!urls || !urls.length) return;

  const body = JSON.stringify({
    host: new URL(SITE_URL).host,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls.slice(0, 10000),
  });

  await Promise.allSettled(
    INDEXNOW_ENDPOINTS.map((endpoint) =>
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body,
      }).catch(() => {})
    )
  );
}

async function submitToBaidu(urls) {
  if (!BAIDU_PUSH_TOKEN || !urls || !urls.length) return;

  const endpoint = `http://data.zz.baidu.com/urls?site=${encodeURIComponent(new URL(SITE_URL).origin)}&token=${encodeURIComponent(BAIDU_PUSH_TOKEN)}`;

  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: urls.slice(0, 2000).join('\n'),
    });
  } catch {
    // Silently fail – indexing is best-effort
  }
}

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function pingBaiduBlogPost(postTitle, postUrl) {
  const xml = `<?xml version="1.0"?>
<methodCall>
  <methodName>weblogUpdates.extendedPing</methodName>
  <params>
    <param><value><string>${escapeXml(postTitle)}</string></value></param>
    <param><value><string>${SITE_URL}/en/blog</string></value></param>
    <param><value><string>${escapeXml(postUrl)}</string></value></param>
    <param><value><string>${SITE_URL}/sitemap.xml</string></value></param>
  </params>
</methodCall>`;

  try {
    await fetch('http://ping.baidu.com/ping/RPC2', {
      method: 'POST',
      headers: { 'Content-Type': 'text/xml' },
      body: xml,
    });
  } catch {
    // Silently fail – indexing is best-effort
  }
}

async function pingGoogleIndexing(url) {
  try {
    const sitemapPingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(`${SITE_URL}/sitemap.xml`)}`;
    await fetch(sitemapPingUrl, { method: 'GET' }).catch(() => {});
  } catch {
    // Silently fail – indexing is best-effort
  }
}

module.exports = { submitToIndexNow, submitToBaidu, pingBaiduBlogPost, pingGoogleIndexing };
