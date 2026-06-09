import { SITE_URL, SITEMAP_INDEX_HEADER, SITEMAP_HEADERS } from '@/lib/sitemap-utils';

export const revalidate = 3600;

/**
 * Sitemap Index — points crawlers to sub-sitemaps for efficient crawling.
 * - sitemap-static.xml  → static pages × 47 locales
 * - sitemap-loads.xml   → active freight listings × 47 locales
 * - sitemap-blogs.xml   → blog posts grouped by language
 */
export async function GET() {
  const now = new Date().toISOString().split('T')[0];

  let xml = SITEMAP_INDEX_HEADER;

  const sitemaps = [
    { loc: `${SITE_URL}/sitemap-static.xml`, lastmod: now },
    { loc: `${SITE_URL}/sitemap-loads.xml`, lastmod: now },
    { loc: `${SITE_URL}/sitemap-blogs.xml`, lastmod: now },
  ];

  for (const sm of sitemaps) {
    xml += '  <sitemap>\n';
    xml += `    <loc>${sm.loc}</loc>\n`;
    xml += `    <lastmod>${sm.lastmod}</lastmod>\n`;
    xml += '  </sitemap>\n';
  }

  xml += '</sitemapindex>\n';

  return new Response(xml, { headers: SITEMAP_HEADERS });
}
