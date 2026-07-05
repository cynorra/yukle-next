import type { Metadata } from 'next';
import { AdPageClient } from './AdPageClient';
import { TRANSLATIONS } from '@/utils/translations';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;

  const titles: Record<string, string> = {
    tr: 'Loadly\'de Reklam Verin | Lojistik Sektörüne Ulaşın',
    en: 'Advertise on Loadly | Reach the Logistics Industry',
    de: 'Auf Loadly Werben | Logistikbranche erreichen',
    fr: 'Annoncez sur Loadly | Atteignez le secteur logistique',
    es: 'Anúnciate en Loadly | Llega al sector logístico',
  };

  const descs: Record<string, string> = {
    tr: 'Loadly\'de reklam verin. Türkiye ve dünya genelinde lojistik ve nakliye sektörü profesyonellerine ulaşın.',
    en: 'Advertise on Loadly and reach thousands of logistics and freight professionals worldwide.',
    de: 'Werben Sie auf Loadly und erreichen Sie Tausende von Logistikfachleuten weltweit.',
    fr: 'Annoncez sur Loadly et atteignez des milliers de professionnels de la logistique dans le monde entier.',
    es: 'Anúnciate en Loadly y llega a miles de profesionales de logística en todo el mundo.',
  };

  const title = titles[rawLocale] ?? titles.en;
  const description = descs[rawLocale] ?? descs.en;

  const languagesAlternates: Record<string, string> = { 'x-default': `${SITE_URL}/en/advertise` };
  (Object.keys(TRANSLATIONS) as string[]).forEach((loc) => {
    languagesAlternates[loc] = `${SITE_URL}/${loc}/advertise`;
  });

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${rawLocale}/advertise`,
      languages: languagesAlternates,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${rawLocale}/advertise`,
    },
  };
}

export default function Page() {
  return <AdPageClient />;
}
