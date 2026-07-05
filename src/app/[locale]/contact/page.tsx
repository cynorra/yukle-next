import type { Metadata } from 'next';
import { ContactPageClient } from './ContactPageClient';
import { getLegalTranslation } from '@/utils/getLegalTranslation';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const data = getLegalTranslation(rawLocale);

  return {
    title: `${data.contact.title} | Loadly`,
    description: data.contact.description,
    alternates: {
      canonical: `${SITE_URL}/${rawLocale}/contact`,
    },
    openGraph: {
      title: `${data.contact.title} | Loadly`,
      description: data.contact.description,
      url: `${SITE_URL}/${rawLocale}/contact`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { locale: rawLocale } = await params;
  const data = getLegalTranslation(rawLocale);
  return <ContactPageClient data={data} locale={rawLocale} />;
}
