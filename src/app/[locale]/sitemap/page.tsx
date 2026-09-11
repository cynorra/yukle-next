import type { Metadata } from 'next';
import { SitemapPageClient } from './SitemapPageClient';

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
  return <SitemapPageClient locale={locale} />;
}
