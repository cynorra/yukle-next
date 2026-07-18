import type { Metadata } from 'next';
import { TermsPageClient } from './TermsPageClient';
import { getLegalTranslation, hasLegalTranslation } from '@/utils/getLegalTranslation';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const data = getLegalTranslation(rawLocale);
  // Locales with no real translation render English content, so their
  // canonical points at /en/terms instead of self-referencing — otherwise
  // Google indexes 40 locales' worth of identical English pages as if unique.
  const canonicalLocale = hasLegalTranslation(rawLocale) ? rawLocale : 'en';

  return {
    title: `${data.terms.title} | Loadly`,
    description: data.terms.description,
    alternates: {
      canonical: `${SITE_URL}/${canonicalLocale}/terms`,
    },
    openGraph: {
      title: `${data.terms.title} | Loadly`,
      description: data.terms.description,
      url: `${SITE_URL}/${canonicalLocale}/terms`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { locale: rawLocale } = await params;
  const data = getLegalTranslation(rawLocale);
  return <TermsPageClient data={data} />;
}
