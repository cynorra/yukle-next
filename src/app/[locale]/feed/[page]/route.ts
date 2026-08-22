import { createPublicClient } from '@/lib/supabase/public';
import { escapeXml, SITE_URL } from '@/lib/sitemap-utils';
import { BLOG_TRANSLATIONS } from '@/utils/blogTranslations';
import type { Locale } from '@/utils/translations';

export const revalidate = 3600; // ISR: regenerate hourly

const PAGE_SIZE = 100;
const FEED_COLUMNS = 'title, slug, excerpt, content, cover_image, created_at, updated_at, author:profiles(full_name)';

interface RouteParams {
  params: Promise<{ locale: string; page: string }>;
}

// Strip characters that are invalid in XML 1.0 (control chars other than tab/newline/CR)
function stripControlChars(value: string): string {
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
}

// Prepare raw HTML for a CDATA block: strip control chars and neutralize "]]>" so it can't break out early
function sanitizeForCdata(value: string): string {
  return stripControlChars(value).replace(/]]>/g, ']]]]><![CDATA[>');
}

// Blog content stores internal links as root-relative paths ("/marketplace"),
// which resolve fine on-site but are ambiguous/broken once read out of
// context in a feed reader (RFC 3987 / feed validators flag these) — rewrite
// href/src to absolute URLs before embedding in content:encoded.
function absolutizeInternalLinks(html: string): string {
  return html.replace(/((?:href|src)=["'])\/(?!\/)/g, `$1${SITE_URL}/`);
}

function imageMimeType(url: string): string {
  const ext = url.split('?')[0].split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'png': return 'image/png';
    case 'webp': return 'image/webp';
    case 'gif': return 'image/gif';
    case 'svg': return 'image/svg+xml';
    default: return 'image/jpeg';
  }
}

async function fetchFeedPage(locale: string, from: number, to: number) {
  const supabase = createPublicClient();
  const { data, count, error } = await supabase
    .from('blog_posts')
    .select(FEED_COLUMNS, { count: 'exact' })
    .eq('published', true)
    .eq('language', locale)
    .order('created_at', { ascending: false })
    .range(from, to) as { data: any[] | null; count: number | null; error: any };

  if (error) console.error(`[feed] Supabase error (${locale}):`, error);
  return { posts: data || [], count: count || 0 };
}

export async function GET(_req: Request, { params }: RouteParams) {
  const { locale: rawLocale, page: rawPage } = await params;
  const locale = (rawLocale in BLOG_TRANSLATIONS) ? (rawLocale as Locale) : 'en';
  const t = BLOG_TRANSLATIONS[locale];

  const pageNum = Math.max(1, parseInt(rawPage, 10) || 1);
  const from = (pageNum - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { posts, count } = await fetchFeedPage(locale, from, to);
  const totalPages = count ? Math.max(1, Math.ceil(count / PAGE_SIZE)) : pageNum;

  const items = posts.map((post: any) => {
    const url = `${SITE_URL}/${locale}/blog/${post.slug}`;
    const pubDate = new Date(post.created_at).toUTCString();
    const title = stripControlChars(post.title || '');
    const description = stripControlChars(post.excerpt || '');
    const content = post.content
      ? absolutizeInternalLinks(stripControlChars(post.content))
      : description;
    const authorName = stripControlChars(post.author?.full_name || 'Eren Şimşir');
    // length="0": true byte size isn't known without an extra fetch per image per
    // request; 0 is the widely-tolerated placeholder RSS consumers accept when the
    // producer doesn't have it on hand, and satisfies the enclosure spec's required attribute.
    // media:content/media:thumbnail cover the same image for readers (Google, feedly)
    // that prefer MediaRSS over the plain enclosure tag.
    const enclosure = post.cover_image
      ? `\n      <enclosure url="${escapeXml(post.cover_image)}" length="0" type="${imageMimeType(post.cover_image)}"/>` +
        `\n      <media:content url="${escapeXml(post.cover_image)}" medium="image" type="${imageMimeType(post.cover_image)}"/>` +
        `\n      <media:thumbnail url="${escapeXml(post.cover_image)}"/>`
      : '';

    return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(description)}</description>
      <content:encoded><![CDATA[${sanitizeForCdata(content)}]]></content:encoded>
      <dc:creator>${escapeXml(authorName)}</dc:creator>${enclosure}
    </item>`;
  }).join('\n');

  const lastBuildDate = posts[0]
    ? new Date(posts[0].created_at).toUTCString()
    : new Date().toUTCString();

  const selfUrl = `${SITE_URL}/${locale}/feed-${pageNum}.xml`;
  const nextLink = pageNum < totalPages
    ? `\n    <atom:link href="${SITE_URL}/${locale}/feed-${pageNum + 1}.xml" rel="next" type="application/rss+xml"/>`
    : '';
  const prevLink = pageNum > 1
    ? `\n    <atom:link href="${SITE_URL}/${locale}/feed-${pageNum - 1}.xml" rel="prev" type="application/rss+xml"/>`
    : '';

  const channelTitle = `${escapeXml(t.title)} (Page ${pageNum} of ${totalPages})`;
  const channelLink = `${SITE_URL}/${locale}/blog`;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${channelTitle}</title>
    <link>${channelLink}</link>
    <atom:link href="${selfUrl}" rel="self" type="application/rss+xml"/>${nextLink}${prevLink}
    <description>${escapeXml(t.description)}</description>
    <language>${locale}</language>
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
