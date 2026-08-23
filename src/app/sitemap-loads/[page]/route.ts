import { createPublicClient } from '@/lib/supabase/public';
import {
  SITE_URL, escapeXml,
  URLSET_HEADER, SITEMAP_HEADERS, LOADS_PAGE_SIZE, checkSitemapSize,
} from '@/lib/sitemap-utils';

export const revalidate = 3600; // ISR: regenerate hourly

interface Props {
  params: Promise<{ page: string }>;
}

export async function GET(request: Request, { params }: Props) {
  const { page: rawPage } = await params;
  const pageNum = Math.max(1, parseInt(rawPage, 10) || 1);
  const PAGE_SIZE = LOADS_PAGE_SIZE;
  const startOffset = (pageNum - 1) * PAGE_SIZE;
  const endOffset = startOffset + PAGE_SIZE - 1;

  const supabase = createPublicClient();

  let allLoads: any[] = [];
  let from = startOffset;
  const step = 1000;

  while (from <= endOffset) {
    const to = Math.min(from + step - 1, endOffset);
    const { data: loads, error } = await supabase
      .from('loads')
      .select('id, created_at, title, title_translations')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error(`[sitemap-loads-${pageNum}.xml] Supabase query failed:`, error);
      break;
    }

    if (loads && loads.length > 0) {
      allLoads = allLoads.concat(loads);
      if (loads.length < (to - from + 1)) break;
      from += step;
    } else {
      break;
    }
  }

  let xml = URLSET_HEADER;

  if (allLoads.length === 0) {
    xml += '  <url>\n';
    xml += `    <loc>${escapeXml(`${SITE_URL}/en/marketplace`)}</loc>\n`;
    xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
    xml += '    <changefreq>daily</changefreq>\n';
    xml += '    <priority>0.5</priority>\n';
    xml += '  </url>\n';
  }

  for (const load of allLoads) {
    const lastMod = load.created_at
      ? new Date(load.created_at).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];

    const url = `${SITE_URL}/en/marketplace/${load.id}`;
    xml += '  <url>\n';
    xml += `    <loc>${escapeXml(url)}</loc>\n`;
    xml += `    <lastmod>${lastMod}</lastmod>\n`;
    xml += '    <changefreq>daily</changefreq>\n';
    xml += '    <priority>0.7</priority>\n';

    // Add xhtml:link alternates for all translated languages of this load
    if (load.title_translations && typeof load.title_translations === 'object') {
      for (const [loc, trTitle] of Object.entries(load.title_translations)) {
        if (trTitle && trTitle !== load.title) {
          const locUrl = `${SITE_URL}/${loc}/marketplace/${load.id}`;
          xml += `    <xhtml:link rel="alternate" hreflang="${loc}" href="${escapeXml(locUrl)}"/>\n`;
        }
      }
    }
    xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(url)}"/>\n`;
    xml += '  </url>\n';
  }

  xml += '</urlset>\n';
  checkSitemapSize(xml, `sitemap-loads-${pageNum}.xml`, allLoads.length);
  return new Response(xml, { headers: SITEMAP_HEADERS });
}
