import { createPublicClient } from '@/lib/supabase/public';
import {
  SITE_URL, escapeXml,
  URLSET_HEADER, SITEMAP_HEADERS,
} from '@/lib/sitemap-utils';

export const revalidate = 86400; // ISR: regenerate every 24 hours

interface Props {
  params: Promise<{ page: string }>;
}

export async function GET(request: Request, { params }: Props) {
  const { page: rawPage } = await params;
  const pageNum = Math.max(1, parseInt(rawPage, 10) || 1);
  const PAGE_SIZE = 10000;
  const startOffset = (pageNum - 1) * PAGE_SIZE;
  const endOffset = startOffset + PAGE_SIZE - 1;

  const supabase = createPublicClient();

  let allPosts: any[] = [];
  let from = startOffset;
  const step = 1000;

  while (from <= endOffset) {
    const to = Math.min(from + step - 1, endOffset);
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('slug, created_at, updated_at, language, cover_image')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error(`[sitemap-blogs-${pageNum}.xml] Supabase query failed:`, error);
      break;
    }

    if (posts && posts.length > 0) {
      allPosts = allPosts.concat(posts);
      if (posts.length < (to - from + 1)) break;
      from += step;
    } else {
      break;
    }
  }

  let xml = URLSET_HEADER;

  if (allPosts.length > 0) {
    // Group posts by base slug to find language siblings (siblings are
    // grouped within this page's window; a group split across two chunk
    // boundaries — rare, only near the 10,000-post edge — will list fewer
    // alternates for those specific posts, not an error).
    const groups: Record<string, typeof allPosts> = {};
    allPosts.forEach((post) => {
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
