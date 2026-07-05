import type { Metadata } from 'next';
import { AboutPageClient } from './AboutPageClient';
import { getLegalTranslation } from '@/utils/getLegalTranslation';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const data = getLegalTranslation(rawLocale);

  return {
    title: `${data.about.title} | Loadly`,
    description: data.about.description,
    alternates: {
      canonical: `${SITE_URL}/${rawLocale}/about`,
    },
    openGraph: {
      title: `${data.about.title} | Loadly`,
      description: data.about.description,
      url: `${SITE_URL}/${rawLocale}/about`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { locale: rawLocale } = await params;
  const data = getLegalTranslation(rawLocale);
  return <AboutPageClient data={data} locale={rawLocale} />;
}
