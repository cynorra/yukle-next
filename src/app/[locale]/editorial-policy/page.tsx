import type { Metadata } from 'next';
import { EditorialPolicyPageClient } from './EditorialPolicyPageClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

interface Props {
  params: Promise<{ locale: string }>;
}

const SUPPORTED = new Set(['en', 'tr']);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const canonicalLocale = SUPPORTED.has(rawLocale) ? rawLocale : 'en';
  const isTr = canonicalLocale === 'tr';
  const title = isTr ? 'Editoryal Politika' : 'Editorial Policy';
  const description = isTr
    ? 'Loadly blog içeriğini nasıl üretir, kontrol eder ve yayınlar.'
    : 'How Loadly chooses sources, writes and checks its guides, handles corrections and separates advertising from editorial content.';
  const url = `${SITE_URL}/${canonicalLocale}/editorial-policy`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: { title: `${title} | Loadly`, description, url },
    twitter: { card: 'summary_large_image', title: `${title} | Loadly`, description, images: ['/logo.png'] },
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return <EditorialPolicyPageClient locale={locale} />;
}
