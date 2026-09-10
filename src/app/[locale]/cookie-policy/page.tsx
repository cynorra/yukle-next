import type { Metadata } from 'next';
import { CookiePolicyPageClient } from './CookiePolicyPageClient';
import { getLegalTranslation, hasLegalTranslation } from '@/utils/getLegalTranslation';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const data = getLegalTranslation(rawLocale);
  // Locales with no real translation render English content, so their
  // canonical points at /en/cookie-policy instead of self-referencing —
  // otherwise Google indexes dozens of locales' worth of identical English
  // pages as if unique (see privacy/page.tsx for the same pattern).
  const canonicalLocale = hasLegalTranslation(rawLocale) ? rawLocale : 'en';

  return {
    title: data.cookiePolicy.title,
    description: data.cookiePolicy.description,
    alternates: {
      canonical: `${SITE_URL}/${canonicalLocale}/cookie-policy`,
    },
    openGraph: {
      title: `${data.cookiePolicy.title} | Loadly`,
      description: data.cookiePolicy.description,
      url: `${SITE_URL}/${canonicalLocale}/cookie-policy`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { locale: rawLocale } = await params;
  const data = getLegalTranslation(rawLocale);
  return <CookiePolicyPageClient data={data} />;
}
