import type { Metadata } from 'next';
import { SitemapPageClient } from './SitemapPageClient';
import { createPublicClient } from '@/lib/supabase/public';

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

interface Props {
  params: Promise<{ locale: string }>;
}

const SUPPORTED = new Set(['en', 'tr']);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const canonicalLocale = SUPPORTED.has(rawLocale) ? rawLocale : 'en';
  const isTr = canonicalLocale === 'tr';
  return {
    title: isTr ? 'Site Haritası' : 'Sitemap',
    description: isTr ? "Loadly'nin her bölümü tek bir yerde." : 'Every section of Loadly, in one place.',
    alternates: {
      canonical: `${SITE_URL}/${canonicalLocale}/sitemap`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  // Every published article is listed here so the HTML sitemap gives crawlers
  // (and visitors) a direct link to each post, not just the /blog index.
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('slug, title')
    .eq('published', true)
    .eq('language', 'en')
    .order('created_at', { ascending: false })
    .limit(1000);
  if (error) console.error('[sitemap page] blog query failed:', error);
  return <SitemapPageClient locale={locale} posts={data || []} />;
}
