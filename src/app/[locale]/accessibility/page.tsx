import type { Metadata } from 'next';
import { AccessibilityPageClient } from './AccessibilityPageClient';

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
    title: isTr ? 'Erişilebilirlik Beyanı' : 'Accessibility Statement',
    description: isTr
      ? "Loadly'yi herkes için kullanılabilir kılma yaklaşımımız."
      : 'Our approach to making Loadly usable for everyone.',
    alternates: {
      canonical: `${SITE_URL}/${canonicalLocale}/accessibility`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return <AccessibilityPageClient locale={locale} />;
}
