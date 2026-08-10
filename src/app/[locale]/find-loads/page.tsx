import type { Metadata } from 'next';
import { YukBulmaClient } from './YukBulmaClient';
import { TRANSLATIONS } from '@/utils/translations';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

interface Props {
  params: Promise<{ locale: string }>;
}

const TITLES: Record<string, string> = {
  tr: 'Yük Bulma: Güvenilir Nakliye Pazaryeri',
  en: 'Find Loads: Reliable Freight Marketplace',
  de: 'Frachten finden: Zuverlässiger Logistikmarktplatz',
  fr: 'Trouver des chargements: Marketplace logistique',
  es: 'Encontrar cargas: Mercado de transporte confiable',
  pt: 'Encontrar cargas: Marketplace de frete confiável',
  it: 'Trova carichi: Marketplace logistico affidabile',
  pl: 'Znajdź ładunki: Niezawodny rynek transportowy',
  ru: 'Найти грузы: Надежная биржа грузоперевозок',
  ar: 'البحث عن شحنات: سوق الشحن الموثوق',
};

const DESCS: Record<string, string> = {
  tr: 'En hızlı ve güvenilir yük bulma platformu. Rota bazlı eşleşme, doğrulanmış nakliyeciler ve kolay teklif süreciyle hemen yük bulun.',
  en: 'The fastest and most reliable load board. Route-based matching, verified carriers, and easy bidding process to find freight instantly.',
  de: 'Das schnellste Frachtbörse. Routenbasiertes Matching, verifizierte Spediteure, einfacher Angebotsprozess.',
  fr: 'La bourse de fret la plus rapide. Correspondance basée sur les routes, transporteurs vérifiés et processus d\'offre facile.',
  es: 'La bolsa de carga más rápida y confiable. Coincidencia basada en rutas, transportistas verificados y proceso de oferta fácil.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;

  const title = TITLES[rawLocale] ?? TITLES.en;
  const description = DESCS[rawLocale] ?? DESCS.en;

  const languagesAlternates: Record<string, string> = { 'x-default': `${SITE_URL}/en/find-loads` };
  (Object.keys(TRANSLATIONS) as string[]).forEach((loc) => {
    languagesAlternates[loc] = `${SITE_URL}/${loc}/find-loads`;
  });

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${rawLocale}/find-loads`,
      languages: languagesAlternates,
    },
    openGraph: {
      title: `${title} | Loadly`,
      description,
      url: `${SITE_URL}/${rawLocale}/find-loads`,
    },
  };
}

export default function YukBulmaPage() {
  return <YukBulmaClient />;
}
