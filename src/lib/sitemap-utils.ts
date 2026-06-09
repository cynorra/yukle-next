/**
 * Shared sitemap utilities – single source of truth for locale list,
 * XML escaping, and alternate-link generation used by all sub-sitemaps.
 */

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

export const ALL_LOCALES = [
  'en', 'tr', 'es', 'pt', 'fr', 'de', 'it', 'pl', 'nl',
  'ru', 'uk', 'zh', 'ja', 'hi', 'ar', 'fa',
  'ko', 'vi', 'id', 'bn', 'ur', 'th', 'ms', 'tl',
  'ro', 'sv', 'cs', 'hu', 'el', 'az', 'kk', 'he',
  'bg', 'hr', 'sr', 'sk', 'da', 'fi', 'no', 'uz',
  'ta', 'mr', 'ka', 'lt', 'lv', 'et', 'sl'
] as const;

export type SitemapLocale = typeof ALL_LOCALES[number];

/** Escape special XML characters */
export function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

/** Generate xhtml:link alternate tags for all locales */
export function generateAlternates(pathFn: (locale: string) => string): string {
  let xml = '';
  for (const locale of ALL_LOCALES) {
    xml += `    <xhtml:link rel="alternate" hreflang="${locale}" href="${escapeXml(pathFn(locale))}"/>\n`;
  }
  // x-default always points to English
  xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(pathFn('en'))}"/>\n`;
  return xml;
}

/** Standard XML header for sub-sitemaps (urlset) */
export const URLSET_HEADER = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

/** Standard XML header for sitemap index */
export const SITEMAP_INDEX_HEADER = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

/** Common sitemap response headers */
export const SITEMAP_HEADERS = {
  'Content-Type': 'application/xml; charset=utf-8',
  'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=600',
  'X-Robots-Tag': 'noindex',
} as const;
