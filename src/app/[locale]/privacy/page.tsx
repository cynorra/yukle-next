import type { Metadata } from 'next';
import { PrivacyPageClient } from './PrivacyPageClient';
import { getLegalTranslation } from '@/utils/getLegalTranslation';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const data = getLegalTranslation(rawLocale);

  return {
    title: `${data.privacy.title} | Loadly`,
    description: data.privacy.description,
    alternates: {
      canonical: `${SITE_URL}/${rawLocale}/privacy`,
    },
    openGraph: {
      title: `${data.privacy.title} | Loadly`,
      description: data.privacy.description,
      url: `${SITE_URL}/${rawLocale}/privacy`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { locale: rawLocale } = await params;
  const data = getLegalTranslation(rawLocale);
  return <PrivacyPageClient data={data} />;
}
