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

      // Sadece ana dili (en) sitemap'e ekliyoruz. 
      // Diğer 46 dil zaten sayfanın <head> kısmındaki <link rel="alternate"> etiketleriyle Google'a bildiriliyor.
      // Bu sayede 1 sitemap dosyasına 1.000 yerine tam 50.000 ilan sığdırabiliyoruz!
      const url = `${SITE_URL}/en/marketplace/${load.id}`;
      xml += '  <url>\n';
      xml += `    <loc>${escapeXml(url)}</loc>\n`;
      xml += `    <lastmod>${lastMod}</lastmod>\n`;
      xml += '    <changefreq>daily</changefreq>\n';
      xml += '    <priority>0.7</priority>\n';
      xml += '  </url>\n';
    }
  }

  xml += '</urlset>\n';
  return new Response(xml, { headers: SITEMAP_HEADERS });
}
