import { createPublicClient } from '@/lib/supabase/public';
import { SITE_URL, SITEMAP_INDEX_HEADER, SITEMAP_HEADERS } from '@/lib/sitemap-utils';
import { getActiveLanes } from '@/lib/laneRoutes';

export const revalidate = 86400;

/**
 * Sitemap Index — points crawlers to sub-sitemaps for efficient crawling.
 * Supports unlimited loads and blogs by dynamically chunking into
 * sitemap-loads-1.xml, sitemap-loads-2.xml, sitemap-blogs-1.xml, etc.
 */
export async function GET() {
  const now = new Date().toISOString().split('T')[0];
  const supabase = createPublicClient();
  const PAGE_SIZE = 10000;

  // Get total counts to calculate needed sitemap chunks
  const [{ count: loadsCount }, { count: blogsCount }, lanes] = await Promise.all([
    supabase.from('loads').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('published', true),
    getActiveLanes(),
  ]);

  const loadPages = Math.max(1, Math.ceil((loadsCount || 0) / PAGE_SIZE));
  const blogPages = Math.max(1, Math.ceil((blogsCount || 0) / PAGE_SIZE));
  const routePages = lanes.size > 0 ? Math.ceil(lanes.size / PAGE_SIZE) : 0;

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

  // Chunked lane/route hub pages (sitemap-routes-1.xml, etc.) — omitted entirely
  // when there are currently no active lanes, rather than submitting an empty sitemap.
  for (let i = 1; i <= routePages; i++) {
    xml += '  <sitemap>\n';
    xml += `    <loc>${SITE_URL}/sitemap-routes-${i}.xml</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += '  </sitemap>\n';
  }

  xml += '</sitemapindex>\n';

  return new Response(xml, { headers: SITEMAP_HEADERS });
}

