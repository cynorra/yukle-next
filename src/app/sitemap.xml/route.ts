import { createPublicClient } from '@/lib/supabase/public';
import { SITE_URL, escapeXml, URLSET_HEADER, SITEMAP_HEADERS } from '@/lib/sitemap-utils';

export const revalidate = 3600;

// Public, indexable static pages. Keep in sync with real routes; no marketplace/account pages.
const STATIC_PATHS: Array<{ path: string; priority: string }> = [
  { path: '', priority: '1.0' },
  { path: '/blog', priority: '0.9' },
  { path: '/tools', priority: '0.8' },
  { path: '/tools/dimensional-weight-calculator', priority: '0.7' },
  { path: '/tools/ltl-density-calculator', priority: '0.7' },
  { path: '/tools/bridge-formula-calculator', priority: '0.7' },
  { path: '/tools/rate-per-mile-calculator', priority: '0.7' },
  { path: '/tools/fuel-cost-calculator', priority: '0.7' },
  { path: '/tools/detention-fee-calculator', priority: '0.7' },
  { path: '/about', priority: '0.6' },
  { path: '/contact', priority: '0.6' },
  { path: '/editorial-policy', priority: '0.6' },
  { path: '/author/eren-simsir', priority: '0.5' },
  { path: '/privacy', priority: '0.4' },
  { path: '/terms', priority: '0.4' },
  { path: '/cookie-policy', priority: '0.4' },
  { path: '/accessibility', priority: '0.4' },
];

/**
 * Single sitemap (no index, no sub-sitemaps): static pages + every published English guide,
 * with the real updated_at/created_at date as <lastmod>. Static pages carry no <lastmod>
 * because there is no honest per-page modification date for them.
 */
export async function GET() {
  const supabase = createPublicClient();
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('slug, created_at, updated_at')
    .eq('published', true)
    .eq('language', 'en')
    .order('created_at', { ascending: false })
    .limit(1000);
  // Never cache a sitemap that silently lost every guide because the DB hiccupped.
  if (error) throw new Error(`[sitemap.xml] Supabase error: ${error.message || error.code}`);

  let xml = URLSET_HEADER;
  for (const { path, priority } of STATIC_PATHS) {
    xml += `  <url>\n    <loc>${escapeXml(`${SITE_URL}/en${path}`)}</loc>\n    <priority>${priority}</priority>\n  </url>\n`;
  }
  for (const p of posts || []) {
    const d = p.updated_at || p.created_at;
    xml += `  <url>\n    <loc>${escapeXml(`${SITE_URL}/en/blog/${p.slug}`)}</loc>\n`;
    if (d) xml += `    <lastmod>${new Date(d).toISOString().split('T')[0]}</lastmod>\n`;
    xml += '    <priority>0.6</priority>\n  </url>\n';
  }
  xml += '</urlset>\n';
  return new Response(xml, { headers: SITEMAP_HEADERS });
}
