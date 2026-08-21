/**
 * Baidu "Active Push" (主动推送) – Baidu does NOT support IndexNow, so it
 * needs its own submission call to get fast crawling in China (where
 * Google is blocked and Baidu has the dominant search share).
 *
 * Setup (manual, one-time, on Baidu's side — cannot be automated):
 * 1. Register the site at https://ziyuan.baidu.com (Baidu Search Resource
 *    Platform) and verify ownership (the BAIDU_VERIFICATION_CODE env var /
 *    `baidu-site-verification` meta tag in layout.tsx already supports this).
 * 2. Under "普通收录" (Normal Inclusion) → "API提交" (API Submission), Baidu
 *    gives a push endpoint URL containing a site-specific token.
 * 3. Set that token as BAIDU_PUSH_TOKEN (env var) — until it's set, this is
 *    a silent no-op, same pattern as the Pexels key gate.
 *
 * Daily quota is capped per site (Baidu decides the number, visible on the
 * platform) — this silently no-ops on failure/quota-exhaustion, same as
 * IndexNow, since indexing pushes are always best-effort.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';
const BAIDU_PUSH_TOKEN = process.env.BAIDU_PUSH_TOKEN;

export async function submitToBaidu(urls: string[]): Promise<void> {
  if (!BAIDU_PUSH_TOKEN || !urls.length) return;

  const endpoint = `http://data.zz.baidu.com/urls?site=${encodeURIComponent(new URL(SITE_URL).origin)}&token=${encodeURIComponent(BAIDU_PUSH_TOKEN)}`;

  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: urls.slice(0, 2000).join('\n'), // Baidu's own per-call cap
    });
  } catch {
    // Silently fail – indexing is best-effort
  }
}

/**
 * Baidu's legacy blog-ping protocol (XML-RPC, `weblogUpdates.extendedPing`) —
 * no account, no token, no phone verification needed at all, unlike the
 * token-based push above. It's an old (2000s-era) blogosphere ping protocol
 * so reliability is unconfirmed and it's blog-post-shaped (title/home/post/
 * feed URLs), not a general bulk URL push — treat as a free best-effort
 * extra signal for blog posts specifically, not a replacement for the
 * token-based API above.
 */
export async function pingBaiduBlogPost(postTitle: string, postUrl: string): Promise<void> {
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

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
