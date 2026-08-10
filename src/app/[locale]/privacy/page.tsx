import type { Metadata } from 'next';
import { PrivacyPageClient } from './PrivacyPageClient';
import { getLegalTranslation, hasLegalTranslation } from '@/utils/getLegalTranslation';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const data = getLegalTranslation(rawLocale);
  // Locales with no real translation render English content, so their
  // canonical points at /en/privacy instead of self-referencing — otherwise
  // Google indexes 40 locales' worth of identical English pages as if unique.
  const canonicalLocale = hasLegalTranslation(rawLocale) ? rawLocale : 'en';

  return {
    title: data.privacy.title,
    description: data.privacy.description,
    alternates: {
      canonical: `${SITE_URL}/${canonicalLocale}/privacy`,
    },
    openGraph: {
      title: `${data.privacy.title} | Loadly`,
      description: data.privacy.description,
      url: `${SITE_URL}/${canonicalLocale}/privacy`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { locale: rawLocale } = await params;
  const data = getLegalTranslation(rawLocale);
  return <PrivacyPageClient data={data} />;
}
