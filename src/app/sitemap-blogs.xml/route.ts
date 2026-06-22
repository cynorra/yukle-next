import { createPublicClient } from '@/lib/supabase/public';
import {
  SITE_URL, escapeXml,
  URLSET_HEADER, SITEMAP_HEADERS,
} from '@/lib/sitemap-utils';

export const revalidate = 86400; // ISR: regenerate every 24 hours

export async function GET() {
  const supabase = createPublicClient();

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, created_at, updated_at, language, cover_image')
    .eq('published', true)
    .order('created_at', { ascending: false });

  let xml = URLSET_HEADER;

  if (posts && posts.length > 0) {
    // Group posts by base slug to find language siblings
    const groups: Record<string, typeof posts> = {};
    posts.forEach((post) => {
      const parts = post.slug.split('-');
      const baseSlug = parts.length > 1 ? parts.slice(0, -1).join('-') : post.slug;
      if (!groups[baseSlug]) {
        groups[baseSlug] = [];
      }
      groups[baseSlug].push(post);
    });

    for (const baseSlug in groups) {
      const groupPosts = groups[baseSlug];

      for (const post of groupPosts) {
        const locale = post.language || 'en';
        const url = `${SITE_URL}/${locale}/blog/${post.slug}`;
        const lastMod = (post.updated_at || post.created_at)
          ? new Date(post.updated_at || post.created_at).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0];

        xml += '  <url>\n';
        xml += `    <loc>${escapeXml(url)}</loc>\n`;
        xml += `    <lastmod>${lastMod}</lastmod>\n`;
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += '    <priority>0.6</priority>\n';

        // Cover image
        if (post.cover_image) {
          xml += `    <image:image><image:loc>${escapeXml(post.cover_image)}</image:loc></image:image>\n`;
        }

        // Alternates to existing siblings only
        groupPosts.forEach((sibling) => {
          const sibLocale = sibling.language || 'en';
          const sibUrl = `${SITE_URL}/${sibLocale}/blog/${sibling.slug}`;
          xml += `    <xhtml:link rel="alternate" hreflang="${sibLocale}" href="${escapeXml(sibUrl)}"/>\n`;
        });

        // x-default
        const englishPost = groupPosts.find((p) => p.language === 'en') || groupPosts[0];
        const defaultUrl = `${SITE_URL}/en/blog/${englishPost.slug}`;
        xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(defaultUrl)}"/>\n`;

        xml += '  </url>\n';
      }
    }
  }

  xml += '</urlset>\n';
  return new Response(xml, { headers: SITEMAP_HEADERS });
}
