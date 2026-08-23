import type { Metadata } from 'next';
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

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

async function getSimilarLoads(currentId: string, originCountry: string, destCountry: string) {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from('loads')
      .select('id, title, origin_city, destination_city, weight_ton, price, required_truck_type, created_at')
      .eq('status', 'active')
      .neq('id', currentId)
      .or(`origin_country.eq.${originCountry},destination_country.eq.${destCountry}`)
      .limit(4);
    return data || [];
  } catch {
    return [];
  }
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
  const brandedTitle = `${localizedTitle} | Loadly Freight Network`;
  const description = localizedDescription
    ? (localizedDescription.length > 150 ? localizedDescription.slice(0, 150) + '...' : localizedDescription)
    : `Shipment of ${load.weight_ton} tons of cargo from ${load.origin_city}, ${load.origin_country} to ${load.destination_city}, ${load.destination_country}.`;

  const translatedTitle = load.title_translations?.[locale];
  const hasRealTranslation = Boolean(translatedTitle) && translatedTitle !== load.title && locale !== 'en';
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
      images: [
        {
          url: `${SITE_URL}/${locale}/marketplace/${id}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: brandedTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: brandedTitle,
      description,
      images: [`${SITE_URL}/${locale}/marketplace/${id}/opengraph-image`],
    },
    // Individual load listings are overwhelmingly scraper-imported (verified
    // 2026-08-23: 14,022/14,022 active loads belong to one scraper shipper
    // account, only 1 has a real price) — near-identical templated content
    // at massive scale, which is exactly what Google's "scaled content
    // abuse" / thin-content policies target and was the root cause of an
    // AdSense "low value content" rejection. Rather than indexing all of
    // them, only index a listing once it has a real price AND is still
    // active — the one concrete signal that separates a genuine commercial
    // posting from a bulk-imported placeholder. `follow: true` always, so
    // link equity still flows to the shipping-routes hub pages via this
    // page's internal links even when the page itself isn't indexed. This
    // is a standing rule, not a one-time filter: as real user-posted loads
    // with real prices start appearing, they start getting indexed
    // automatically with no further code changes.
    robots: {
      index: load.status === 'active' && Boolean(load.price),
      follow: true,
    },
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

  const similarLoads = await getSimilarLoads(id, load.origin_country || '', load.destination_country || '');

  const localizedTitle = load.title_translations?.[locale] || load.title;
  const localizedDescription = load.description_translations?.[locale] || load.description;

  const truckLabel = load.required_truck_type ? (TRUCK_TYPES[load.required_truck_type] || load.required_truck_type) : 'Standard Truck';
  const categoryLabel = load.load_type ? (LOAD_TYPES[load.load_type] || load.load_type) : 'General Freight';

  const isTr = locale === 'tr';

  // Rich Auto-Generated Content Paragraphs for E-E-A-T and Search Depth
  const autoSeoSummary = isTr
    ? `${load.origin_city} (${load.origin_country}) kalkışlı, ${load.destination_city} (${load.destination_country}) varışlı bu nakliye ilanında toplam ${load.weight_ton} ton ağırlığında ${categoryLabel} taşınacaktır. İlan için belirlenen standart araç gereksinimi ${truckLabel} tipindedir.`
    : `This freight load listing specifies a shipment of ${load.weight_ton} tons of ${categoryLabel} from ${load.origin_city}, ${load.origin_country} to ${load.destination_city}, ${load.destination_country}. The recommended vehicle configuration is a ${truckLabel}.`;

  const autoSeoCorridor = isTr
    ? `${load.origin_country} ile ${load.destination_country} arasındaki lojistik koridoru karayolu yük taşımacılığında kritik bir yere sahiptir. Yük sahipleri ve sürücüler taşıma anlaşmalarını güvenli sözleşmeler ve doğrulanmış profiller üzerinden gerçekleştirir.`
    : `The freight corridor connecting ${load.origin_country} and ${load.destination_country} represents a high-traffic commercial route. Licensed carriers and verified shippers interact directly on Loadly for transparent pricing and rapid freight dispatch.`;

  const autoSeoCustomsGuide = isTr
    ? `Uluslararası ve şehirlerarası taşımalarda CMR karayolu taşıma belgesi, ağırlık tartım fişleri ve sevk irsaliyesi belgelerinin hazır tutulması tavsiye edilir. Tehlikeli madde (ADR) veya soğuk zincir (Frigo) gerektiren yüklerde araç belgesi zorunludur.`
    : `For cross-border and regional heavy transport, carriers must ensure CMR consignment notes, weighbridge documentation, and appropriate vehicle permits are active. Special cargo classes (e.g. ADR or Reefer) require compliant certification.`;

  // JSON-LD Service & Product schema
  const offerJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: localizedTitle,
    description: localizedDescription || autoSeoSummary,
    provider: {
      '@type': 'Organization',
      name: load.shipper?.company_name || load.shipper?.full_name || 'Loadly Verified Shipper',
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

  // Schema.org FAQPage for Rich Search Snippets
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: isTr ? `${load.origin_city} - ${load.destination_city} ilanına nasıl teklif verilir?` : `How do I place an offer for this load from ${load.origin_city} to ${load.destination_city}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: isTr ? `Loadly hesabınızla giriş yaparak yük sahibine doğrudan navlun teklifi verebilir ve mesaj gönderebilirsiniz.` : `You can create a free account on Loadly to submit direct rate offers to the shipper.`,
        },
      },
      {
        '@type': 'Question',
        name: isTr ? `Bu nakliye için gerekli araç ve evraklar nelerdir?` : `What vehicle and documents are required for this shipment?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: isTr ? `Bu ilan ${load.weight_ton} ton ağırlığında olup ${truckLabel} tipi araç gerektirmektedir. Taşıma belgesi (CMR/İrsaliye) zorunludur.` : `This load weighs ${load.weight_ton} tons and requires a ${truckLabel} with valid CMR consignment papers.`,
        },
      },
      {
        '@type': 'Question',
        name: isTr ? `Yük sahibi doğrulanmış üye midir?` : `Is the shipper verified on Loadly?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: isTr ? `Loadly üzerindeki kurumsal ve bireysel yük sahipleri kimlik/firma doğrulamasından geçmektedir.` : `Shippers on Loadly go through identity and business verification for secure trading.`,
        },
      },
    ],
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
    relatedRoutes.push({
      href: `/${locale}/shipping-routes/truck-type/${buildTruckTypeSlug(load.required_truck_type)}`,
      label: locale === 'tr' ? `Diğer ${truckLabel} İlanları` : `More ${truckLabel} Loads`,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <LoadDetailClient
        load={load as any}
        seoSummary={autoSeoSummary}
        seoCorridor={autoSeoCorridor}
        seoCustoms={autoSeoCustomsGuide}
        truckLabel={truckLabel}
        categoryLabel={categoryLabel}
        similarLoads={similarLoads}
        relatedRoutes={relatedRoutes}
      />
    </>
  );
}
