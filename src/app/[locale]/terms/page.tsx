import type { Metadata } from 'next';
import { TermsPageClient } from './TermsPageClient';
import { getLegalTranslation } from '@/utils/getLegalTranslation';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const data = getLegalTranslation(rawLocale);

  return {
    title: `${data.terms.title} | Loadly`,
    description: data.terms.description,
    alternates: {
      canonical: `${SITE_URL}/${rawLocale}/terms`,
    },
    openGraph: {
      title: `${data.terms.title} | Loadly`,
      description: data.terms.description,
      url: `${SITE_URL}/${rawLocale}/terms`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { locale: rawLocale } = await params;
  const data = getLegalTranslation(rawLocale);
  return <TermsPageClient data={data} />;
}
