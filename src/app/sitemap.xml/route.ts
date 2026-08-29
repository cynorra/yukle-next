import { createPublicClient } from '@/lib/supabase/public';
import { SITE_URL, SITEMAP_INDEX_HEADER, SITEMAP_HEADERS, BLOGS_PAGE_SIZE, checkSitemapSize } from '@/lib/sitemap-utils';

export const revalidate = 3600;

/**
 * Sitemap Index — points crawlers to sub-sitemaps for efficient crawling.
 * Supports unlimited blogs by dynamically chunking into sitemap-blogs-1.xml,
 * sitemap-blogs-2.xml, etc. Marketplace listings are deliberately excluded
 * (2026-08-29): the marketplace stays live for existing accounts but is no
 * longer part of the site's public/indexed surface, so submitting its (all
 * noindex'd) URLs here would just be the exact "noindexed URLs in a sitemap"
 * red flag Search Console warns about.
 */
export async function GET() {
  const now = new Date().toISOString().split('T')[0];
  const supabase = createPublicClient();

  const { count: blogsCount } = await supabase
    .from('blog_posts').select('id', { count: 'exact', head: true }).eq('published', true);

  const blogPages = Math.max(1, Math.ceil((blogsCount || 0) / BLOGS_PAGE_SIZE));

  let xml = SITEMAP_INDEX_HEADER;

  // Static pages
  xml += '  <sitemap>\n';
  xml += `    <loc>${SITE_URL}/sitemap-static.xml</loc>\n`;
  xml += `    <lastmod>${now}</lastmod>\n`;
  xml += '  </sitemap>\n';

  // Chunked blogs (sitemap-blogs-1.xml, sitemap-blogs-2.xml, etc.)
  for (let i = 1; i <= blogPages; i++) {
    xml += '  <sitemap>\n';
    xml += `    <loc>${SITE_URL}/sitemap-blogs-${i}.xml</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += '  </sitemap>\n';
  }

  xml += '</sitemapindex>\n';
  // The index itself only lists <sitemap> refs (not <url> entries), so it
  // stays tiny even with hundreds of chunks — this check is here purely for
  // consistency with the other sitemap routes, not because it's expected to
  // ever fire.
  checkSitemapSize(xml, 'sitemap.xml', blogPages + 1);

  return new Response(xml, { headers: SITEMAP_HEADERS });
}

