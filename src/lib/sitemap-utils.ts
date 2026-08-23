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
  'ta', 'mr', 'ka', 'lt', 'lv', 'et', 'sl', 'kn', 'te', 'pa', 'gu', 'ml', 'sw', 'ne', 'si'
] as const;

export type SitemapLocale = typeof ALL_LOCALES[number];

/**
 * URLs-per-chunk-file limits — shared between the sitemap index (which
 * computes how many sitemap-X-N.xml files to list) and each [page]/route.ts
 * (which slices its query by the same size). These MUST stay in sync or the
 * index will point crawlers at page numbers whose offset math disagrees with
 * what the chunk route actually serves. Row-count growth itself is already
 * unbounded and needs no maintenance: the index computes
 * ceil(totalRows / PAGE_SIZE) fresh on every revalidation, so 50k, 500k, or
 * 5M rows all just produce more chunk files automatically.
 *
 * The one thing that isn't automatic is per-URL BYTE weight, since Google
 * rejects any single sitemap file over 50MB regardless of URL count. These
 * constants are deliberately sized from a WORST-CASE bound, not from
 * whatever today's data happens to look like, so they hold no matter how
 * translation coverage or slug lengths drift in the future:
 *
 *   worst-case bytes/URL ≈ (ALL_LOCALES.length + 1 x-default) alternate
 *   lines, each ≈ 60 bytes of fixed <xhtml:link> markup + href length, with
 *   href bounded by a generous max path-segment length per sitemap type
 *   (loads use a fixed 36-char UUID; blogs/routes use slugs, bounded here at
 *   100/70 chars respectively — real slugs observed in production top out
 *   well under that). Target ceiling is 35MB/file, a ~30% margin under
 *   Google's 50MB limit, so normal data drift never approaches the edge.
 *
 * checkSitemapSize() below is the second, independent line of defense: it
 * measures the ACTUAL rendered byte size on every request and loudly logs
 * if reality ever exceeds this model, so a violation is caught in server
 * logs immediately rather than silently producing a sitemap Google rejects.
 */
export const LOADS_PAGE_SIZE = 5000; // worst case (36-char UUID, full 55-locale coverage) ≈ 7.6KB/URL → ~38MB/file
export const BLOGS_PAGE_SIZE = 3500; // worst case (100-char slug, full 55-locale coverage + image tag) ≈ 11.3KB/URL → ~40MB/file
export const ROUTES_PAGE_SIZE = 4000; // worst case (70-char slug, always-full 55-locale coverage) ≈ 9.9KB/URL → ~40MB/file

/** Hard ceiling for a single sitemap file — Google rejects anything over 50MB. */
const SITEMAP_MAX_BYTES = 50 * 1024 * 1024;
/** Warn well before the hard ceiling so there's time to react before Google actually rejects a file. */
const SITEMAP_WARN_BYTES = 42 * 1024 * 1024;

/**
 * Independent runtime safety net, in addition to the worst-case PAGE_SIZE
 * constants above: measures the actual rendered size of a generated chunk
 * and logs loudly if it's approaching or has crossed Google's 50MB limit.
 * The PAGE_SIZE constants are sized to never realistically trigger this —
 * if it ever fires, something about the underlying data (e.g. an
 * unexpectedly long slug) has drifted outside the modeled worst case and
 * needs attention, so it's surfaced in server logs rather than failing
 * silently.
 */
export function checkSitemapSize(xml: string, label: string, urlCount: number): void {
  const bytes = new TextEncoder().encode(xml).length;
  if (bytes >= SITEMAP_MAX_BYTES) {
    console.error(`[sitemap] ${label} is ${(bytes / 1024 / 1024).toFixed(1)}MB with ${urlCount} URLs — OVER Google's 50MB limit, this file will likely be REJECTED. Reduce the relevant PAGE_SIZE constant in sitemap-utils.ts.`);
  } else if (bytes >= SITEMAP_WARN_BYTES) {
    console.warn(`[sitemap] ${label} is ${(bytes / 1024 / 1024).toFixed(1)}MB with ${urlCount} URLs — approaching Google's 50MB limit. Consider lowering the relevant PAGE_SIZE constant in sitemap-utils.ts.`);
  }
}

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
} as const;
