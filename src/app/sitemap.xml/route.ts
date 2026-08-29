import { createPublicClient } from '@/lib/supabase/public';
import { SITE_URL, SITEMAP_INDEX_HEADER, SITEMAP_HEADERS, LOADS_PAGE_SIZE, BLOGS_PAGE_SIZE, checkSitemapSize } from '@/lib/sitemap-utils';

export const revalidate = 3600;

/**
 * Sitemap Index — points crawlers to sub-sitemaps for efficient crawling.
 * Supports unlimited loads and blogs by dynamically chunking into
 * sitemap-loads-1.xml, sitemap-loads-2.xml, sitemap-blogs-1.xml, etc.
 */
export async function GET() {
  const now = new Date().toISOString().split('T')[0];
  const supabase = createPublicClient();

  // Get total counts to calculate needed sitemap chunks. loads count must
  // match the indexability condition in marketplace/[id]/page.tsx and
  // sitemap-loads/[page]/route.ts (active + has a real price) — otherwise
  // this under/over-counts chunk pages relative to what that route serves.
  const [{ count: loadsCount }, { count: blogsCount }] = await Promise.all([
    supabase.from('loads').select('id', { count: 'exact', head: true }).eq('status', 'active').not('price', 'is', null),
    supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('published', true),
  ]);

  const loadPages = Math.max(1, Math.ceil((loadsCount || 0) / LOADS_PAGE_SIZE));
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

  // Chunked loads (sitemap-loads-1.xml, sitemap-loads-2.xml, etc.)
  for (let i = 1; i <= loadPages; i++) {
    xml += '  <sitemap>\n';
    xml += `    <loc>${SITE_URL}/sitemap-loads-${i}.xml</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += '  </sitemap>\n';
  }

  xml += '</sitemapindex>\n';
  // The index itself only lists <sitemap> refs (not <url> entries), so it
  // stays tiny even with hundreds of chunks — this check is here purely for
  // consistency with the other sitemap routes, not because it's expected to
  // ever fire.
  checkSitemapSize(xml, 'sitemap.xml', loadPages + blogPages + 1);

  return new Response(xml, { headers: SITEMAP_HEADERS });
}

