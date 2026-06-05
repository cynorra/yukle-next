import type { Metadata } from 'next';
import Link from 'next/link';
import { createPublicClient } from '@/lib/supabase/public';
import { BookOpen, ArrowRight } from 'lucide-react';
import { BlogListClient } from './BlogListClient';
import { BLOG_TRANSLATIONS } from '@/utils/blogTranslations';
import type { Locale } from '@/utils/translations';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

export const revalidate = 600; // 10 minutes

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale in BLOG_TRANSLATIONS) ? (rawLocale as Locale) : 'en';
  const t = BLOG_TRANSLATIONS[locale];

  const SUPPORTED_LOCALES = [
    'en', 'tr', 'es', 'pt', 'fr', 'de', 'it', 'pl',
    'nl', 'ru', 'uk', 'zh', 'ja', 'hi', 'ar', 'fa'
  ];

  const languagesAlternates: Record<string, string> = {};
  SUPPORTED_LOCALES.forEach((loc) => {
    languagesAlternates[loc] = `${SITE_URL}/${loc}/blog`;
  });

  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/blog`,
      languages: languagesAlternates,
    },
    openGraph: {
      title: t.title,
      description: t.description,
      url: `${SITE_URL}/${locale}/blog`,
    },
  };
}

export default async function BlogListPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale in BLOG_TRANSLATIONS) ? (rawLocale as Locale) : 'en';
  const t = BLOG_TRANSLATIONS[locale];

  const supabase = createPublicClient();
  
  // Try to fetch articles in user's current locale
  let { data: posts } = await supabase
    .from('blog_posts')
    .select('*, author:profiles(full_name)')
    .eq('published', true)
    .eq('language', locale)
    .order('created_at', { ascending: false });

  // Fallback: If no articles found in user's locale, show English articles instead of a blank page
  if ((!posts || posts.length === 0) && locale !== 'en') {
    const { data: fallbackPosts } = await supabase
      .from('blog_posts')
      .select('*, author:profiles(full_name)')
      .eq('published', true)
      .eq('language', 'en')
      .order('created_at', { ascending: false });
    if (fallbackPosts) posts = fallbackPosts;
  }

  const allPosts = posts || [];

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: t.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-bold text-sm mb-6">
              <BookOpen size={18} />
              {t.tagline}
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-fg mb-6 leading-tight">
              {t.header1} <span className="text-accent">{t.headerAccent}</span> {t.header2}
            </h1>
            <p className="text-lg text-muted max-w-3xl mx-auto leading-relaxed">
              {t.introText}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {t.guides.map((guide, i) => (
              <Link
                key={i}
                href={`/${locale}/blog/${guide.slug}`}
                className="px-6 py-3 rounded-xl bg-surface-light dark:bg-surface-dark border border-accent/20 text-sm font-bold flex items-center gap-2 hover:bg-accent hover:text-white transition-all"
              >
                {guide.label} <ArrowRight size={14} />
              </Link>
            ))}
          </div>

          {/* Search + grid client */}
          <BlogListClient posts={allPosts as any} />

          <div className="mt-24 pt-16 border-t border-border-light dark:border-border-dark">
            <h2 className="text-3xl font-black text-fg mb-12 text-center">
              {t.faqTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {t.faqs.map((faq, i) => (
                <div
                  key={i}
                  className="p-8 rounded-3xl bg-surface-light dark:bg-surface-dark border border-accent/20"
                >
                  <h3 className="text-xl font-bold text-accent mb-4">{faq.q}</h3>
                  <p className="text-muted">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
