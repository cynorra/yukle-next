import { createPublicClient } from '@/lib/supabase/public';
import { SITE_URL, escapeXml } from '@/lib/sitemap-utils';

export const revalidate = 3600; // ISR: regenerate hourly

const PAGE_SIZE = 1000;

const LOAD_TYPE_LABELS: Record<string, string> = {
  general: 'General Cargo',
  hazardous: 'Hazardous Material',
  perishable: 'Perishable',
  oversized: 'Oversized',
  fragile: 'Fragile',
};

const TRUCK_TYPE_LABELS: Record<string, string> = {
  tir: 'TIR',
  kamyon: 'Truck',
  kamyonet: 'Van',
  dorser: 'Trailer',
  tanker: 'Tanker',
  frigorifik: 'Reefer',
};

const LOAD_COLUMNS =
  'id, title, description, price, load_type, required_truck_type, weight_ton, created_at, ' +
  'origin_city, origin_state, origin_country, destination_city, destination_state, destination_country, ' +
  'shipper:public_profiles!loads_shipper_id_fkey(full_name, company_name)';

interface Props {
  params: Promise<{ page: string }>;
}

// Strip characters that are invalid in XML 1.0 (control chars other than tab/newline/CR)
function stripControlChars(value: string): string {
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
}

export async function GET(_req: Request, { params }: Props) {
  const { page: rawPage } = await params;
  const pageNum = Math.max(1, parseInt(rawPage, 10) || 1);
  const from = (pageNum - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = createPublicClient();
  const { data: loads, count, error } = await supabase
    .from('loads')
    .select(LOAD_COLUMNS, { count: 'exact' })
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .range(from, to) as { data: any[] | null; count: number | null; error: any };

  if (error) console.error(`[loads-feed-${pageNum}.xml] Supabase error:`, error);

  const totalPages = count ? Math.max(1, Math.ceil(count / PAGE_SIZE)) : pageNum;

  const items = (loads || []).map((load: any) => {
    const url = `${SITE_URL}/en/marketplace/${load.id}`;
    const pubDate = new Date(load.created_at).toUTCString();
    const title = stripControlChars(
      load.title || `${load.origin_city} → ${load.destination_city}`
    );
    const truckLabel = load.required_truck_type
      ? TRUCK_TYPE_LABELS[load.required_truck_type] || load.required_truck_type
      : '';
    const loadTypeLabel = load.load_type
      ? LOAD_TYPE_LABELS[load.load_type] || load.load_type
      : '';
    const route = `${load.origin_city}, ${load.origin_country} → ${load.destination_city}, ${load.destination_country}`;
    const descParts = [
      route,
      load.weight_ton ? `${load.weight_ton} ton` : '',
      truckLabel,
      loadTypeLabel,
      load.price ? `$${load.price}` : '',
    ].filter(Boolean);
    const description = stripControlChars(load.description || descParts.join(' · '));
    const companyName = stripControlChars(
      load.shipper?.company_name || load.shipper?.full_name || 'Loadly Shipper'
    );

    return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(description)}</description>
      <dc:creator>${escapeXml(companyName)}</dc:creator>${loadTypeLabel ? `\n      <category>${escapeXml(loadTypeLabel)}</category>` : ''}
    </item>`;
  }).join('\n');

  const lastBuildDate = loads?.[0]
    ? new Date(loads[0].created_at).toUTCString()
    : new Date().toUTCString();

  const selfUrl = `${SITE_URL}/loads-feed-${pageNum}.xml`;
  const nextLink = pageNum < totalPages
    ? `\n    <atom:link href="${SITE_URL}/loads-feed-${pageNum + 1}.xml" rel="next" type="application/rss+xml"/>`
    : '';
  const prevLink = pageNum > 1
    ? `\n    <atom:link href="${SITE_URL}/loads-feed-${pageNum - 1}.xml" rel="prev" type="application/rss+xml"/>`
    : '';

  const channelTitle = `Loadly – Live Freight &amp; Load Postings (Page ${pageNum} of ${totalPages})`;
  const channelLink = `${SITE_URL}/en/marketplace`;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${channelTitle}</title>
    <link>${channelLink}</link>
    <atom:link href="${selfUrl}" rel="self" type="application/rss+xml"/>${nextLink}${prevLink}
    <description>Live freight and cargo shipment postings on the Loadly marketplace.</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <image>
      <url>${SITE_URL}/logo.png</url>
      <title>${channelTitle}</title>
      <link>${channelLink}</link>
    </image>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=600',
    },
  });
}
