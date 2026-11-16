import type { Metadata } from 'next';
import { AboutPageClient } from './AboutPageClient';
import { getLegalTranslation, hasLegalTranslation } from '@/utils/getLegalTranslation';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const data = getLegalTranslation(rawLocale);
  // Locales with no real translation render English content, so their
  // canonical points at /en/about instead of self-referencing — otherwise
  // Google indexes 40 locales' worth of identical English pages as if unique.
  const canonicalLocale = hasLegalTranslation(rawLocale) ? rawLocale : 'en';

  return {
    title: data.about.title,
    description: data.about.description,
    alternates: {
      canonical: `${SITE_URL}/${canonicalLocale}/about`,
    },
    openGraph: { locale: 'en_US', siteName: 'Loadly', images: [{ url: '/logo.png', width: 1200, height: 630, alt: 'Loadly' }],
      title: `${data.about.title} | Loadly`,
      description: data.about.description,
      url: `${SITE_URL}/${canonicalLocale}/about`,
    },
    twitter: { card: 'summary_large_image', title: `${data.about.title} | Loadly`, description: data.about.description, images: ['/logo.png'] },
  };
}

export default async function Page({ params }: Props) {
  const { locale: rawLocale } = await params;
  const data = getLegalTranslation(rawLocale);
  return <AboutPageClient data={data} locale={rawLocale} />;
}
