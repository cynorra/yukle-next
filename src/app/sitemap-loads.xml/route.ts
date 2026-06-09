import { createPublicClient } from '@/lib/supabase/public';
import {
  SITE_URL, ALL_LOCALES, escapeXml, generateAlternates,
  URLSET_HEADER, SITEMAP_HEADERS,
} from '@/lib/sitemap-utils';

export const revalidate = 1800; // ISR: regenerate every 30 minutes

export async function GET() {
  const supabase = createPublicClient();

  const { data: loads } = await supabase
    .from('loads')
    .select('id, created_at, updated_at')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  let xml = URLSET_HEADER;

  if (loads) {
    for (const load of loads) {
      const lastMod = (load.updated_at || load.created_at)
        ? new Date(load.updated_at || load.created_at).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

      for (const locale of ALL_LOCALES) {
        const url = `${SITE_URL}/${locale}/marketplace/${load.id}`;
        xml += '  <url>\n';
        xml += `    <loc>${escapeXml(url)}</loc>\n`;
        xml += `    <lastmod>${lastMod}</lastmod>\n`;
        xml += '    <changefreq>daily</changefreq>\n';
        xml += '    <priority>0.7</priority>\n';
        xml += generateAlternates((loc) => `${SITE_URL}/${loc}/marketplace/${load.id}`);
        xml += '  </url>\n';
      }
    }
  }

  xml += '</urlset>\n';
  return new Response(xml, { headers: SITEMAP_HEADERS });
}
