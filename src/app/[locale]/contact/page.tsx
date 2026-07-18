import type { Metadata } from 'next';
import { ContactPageClient } from './ContactPageClient';
import { getLegalTranslation, hasLegalTranslation } from '@/utils/getLegalTranslation';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const data = getLegalTranslation(rawLocale);
  // Locales with no real translation render English content, so their
  // canonical points at /en/contact instead of self-referencing — otherwise
  // Google indexes 40 locales' worth of identical English pages as if unique.
  const canonicalLocale = hasLegalTranslation(rawLocale) ? rawLocale : 'en';

  return {
    title: `${data.contact.title} | Loadly`,
    description: data.contact.description,
    alternates: {
      canonical: `${SITE_URL}/${canonicalLocale}/contact`,
    },
    openGraph: {
      title: `${data.contact.title} | Loadly`,
      description: data.contact.description,
      url: `${SITE_URL}/${canonicalLocale}/contact`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { locale: rawLocale } = await params;
  const data = getLegalTranslation(rawLocale);
  return <ContactPageClient data={data} locale={rawLocale} />;
}
