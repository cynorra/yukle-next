// Simple in‑memory sitemap cache (valid for 1 hour)
let cachedXml: string | null = null;
let cachedAt = 0;

/**
 * Retrieve cached sitemap XML if it is still fresh (within 1 hour).
 */
export function getCachedSitemap(): string | null {
  const ONE_HOUR = 60 * 60 * 1000;
  if (cachedXml && Date.now() - cachedAt < ONE_HOUR) {
    return cachedXml;
  }
  // Invalidate stale cache
  cachedXml = null;
  return null;
}

/**
 * Store generated sitemap XML in the in‑memory cache.
 */
export function setCachedSitemap(xml: string): void {
  cachedXml = xml;
  cachedAt = Date.now();
}
