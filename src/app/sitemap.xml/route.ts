import { createPublicClient } from '@/lib/supabase/public';
import { SITE_URL, SITEMAP_INDEX_HEADER, SITEMAP_HEADERS } from '@/lib/sitemap-utils';

export const revalidate = 86400;

/**
 * Sitemap Index — points crawlers to sub-sitemaps for efficient crawling.
 * Supports unlimited loads by dynamically chunking into sitemap-loads-1.xml, sitemap-loads-2.xml, etc.
 */
export async function GET() {
  const now = new Date().toISOString().split('T')[0];
  const supabase = createPublicClient();

  // Get total count of active loads to calculate needed sitemap chunks
  const { count } = await supabase
    .from('loads')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'active');

  const totalLoads = count || 0;
  const PAGE_SIZE = 40000;
  const loadPages = Math.max(1, Math.ceil(totalLoads / PAGE_SIZE));

  let xml = SITEMAP_INDEX_HEADER;

  // Static pages
  xml += '  <sitemap>\n';
  xml += `    <loc>${SITE_URL}/sitemap-static.xml</loc>\n`;
  xml += `    <lastmod>${now}</lastmod>\n`;
  xml += '  </sitemap>\n';

  // Blogs
  xml += '  <sitemap>\n';
  xml += `    <loc>${SITE_URL}/sitemap-blogs.xml</loc>\n`;
  xml += `    <lastmod>${now}</lastmod>\n`;
  xml += '  </sitemap>\n';

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

