import { createPublicClient } from '@/lib/supabase/public';
import {
  SITE_URL, ALL_LOCALES, escapeXml, generateAlternates,
  URLSET_HEADER, SITEMAP_HEADERS,
} from '@/lib/sitemap-utils';

export const revalidate = 86400; // ISR: regenerate every 24 hours

export async function GET() {
  const supabase = createPublicClient();

  let allLoads: any[] = [];
  let from = 0;
  const step = 1000;

  while (true) {
    const { data: loads, error } = await supabase
      .from('loads')
      .select('id, created_at')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .range(from, from + step - 1);

    if (error) {
      console.error('[sitemap-loads.xml] Supabase query failed:', error);
      break;
    }

    if (loads && loads.length > 0) {
      allLoads = allLoads.concat(loads);
      if (loads.length < step || allLoads.length >= 45000) break;
      from += step;
    } else {
      break;
    }
  }

  let xml = URLSET_HEADER;

  if (allLoads.length > 0) {
    for (const load of allLoads) {
      const lastMod = load.created_at
        ? new Date(load.created_at).toISOString().split('T')[0]
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
