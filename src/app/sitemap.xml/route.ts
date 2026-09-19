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
 *
 * <lastmod> on each blog chunk is the newest real updated_at/created_at among
 * that chunk's posts (same ordering the chunk route uses). It used to be
 * "today" for every entry on every render, which Google learns to ignore.
 * The static sitemap entry carries no <lastmod> at all: it is a hardcoded
 * page list with no per-page modification date to report honestly.
 */
export async function GET() {
  const supabase = createPublicClient();

  const { count: blogsCount } = await supabase
    .from('blog_posts').select('id', { count: 'exact', head: true }).eq('published', true).eq('language', 'en');

  const blogPages = Math.max(1, Math.ceil((blogsCount || 0) / BLOGS_PAGE_SIZE));

  const chunkLastmods: (string | null)[] = await Promise.all(
    Array.from({ length: blogPages }, async (_, i) => {
      const start = i * BLOGS_PAGE_SIZE;
      const { data } = await supabase
        .from('blog_posts')
        .select('created_at, updated_at')
        .eq('published', true)
        .eq('language', 'en')
        .order('created_at', { ascending: false })
        .order('id', { ascending: true })
        .range(start, start + BLOGS_PAGE_SIZE - 1);

      let newest = 0;
      for (const row of data || []) {
        const t = Date.parse(row.updated_at || row.created_at);
        if (!Number.isNaN(t) && t > newest) newest = t;
      }
      return newest > 0 ? new Date(newest).toISOString().split('T')[0] : null;
    })
  );

  let xml = SITEMAP_INDEX_HEADER;

  // Static pages
  xml += '  <sitemap>\n';
  xml += `    <loc>${SITE_URL}/sitemap-static.xml</loc>\n`;
  xml += '  </sitemap>\n';

  // Chunked blogs (sitemap-blogs-1.xml, sitemap-blogs-2.xml, etc.)
  for (let i = 1; i <= blogPages; i++) {
    xml += '  <sitemap>\n';
    xml += `    <loc>${SITE_URL}/sitemap-blogs-${i}.xml</loc>\n`;
    const lastmod = chunkLastmods[i - 1];
    if (lastmod) xml += `    <lastmod>${lastmod}</lastmod>\n`;
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
