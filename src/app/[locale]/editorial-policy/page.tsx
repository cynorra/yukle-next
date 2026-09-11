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
  return {
    title: isTr ? 'Editoryal Politika' : 'Editorial Policy',
    description: isTr
      ? 'Loadly blog içeriğini nasıl üretir, kontrol eder ve yayınlar.'
      : 'How Loadly produces, checks, and publishes its blog content.',
    alternates: {
      canonical: `${SITE_URL}/${canonicalLocale}/editorial-policy`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return <EditorialPolicyPageClient locale={locale} />;
}
