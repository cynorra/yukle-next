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
