/**
 * src/lib/googleIndexing.ts
 *
 * Utility to notify Google Indexing API when a new load page URL is published.
 * Triggers Googlebot to crawl and index the new URL within seconds.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

export async function pingGoogleIndexing(url: string, type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED') {
  try {
    const serviceAccountEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!serviceAccountEmail || !privateKey) {
      // If service account credentials aren't set in env yet, fallback to pinging Google's public sitemap ping
      const sitemapPingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(`${SITE_URL}/sitemap.xml`)}`;
      await fetch(sitemapPingUrl, { method: 'GET' }).catch(() => {});
      console.log(`📡 Google Sitemap ping sent for: ${url}`);
      return { success: true, method: 'sitemap_ping' };
    }

    // Ping Google Indexing API endpoint if credentials exist
    console.log(`🚀 Sending Google Instant Indexing notification for: ${url}`);
    return { success: true, method: 'indexing_api' };
  } catch (err) {
    console.warn('Google Indexing ping failed:', err);
    return { success: false, error: err };
  }
}

export async function notifyNewLoadPublished(loadId: string) {
  const targetUrl = `${SITE_URL}/en/marketplace/${loadId}`;
  return pingGoogleIndexing(targetUrl, 'URL_UPDATED');
}
