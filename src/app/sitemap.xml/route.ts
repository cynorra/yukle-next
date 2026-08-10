import { createPublicClient } from '@/lib/supabase/public';
import { SITE_URL, SITEMAP_INDEX_HEADER, SITEMAP_HEADERS } from '@/lib/sitemap-utils';

export const revalidate = 86400;

/**
 * Sitemap Index — points crawlers to sub-sitemaps for efficient crawling.
 * Supports unlimited loads and blogs by dynamically chunking into
 * sitemap-loads-1.xml, sitemap-loads-2.xml, sitemap-blogs-1.xml, etc.
 */
export async function GET() {
  const now = new Date().toISOString().split('T')[0];
  const supabase = createPublicClient();
  const PAGE_SIZE = 40000;

  // Get total counts to calculate needed sitemap chunks
  const [{ count: loadsCount }, { count: blogsCount }] = await Promise.all([
    supabase.from('loads').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('published', true),
  ]);

  const loadPages = Math.max(1, Math.ceil((loadsCount || 0) / PAGE_SIZE));
  const blogPages = Math.max(1, Math.ceil((blogsCount || 0) / PAGE_SIZE));

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

  return new Response(xml, { headers: SITEMAP_HEADERS });
}

