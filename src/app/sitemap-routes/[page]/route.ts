import {
  SITE_URL, escapeXml,
  URLSET_HEADER, SITEMAP_HEADERS,
} from '@/lib/sitemap-utils';
import { getActiveLanes } from '@/lib/laneRoutes';

export const revalidate = 3600; // lanes shift as loads complete/get posted — refresh hourly

interface Props {
  params: Promise<{ page: string }>;
}

const PAGE_SIZE = 10000;

export async function GET(request: Request, { params }: Props) {
  const { page: rawPage } = await params;
  const pageNum = Math.max(1, parseInt(rawPage, 10) || 1);
  const startOffset = (pageNum - 1) * PAGE_SIZE;

  const lanes = Array.from((await getActiveLanes()).values());
  const pageLanes = lanes.slice(startOffset, startOffset + PAGE_SIZE);

  const now = new Date().toISOString().split('T')[0];

  let xml = URLSET_HEADER;

  for (const lane of pageLanes) {
    const url = `${SITE_URL}/en/shipping-routes/${lane.slug}`;
    xml += '  <url>\n';
    xml += `    <loc>${escapeXml(url)}</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += '    <changefreq>daily</changefreq>\n';
    xml += '    <priority>0.6</priority>\n';
    xml += '  </url>\n';
  }

  xml += '</urlset>\n';
  return new Response(xml, { headers: SITEMAP_HEADERS });
}
