import type { Metadata } from 'next';
import { DeleteAccountPageClient } from './DeleteAccountPageClient';
import { getLegalTranslation, hasLegalTranslation } from '@/utils/getLegalTranslation';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const data = getLegalTranslation(rawLocale);
  // Locales with no real translation render English content, so their
  // canonical points at /en/delete-account instead of self-referencing —
  // same reasoning as /privacy (see PrivacyPageClient's canonicalLocale).
  const canonicalLocale = hasLegalTranslation(rawLocale) ? rawLocale : 'en';

  return {
    title: data.accountDeletion.title,
    description: data.accountDeletion.description,
    alternates: {
      canonical: `${SITE_URL}/${canonicalLocale}/delete-account`,
    },
    openGraph: {
      title: `${data.accountDeletion.title} | Loadly`,
      description: data.accountDeletion.description,
      url: `${SITE_URL}/${canonicalLocale}/delete-account`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { locale: rawLocale } = await params;
  const data = getLegalTranslation(rawLocale);
  return <DeleteAccountPageClient data={data} />;
}
