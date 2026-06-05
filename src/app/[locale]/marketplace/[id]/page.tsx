import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createPublicClient } from '@/lib/supabase/public';
import { LoadDetailClient } from './LoadDetailClient';
import { TRANSLATIONS } from '@/utils/translations';
import type { Locale } from '@/utils/translations';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

const LOAD_TYPES: Record<string, string> = {
  general: 'General Cargo',
  hazardous: 'Hazardous Material',
  perishable: 'Perishable',
  oversized: 'Oversized',
  fragile: 'Fragile',
};

const TRUCK_TYPES: Record<string, string> = {
  tir: 'TIR',
  kamyon: 'Truck',
  kamyonet: 'Van',
  dorser: 'Trailer',
  tanker: 'Tanker',
  frigorifik: 'Reefer',
};

export const revalidate = 300;

async function getLoad(id: string) {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from('loads')
    .select(
      '*, shipper:public_profiles!loads_shipper_id_fkey(id, full_name, company_name, is_verified, rating, avatar_url)'
    )
    .eq('id', id)
    .maybeSingle();
  return data;
}

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id, locale: rawLocale } = await params;
  const locale: Locale = (rawLocale in TRANSLATIONS) ? (rawLocale as Locale) : 'en';
  
  const load = await getLoad(id);

  if (!load) {
    return {
      title: 'Load Not Found | Loadly',
      description: 'The requested shipping load was not found.',
      robots: { index: false, follow: false },
    };
  }

  const localizedTitle = load.title_translations?.[locale] || load.title;
  const localizedDescription = load.description_translations?.[locale] || load.description;

  const title = `${localizedTitle} | Loadly`;
  const description = localizedDescription
    ? (localizedDescription.length > 150 ? localizedDescription.slice(0, 150) + '...' : localizedDescription)
    : `Shipment of ${load.weight_ton} tons of cargo from ${load.origin_city} to ${load.destination_city}.`;

  const SUPPORTED_LOCALES = [
    'en', 'tr', 'es', 'pt', 'fr', 'de', 'it', 'pl',
    'nl', 'ru', 'uk', 'zh', 'ja', 'hi', 'ar', 'fa',
    'ko', 'vi', 'id', 'bn', 'ur', 'th', 'ms', 'tl',
    'ro', 'sv', 'cs', 'hu', 'el', 'az', 'kk', 'he',
    'bg', 'hr', 'sr', 'sk', 'da', 'fi', 'no', 'uz',
    'ta', 'mr', 'ka', 'lt', 'lv', 'et', 'sl'
  ];

  const languagesAlternates: Record<string, string> = {};
  SUPPORTED_LOCALES.forEach((loc) => {
    languagesAlternates[loc] = `${SITE_URL}/${loc}/marketplace/${id}`;
  });

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/marketplace/${id}`,
      languages: languagesAlternates,
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url: `${SITE_URL}/${locale}/marketplace/${id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots:
      load.status === 'completed' || load.status === 'cancelled'
        ? { index: false, follow: true }
        : { index: true, follow: true },
  };
}

export default async function LoadDetailPage({ params }: PageProps) {
  const { id, locale: rawLocale } = await params;
  const locale: Locale = (rawLocale in TRANSLATIONS) ? (rawLocale as Locale) : 'en';
  const t = TRANSLATIONS[locale];
  
  const load = await getLoad(id);

  if (!load) {
    notFound();
  }

  const localizedTitle = load.title_translations?.[locale] || load.title;
  const localizedDescription = load.description_translations?.[locale] || load.description;

  // JSON-LD Service schema
  const offerJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: localizedTitle,
    description:
      localizedDescription ||
      `${load.weight_ton} ton shipment from ${load.origin_city} to ${load.destination_city}`,
    provider: {
      '@type': 'Organization',
      name: load.shipper?.company_name || load.shipper?.full_name || 'Loadly User',
    },
    areaServed: [
      { '@type': 'City', name: load.origin_city },
      { '@type': 'City', name: load.destination_city },
    ],
    ...(load.price && {
      offers: {
        '@type': 'Offer',
        price: load.price,
        priceCurrency: locale === 'tr' ? 'TRY' : 'USD',
        availability: 'https://schema.org/InStock',
        url: `${SITE_URL}/${locale}/marketplace/${id}`,
      },
    }),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: t.nav.marketplace, item: `${SITE_URL}/${locale}/marketplace` },
      {
        '@type': 'ListItem',
        position: 3,
        name: localizedTitle,
        item: `${SITE_URL}/${locale}/marketplace/${id}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* SEO Breadcrumbs */}
      <header className="max-w-5xl mx-auto px-4 pt-8">
        <nav className="text-xs text-muted mb-4">
          <Link href={`/${locale}`} className="hover:text-accent">
            Home
          </Link>{' '}
          /{' '}
          <Link href={`/${locale}/marketplace`} className="hover:text-accent">
            {t.nav.marketplace}
          </Link>{' '}
          / <span className="truncate max-w-[200px] inline-block align-bottom">{localizedTitle}</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-black text-fg tracking-tight">
          {localizedTitle}
        </h1>
        <p className="mt-2 text-base text-muted">
          {load.origin_city}
          {load.origin_state ? ` (${load.origin_state})` : ''}, {load.origin_country} →{' '}
          {load.destination_city}
          {load.destination_state ? ` (${load.destination_state})` : ''}, {load.destination_country} ·{' '}
          {load.weight_ton} ton
          {load.required_truck_type ? ` · ${TRUCK_TYPES[load.required_truck_type] || load.required_truck_type}` : ''}
          {load.load_type ? ` · ${LOAD_TYPES[load.load_type] || load.load_type}` : ''}
        </p>
      </header>

      <LoadDetailClient load={load as any} />
    </>
  );
}
