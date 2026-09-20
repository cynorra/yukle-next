import type { Metadata } from 'next';
import { cache } from 'react';
import { notFound, redirect } from 'next/navigation';
import { createPublicClient } from '@/lib/supabase/public';
import { BlogDetailClient } from './BlogDetailClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

// Extract FAQ Q&A pairs from HTML content for FAQPage schema
function extractFaqSchema(html: string) {
  if (!html) return null;

  const faqSectionMatch = html.match(
    /<h2[^>]*>[^<]*(?:Frequently Asked|FAQ)[^<]*<\/h2>([\s\S]*?)(?=<h2|$)/i
  );
  if (!faqSectionMatch) return null;

  const faqSection = faqSectionMatch[1];
  const pairs: Array<{ question: string; answer: string }> = [];

  const pairRegex = /<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/gi;
  let match;
  while ((match = pairRegex.exec(faqSection)) !== null) {
    const question = match[1].replace(/<[^>]+>/g, '').trim();
    const answer = match[2].replace(/<[^>]+>/g, '').trim();
    if (question && answer) pairs.push({ question, answer });
  }

  if (pairs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pairs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
}

export const revalidate = 3600;

// cache() dedupes this within a single request — generateMetadata and the
// page body both need the post, and without this they'd each pay their own
// DB round-trip on every render.
const getPost = cache(async (slug: string) => {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from('blog_posts')
    .select('*, author:profiles(full_name)')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();
  return data;
});

// Internal-linking backstop (universal-adsense-site-standard.md 3.8): every
// article - old or new - renders this. Prefers posts sharing this post's
// topic_cluster (e.g. two "Load Board Tactics" articles) so "related" means
// actually related, not just recent — a topic-tagged pool tends to be small,
// so the pick is seeded off the current slug for a stable-but-varied order
// per article rather than always showing the same top few. Tops up with the
// old recency pool (also seeded/shuffled) whenever the cluster alone can't
// fill `count`, so untagged or thin clusters never render an empty section.
function seededShuffle<T>(arr: T[], seedKey: string): T[] {
  let seed = 0;
  for (let i = 0; i < seedKey.length; i++) seed = (seed * 31 + seedKey.charCodeAt(i)) >>> 0;
  const pool = [...arr];
  for (let i = pool.length - 1; i > 0; i--) {
    seed = (seed * 1103515245 + 12345) >>> 0;
    const j = seed % (i + 1);
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool;
}

async function getRelatedPosts(language: string, excludeSlug: string, topicCluster: string | null, count = 4) {
  const supabase = createPublicClient();
  const seenSlugs = new Set<string>([excludeSlug]);
  const related: Array<{ slug: string; title: string; excerpt: string; cover_image: string | null }> = [];

  if (topicCluster) {
    const { data: clusterData } = await supabase
      .from('blog_posts')
      .select('slug, title, excerpt, cover_image')
      .eq('language', language)
      .eq('published', true)
      .eq('topic_cluster', topicCluster)
      .neq('slug', excludeSlug)
      .order('created_at', { ascending: false })
      .limit(20);
    if (clusterData && clusterData.length > 0) {
      for (const p of seededShuffle(clusterData, excludeSlug)) {
        if (seenSlugs.has(p.slug)) continue;
        seenSlugs.add(p.slug);
        related.push(p);
      }
    }
  }

  if (related.length < count) {
    const { data } = await supabase
      .from('blog_posts')
      .select('slug, title, excerpt, cover_image')
      .eq('language', language)
      .eq('published', true)
      .neq('slug', excludeSlug)
      .order('created_at', { ascending: false })
      .limit(40);
    if (data && data.length > 0) {
      for (const p of seededShuffle(data, excludeSlug)) {
        if (related.length >= count) break;
        if (seenSlugs.has(p.slug)) continue;
        seenSlugs.add(p.slug);
        related.push(p);
      }
    }
  }

  return related.slice(0, count);
}

export async function generateStaticParams() {
  // Build sırasında sayfa üretme; sayfalar ilk ziyarette ISR ile oluşturulur
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: locale === 'tr' ? 'Yazı Bulunamadı' : 'Article Not Found',
      robots: { index: false, follow: false },
    };
  }

  // Most stored meta_titles already end in "| Loadly" and the layout title template
  // appends the brand again, so strip it here or every <title>/OG title reads "… | Loadly | Loadly".
  const title = (post.meta_title || post.title).replace(/\s*\|\s*Loadly\s*$/i, '').trim();
  const brandedTitle = `${title} | Loadly`;
  const description = post.meta_description || post.excerpt || post.title;

  // English-only site (2026-09-19): translated siblings 301 to the English post
  // (middleware.ts), so there are no hreflang alternates to advertise — and no
  // sibling lookup to pay for on every render.
  const languagesAlternates: Record<string, string> = {
    en: `${SITE_URL}/en/blog/${slug}`,
    'x-default': `${SITE_URL}/en/blog/${slug}`,
  };

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/blog/${slug}`,
      languages: languagesAlternates,
    },
    openGraph: {
      type: 'article',
      title: brandedTitle,
      description,
      url: `${SITE_URL}/${locale}/blog/${slug}`,
      images: post.cover_image ? [{ url: post.cover_image }] : undefined,
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
    },
    twitter: {
      card: 'summary_large_image',
      title: brandedTitle,
      description,
      images: post.cover_image ? [post.cover_image] : undefined,
    },
  };
}

export default async function BlogSlugPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  // Dil uyuşmazlığı varsa doğru locale yönlendir
  if (post.language && post.language !== locale) {
    redirect(`/${post.language}/blog/${slug}`);
  }

  const wordCount = post.content ? post.content.trim().split(/\s+/).length : 0;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    inLanguage: locale,
    description: post.excerpt || post.meta_description,
    image: post.cover_image,
    datePublished: post.created_at,
    dateModified: post.updated_at || post.created_at,
    wordCount,
    articleSection: 'Logistics & Freight',
    keywords: post.meta_title
      ? post.meta_title.replace(/\s*\|\s*Loadly\s*$/i, '').trim()
      : post.title,
    url: `${SITE_URL}/${locale}/blog/${slug}`,
    author: {
      '@type': 'Person',
      name: post.author?.full_name || 'Eren Şimşir',
      jobTitle: 'Chief Technical Editor',
      url: `${SITE_URL}/${locale}/author/eren-simsir`,
      sameAs: ['https://www.linkedin.com/in/ernsmsr/'],
    },
    publisher: {
      '@type': 'Organization',
      name: 'Loadly',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/${locale}/blog/${slug}` },
  };

  // universal-adsense-site-standard.md 3.12.2: BreadcrumbList should mirror
  // the real, visible navigation trail (Home > Blog > this post) - the
  // "Back to Blog" link + the post title are that trail on this page.
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/${locale}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE_URL}/${locale}/blog/${slug}` },
    ],
  };

  const faqSchema = extractFaqSchema(post.content || '');
  const relatedPosts = await getRelatedPosts(post.language || locale, slug, post.topic_cluster || null);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <BlogDetailClient post={post} locale={locale} slug={slug} relatedPosts={relatedPosts} />
    </>
  );
}
