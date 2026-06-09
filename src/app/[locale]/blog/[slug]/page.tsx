import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { createPublicClient } from '@/lib/supabase/public';
import { BlogDetailClient } from './BlogDetailClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

export const revalidate = 600;
export const dynamicParams = true;

async function getPost(slug: string) {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from('blog_posts')
    .select('*, author:profiles(full_name)')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();
  return data;
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
      title: locale === 'tr' ? 'Yazı Bulunamadı | Loadly' : 'Article Not Found | Loadly',
      robots: { index: false, follow: false },
    };
  }

  const title = post.meta_title || post.title;
  const description = post.meta_description || post.excerpt || post.title;

  const parts = slug.split('-');
  const baseSlug = parts.length > 1 ? parts.slice(0, -1).join('-') : slug;

  const supabase = createPublicClient();
  const { data: siblings } = await supabase
    .from('blog_posts')
    .select('slug, language')
    .eq('published', true)
    .ilike('slug', `${baseSlug}-%`);

  const languagesAlternates: Record<string, string> = {};
  if (siblings && siblings.length > 0) {
    siblings.forEach((sib) => {
      if (sib.language) {
        languagesAlternates[sib.language] = `${SITE_URL}/${sib.language}/blog/${sib.slug}`;
      }
    });
  } else {
    // Fallback if query returns empty
    const SUPPORTED_LOCALES = [
      'en', 'tr', 'es', 'pt', 'fr', 'de', 'it', 'pl',
      'nl', 'ru', 'uk', 'zh', 'ja', 'hi', 'ar', 'fa',
      'ko', 'vi', 'id', 'bn', 'ur', 'th', 'ms', 'tl',
      'ro', 'sv', 'cs', 'hu', 'el', 'az', 'kk', 'he',
      'bg', 'hr', 'sr', 'sk', 'da', 'fi', 'no', 'uz',
      'ta', 'mr', 'ka', 'lt', 'lv', 'et', 'sl'
    ];
    SUPPORTED_LOCALES.forEach((loc) => {
      languagesAlternates[loc] = `${SITE_URL}/${loc}/blog/${baseSlug}-${loc}`;
    });
  }

  // Set English or default as x-default
  const englishSlug = siblings?.find(s => s.language === 'en')?.slug || `${baseSlug}-en`;
  languagesAlternates['x-default'] = `${SITE_URL}/en/blog/${englishSlug}`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/blog/${slug}`,
      languages: languagesAlternates,
    },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `${SITE_URL}/${locale}/blog/${slug}`,
      images: post.cover_image ? [{ url: post.cover_image }] : undefined,
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
    },
    twitter: {
      card: 'summary_large_image',
      title,
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
    articleSection: 'Logistics',
    author: {
      '@type': 'Person',
      name: post.author?.full_name || 'YükLe Ekibi',
    },
    publisher: {
      '@type': 'Organization',
      name: 'YükLe',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/${locale}/blog/${slug}` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <BlogDetailClient post={post} locale={locale} slug={slug} />
    </>
  );
}
