import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Weight, Package } from 'lucide-react';
import { getCountryHub, normalizeCountryName } from '@/lib/laneRoutes';
import { TRANSLATIONS } from '@/utils/translations';
import type { Locale } from '@/utils/translations';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

const LABELS: Record<string, {
  title: (c: string) => string;
  desc: (c: string) => string;
  intro: (c: string) => string;
  activeLoads: string;
  noLoads: string;
  postCta: string;
  browseCta: string;
}> = {
  tr: {
    title: (c) => `${c} Çıkışlı Yük İlanları ve Nakliye Fırsatları`,
    desc: (c) => `${c} çıkışlı aktif yük ilanlarını görüntüleyin. Bu ülkeden yük taşıyan nakliyecilerle doğrudan iletişime geçin.`,
    intro: (c) => `${c} çıkışlı, platformumuzda o an aktif olan gerçek yük ilanlarını aşağıda bulabilirsiniz. Bu sayfa canlıdır; yeni ilanlar eklendikçe otomatik güncellenir.`,
    activeLoads: 'Aktif Yük İlanları',
    noLoads: 'Bu ülkeden şu anda aktif ilan bulunmuyor. Yeni ilanlar için tekrar kontrol edin veya tüm ilanları inceleyin.',
    postCta: 'Bu Ülkeden İlan Ver',
    browseCta: 'Tüm İlanları Gör',
  },
  en: {
    title: (c) => `Freight Loads From ${c} | Shipping & Load Postings`,
    desc: (c) => `Browse active freight loads originating from ${c}. Connect directly with shippers posting from this country.`,
    intro: (c) => `Below are the freight loads currently active out of ${c} on our platform. This page updates automatically as new loads are posted.`,
    activeLoads: 'Active Load Postings',
    noLoads: 'No active loads from this country right now. Check back soon, or browse all current listings.',
    postCta: 'Post a Load From This Country',
    browseCta: 'Browse All Loads',
  },
};

interface Props {
  params: Promise<{ locale: string; countrySlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale, countrySlug } = await params;
  const locale: Locale = (rawLocale in TRANSLATIONS) ? (rawLocale as Locale) : 'en';
  const t = LABELS[locale] ?? LABELS.en;

  const hub = await getCountryHub(countrySlug);

  if (!hub || hub.loads.length === 0) {
    return {
      title: 'Country Not Found',
      robots: { index: false, follow: false },
    };
  }

  const title = t.title(hub.country);
  const description = t.desc(hub.country);

  // Only tr/en have real copy — canonicalize the other 45 locales to /en
  // instead of self-referencing (same fix as the legal pages and the lane
  // page). hreflang only lists locales with distinct content.
  const translatedLocales = Object.keys(LABELS);
  const canonicalLocale = translatedLocales.includes(locale) ? locale : 'en';
  const languages = translatedLocales.reduce((acc, code) => {
    acc[code] = `${SITE_URL}/${code}/shipping-routes/country/${countrySlug}`;
    return acc;
  }, {} as Record<string, string>);
  languages['x-default'] = `${SITE_URL}/en/shipping-routes/country/${countrySlug}`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${canonicalLocale}/shipping-routes/country/${countrySlug}`,
      languages,
    },
    openGraph: {
      title: `${title} | Loadly`,
      description,
      url: `${SITE_URL}/${canonicalLocale}/shipping-routes/country/${countrySlug}`,
    },
  };
}

export const revalidate = 3600; // active loads change often — refresh hourly

export default async function CountryHubPage({ params }: Props) {
  const { locale: rawLocale, countrySlug } = await params;
  const locale: Locale = (rawLocale in TRANSLATIONS) ? (rawLocale as Locale) : 'en';
  const t = LABELS[locale] ?? LABELS.en;

  const hub = await getCountryHub(countrySlug);

  if (!hub) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-fg mb-4">
          {locale === 'tr' ? 'Ülke bulunamadı' : 'Country not found'}
        </h1>
        <Link href={`/${locale}/marketplace`} className="text-accent font-bold hover:underline">
          {t.browseCta}
        </Link>
      </div>
    );
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: t.activeLoads, item: `${SITE_URL}/${locale}/marketplace` },
      {
        '@type': 'ListItem',
        position: 3,
        name: t.title(hub.country),
        item: `${SITE_URL}/${locale}/shipping-routes/country/${countrySlug}`,
      },
    ],
  };

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t.title(hub.country),
    numberOfItems: hub.loads.length,
    itemListElement: hub.loads.map((load, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: `${SITE_URL}/${locale}/marketplace/${load.id}`,
      name: load.title_translations?.[locale] || load.title || `${load.origin_city} - ${load.destination_city}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <header className="border-b border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <h1 className="text-3xl sm:text-4xl font-black text-fg tracking-tight flex items-center gap-3">
            <MapPin className="text-accent shrink-0" size={32} />
            {t.title(hub.country)}
          </h1>
          <p className="text-base font-medium text-muted mt-3 max-w-2xl">
            {t.intro(hub.country)}
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold text-fg mb-6 flex items-center gap-2">
          <Package size={20} className="text-accent" />
          {t.activeLoads} ({hub.loads.length})
        </h2>

        {hub.loads.length === 0 ? (
          <p className="text-muted">{t.noLoads}</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {hub.loads.map((load) => (
              <li key={load.id}>
                <Link
                  href={`/${locale}/marketplace/${load.id}`}
                  className="block p-5 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:border-accent/40 transition-colors"
                >
                  <div className="font-bold text-fg text-sm mb-2 line-clamp-2">
                    {load.title_translations?.[locale] || load.title || `${load.origin_city} → ${load.destination_city}`}
                  </div>
                  <div className="text-xs text-muted flex flex-col gap-1.5">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <MapPin size={13} /> {load.origin_city}, {hub.country} → {load.destination_city}, {normalizeCountryName(load.destination_country || '')}
                    </span>
                    {load.weight_ton && (
                      <span className="flex items-center gap-1.5">
                        <Weight size={13} /> {load.weight_ton} ton
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <Link
            href={`/${locale}/create-load`}
            className="px-6 py-3 rounded-2xl bg-accent text-white font-bold text-sm text-center hover:opacity-90 transition-opacity"
          >
            {t.postCta}
          </Link>
          <Link
            href={`/${locale}/marketplace`}
            className="px-6 py-3 rounded-2xl border border-border-light dark:border-border-dark font-bold text-sm text-center hover:border-accent/40 transition-colors"
          >
            {t.browseCta}
          </Link>
        </div>
      </section>
    </>
  );
}
