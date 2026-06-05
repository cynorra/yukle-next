import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { createPublicClient } from '@/lib/supabase/public';
import { BlogDetailClient } from './BlogDetailClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

export const revalidate = 600;

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
  // Build sırasında bilinen tüm slug'ları üret (ISR ile sonradan da yeni gelenleri yakalar)
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('published', true);
    return (data || []).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
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

  const SUPPORTED_LOCALES = [
    'en', 'tr', 'es', 'pt', 'fr', 'de', 'it', 'pl',
    'nl', 'ru', 'uk', 'zh', 'ja', 'hi', 'ar', 'fa',
    'ko', 'vi', 'id', 'bn', 'ur', 'th', 'ms', 'tl',
    'ro', 'sv', 'cs', 'hu', 'el', 'az', 'kk', 'he',
    'bg', 'hr', 'sr', 'sk', 'da', 'fi', 'no', 'uz',
    'ta', 'mr', 'ka', 'lt', 'lv', 'et', 'sl'
  ];

  const parts = slug.split('-');
  const baseSlug = parts.length > 1 ? parts.slice(0, -1).join('-') : slug;

  const languagesAlternates: Record<string, string> = {};
  SUPPORTED_LOCALES.forEach((loc) => {
    languagesAlternates[loc] = `${SITE_URL}/${loc}/blog/${baseSlug}-${loc}`;
  });

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

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.meta_description,
    image: post.cover_image,
    datePublished: post.created_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Person',
      name: post.author?.full_name || 'YükLe Ekibi',
    },
    publisher: {
      '@type': 'Organization',
      name: 'YükLe',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${slug}` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <BlogDetailClient />
    </>
  );
}
