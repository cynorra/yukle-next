import {
  SITE_URL, ALL_LOCALES, escapeXml, generateAlternates,
  URLSET_HEADER, SITEMAP_HEADERS,
} from '@/lib/sitemap-utils';

export const revalidate = 86400; // ISR: regenerate every 24 hours

export async function GET() {
  let xml = URLSET_HEADER;

  const staticPaths = getAllStaticPaths();

  for (const routePath of staticPaths) {
    for (const locale of ALL_LOCALES) {
      const url = `${SITE_URL}/${locale}${routePath}`;
      xml += '  <url>\n';
      xml += `    <loc>${escapeXml(url)}</loc>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += `    <priority>${routePath === '' ? '1.0' : routePath === '/marketplace' ? '0.9' : routePath === '/blog' ? '0.85' : '0.8'}</priority>\n`;
      xml += generateAlternates((loc) => `${SITE_URL}/${loc}${routePath}`);
      xml += '  </url>\n';
    }
  }

  xml += '</urlset>\n';

  return new Response(xml, { headers: SITEMAP_HEADERS });
}

/** Return a hardcoded list of public static routes for reliable generation in Vercel */
function getAllStaticPaths(): string[] {
  // src/ directory is not available at runtime on Vercel, so fs.readdirSync fails.
  // We explicitly list the public static pages here.
  return [
    '', // Homepage
    '/about',
    '/contact',
    '/advertise',
    '/blog',
    '/marketplace',
    '/find-loads',
    '/privacy-policy',
    '/terms'
  ];
}
