import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createPublicClient } from '@/lib/supabase/public';
import { LoadDetailClient } from './LoadDetailClient';
import { TRANSLATIONS } from '@/utils/translations';
import type { Locale } from '@/utils/translations';
import { buildLaneSlug, buildCitySlug, buildCountrySlug, buildTruckTypeSlug, buildLoadTypeSlug, normalizeCountryName } from '@/lib/laneRoutes';

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

export const revalidate = 86400;

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
      title: 'Load Not Found',
      description: 'The requested shipping load was not found.',
      robots: { index: false, follow: false },
    };
  }

  const localizedTitle = load.title_translations?.[locale] || load.title;
  const localizedDescription = load.description_translations?.[locale] || load.description;

  const title = localizedTitle;
  const brandedTitle = `${localizedTitle} | Loadly`;
  const description = localizedDescription
    ? (localizedDescription.length > 150 ? localizedDescription.slice(0, 150) + '...' : localizedDescription)
    : `Shipment of ${load.weight_ton} tons of cargo from ${load.origin_city} to ${load.destination_city}.`;

  // Load data (route, company, price) is the same record regardless of
  // locale, and title/description translations are rarely populated in
  // practice — self-canonicalizing all 47 locales turns every listing into
  // up to 47 near-duplicate indexable URLs. Canonicalize to /en (same fix
  // already applied to the shipping-routes hub pages) unless this specific
  // load actually has a real translated title for the locale.
  const hasRealTranslation = Boolean(load.title_translations?.[locale]) && locale !== 'en';
  const canonicalLocale = hasRealTranslation ? locale : 'en';
  const languagesAlternates: Record<string, string> = {
    en: `${SITE_URL}/en/marketplace/${id}`,
  };
  if (hasRealTranslation) {
    languagesAlternates[locale] = `${SITE_URL}/${locale}/marketplace/${id}`;
  }
  languagesAlternates['x-default'] = `${SITE_URL}/en/marketplace/${id}`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${canonicalLocale}/marketplace/${id}`,
      languages: languagesAlternates,
    },
    openGraph: {
      type: 'website',
      title: brandedTitle,
      description,
      url: `${SITE_URL}/${locale}/marketplace/${id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: brandedTitle,
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

  // Internal links to the durable hub pages this load belongs to — the only
  // on-site path into those hubs besides the sitemap/IndexNow, so crawlers
  // and users reach them from the page most likely to already be indexed.
  const relatedRoutes: { href: string; label: string }[] = [];
  if (load.origin_city && load.origin_country) {
    relatedRoutes.push({
      href: `/${locale}/shipping-routes/from/${buildCitySlug(load.origin_city, load.origin_country)}`,
      label: locale === 'tr' ? `${load.origin_city} Çıkışlı Diğer İlanlar` : `More Loads From ${load.origin_city}`,
    });
    relatedRoutes.push({
      href: `/${locale}/shipping-routes/country/${buildCountrySlug(load.origin_country)}`,
      label: locale === 'tr'
        ? `${normalizeCountryName(load.origin_country)} Çıkışlı Diğer İlanlar`
        : `More Loads From ${normalizeCountryName(load.origin_country)}`,
    });
  }
  if (load.destination_city && load.destination_country) {
    relatedRoutes.push({
      href: `/${locale}/shipping-routes/to/${buildCitySlug(load.destination_city, load.destination_country)}`,
      label: locale === 'tr' ? `${load.destination_city} Varışlı Diğer İlanlar` : `More Loads To ${load.destination_city}`,
    });
    relatedRoutes.push({
      href: `/${locale}/shipping-routes/to-country/${buildCountrySlug(load.destination_country)}`,
      label: locale === 'tr'
        ? `${normalizeCountryName(load.destination_country)} Varışlı Diğer İlanlar`
        : `More Loads To ${normalizeCountryName(load.destination_country)}`,
    });
  }
  if (load.origin_city && load.origin_country && load.destination_city && load.destination_country) {
    relatedRoutes.push({
      href: `/${locale}/shipping-routes/${buildLaneSlug(load.origin_city, load.origin_country, load.destination_city, load.destination_country)}`,
      label: locale === 'tr' ? 'Bu Rotadaki Tüm İlanlar' : 'All Loads On This Route',
    });
  }
  if (load.required_truck_type) {
    const label = TRUCK_TYPES[load.required_truck_type] || load.required_truck_type;
    relatedRoutes.push({
      href: `/${locale}/shipping-routes/truck-type/${buildTruckTypeSlug(load.required_truck_type)}`,
      label: locale === 'tr' ? `Diğer ${label} İlanları` : `More ${label} Loads`,
    });
  }
  if (load.load_type) {
    const label = LOAD_TYPES[load.load_type] || load.load_type;
    relatedRoutes.push({
      href: `/${locale}/shipping-routes/cargo-type/${buildLoadTypeSlug(load.load_type)}`,
      label: locale === 'tr' ? `Diğer ${label} İlanları` : `More ${label} Loads`,
    });
  }

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

        <h1 className="text-3xl sm:text-4xl font-medium text-fg tracking-tight">
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

      {relatedRoutes.length > 0 && (
        <nav aria-label={locale === 'tr' ? 'İlgili rotalar' : 'Related routes'} className="max-w-5xl mx-auto px-4 mt-6 flex flex-wrap gap-2">
          {relatedRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-muted hover:text-accent hover:border-accent/40 transition-colors"
            >
              {route.label}
            </Link>
          ))}
        </nav>
      )}

      <LoadDetailClient load={load as any} />
    </>
  );
}
