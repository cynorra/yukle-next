import {
  SITE_URL, escapeXml, generateAlternates,
  URLSET_HEADER, SITEMAP_HEADERS,
} from '@/lib/sitemap-utils';
import { getAllRouteHubs } from '@/lib/laneRoutes';

export const revalidate = 3600; // lanes shift as loads complete/get posted — refresh hourly

interface Props {
  params: Promise<{ page: string }>;
}

const PAGE_SIZE = 10000;

export async function GET(request: Request, { params }: Props) {
  const { page: rawPage } = await params;
  const pageNum = Math.max(1, parseInt(rawPage, 10) || 1);
  const startOffset = (pageNum - 1) * PAGE_SIZE;

  const { lanes, cities, countries, destinationCities, destinationCountries, truckTypes, loadTypes } = await getAllRouteHubs();

  // Combined so the index's page-count math and this route's slicing agree
  // on one total — order doesn't matter, just needs to be stable within a
  // single ISR revalidation window.
  const allPaths = [
    ...Array.from(lanes.values()).map((lane) => `/shipping-routes/${lane.slug}`),
    ...Array.from(cities.values()).map((hub) => `/shipping-routes/from/${hub.slug}`),
    ...Array.from(countries.values()).map((hub) => `/shipping-routes/country/${hub.slug}`),
    ...Array.from(destinationCities.values()).map((hub) => `/shipping-routes/to/${hub.slug}`),
    ...Array.from(destinationCountries.values()).map((hub) => `/shipping-routes/to-country/${hub.slug}`),
    ...Array.from(truckTypes.values()).map((hub) => `/shipping-routes/truck-type/${hub.slug}`),
    ...Array.from(loadTypes.values()).map((hub) => `/shipping-routes/cargo-type/${hub.slug}`),
  ];
  const pagePaths = allPaths.slice(startOffset, startOffset + PAGE_SIZE);

  const now = new Date().toISOString().split('T')[0];

  let xml = URLSET_HEADER;

  for (const path of pagePaths) {
    const url = `${SITE_URL}/en${path}`;
    xml += '  <url>\n';
    xml += `    <loc>${escapeXml(url)}</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += '    <changefreq>daily</changefreq>\n';
    xml += '    <priority>0.8</priority>\n';
    xml += generateAlternates((loc) => `${SITE_URL}/${loc}${path}`);
    xml += '  </url>\n';
  }

  xml += '</urlset>\n';
  return new Response(xml, { headers: SITEMAP_HEADERS });
}
