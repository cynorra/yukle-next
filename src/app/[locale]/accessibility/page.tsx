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
  const title = isTr ? 'Erişilebilirlik Beyanı' : 'Accessibility Statement';
  const description = isTr
    ? "Loadly'yi herkes için kullanılabilir kılma yaklaşımımız."
    : 'How Loadly works to make its guides and calculators usable for everyone, what is supported today, and how to report an accessibility problem.';
  const url = `${SITE_URL}/${canonicalLocale}/accessibility`;
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
  return <AccessibilityPageClient locale={locale} />;
}
