import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Weight, Package } from 'lucide-react';
import { getLane, buildCitySlug, buildCountrySlug } from '@/lib/laneRoutes';
import { TRANSLATIONS } from '@/utils/translations';
import type { Locale } from '@/utils/translations';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

const LABELS: Record<string, {
  title: (o: string, d: string) => string;
  desc: (o: string, d: string) => string;
  intro: (o: string, d: string) => string;
  activeLoads: string;
  noLoads: string;
  postCta: string;
  browseCta: string;
}> = {
  tr: {
    title: (o, d) => `${o} - ${d} Arası Nakliye ve Yük Taşıma`,
    desc: (o, d) => `${o} ile ${d} arasında aktif yük ilanlarını görüntüleyin. Bu güzergahta taşıma yapan nakliyecilerle doğrudan iletişime geçin.`,
    intro: (o, d) => `${o} - ${d} güzergahı için platformumuzda o an aktif olan gerçek yük ilanlarını aşağıda bulabilirsiniz. Bu sayfa canlıdır; yeni ilanlar eklendikçe otomatik güncellenir.`,
    activeLoads: 'Aktif Yük İlanları',
    noLoads: 'Bu güzergahta şu anda aktif ilan bulunmuyor. Yeni ilanlar için tekrar kontrol edin veya tüm ilanları inceleyin.',
    postCta: 'Bu Güzergahta İlan Ver',
    browseCta: 'Tüm İlanları Gör',
  },
  en: {
    title: (o, d) => `${o} to ${d} Freight Shipping & Load Postings`,
    desc: (o, d) => `Browse active freight loads between ${o} and ${d}. Connect directly with shippers posting on this lane.`,
    intro: (o, d) => `Below are the freight loads currently active on the ${o} → ${d} lane on our platform. This page updates automatically as new loads are posted.`,
    activeLoads: 'Active Load Postings',
    noLoads: 'No active loads on this lane right now. Check back soon, or browse all current listings.',
    postCta: 'Post a Load on This Lane',
    browseCta: 'Browse All Loads',
  },
};

interface Props {
  params: Promise<{ locale: string; lane: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale, lane: laneSlug } = await params;
  const locale: Locale = (rawLocale in TRANSLATIONS) ? (rawLocale as Locale) : 'en';
  const t = LABELS[locale] ?? LABELS.en;

  const lane = await getLane(laneSlug);

  if (!lane || lane.loads.length === 0) {
    return {
      title: 'Route Not Found',
      robots: { index: false, follow: false },
    };
  }

  const origin = `${lane.originCity}, ${lane.originCountry}`;
  const destination = `${lane.destinationCity}, ${lane.destinationCountry}`;
  const title = t.title(origin, destination);
  const description = t.desc(origin, destination);

  // Only tr/en have real copy (see LABELS above) — every other locale would
  // render identical English text at its own URL. Canonicalize those away to
  // /en instead of self-referencing, same fix already applied to the legal
  // pages (about/privacy/etc.) for the same reason. hreflang only lists the
  // locales that actually have distinct content.
  const translatedLocales = Object.keys(LABELS);
  const canonicalLocale = translatedLocales.includes(locale) ? locale : 'en';
  const languages = translatedLocales.reduce((acc, code) => {
    acc[code] = `${SITE_URL}/${code}/shipping-routes/${laneSlug}`;
    return acc;
  }, {} as Record<string, string>);
  languages['x-default'] = `${SITE_URL}/en/shipping-routes/${laneSlug}`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${canonicalLocale}/shipping-routes/${laneSlug}`,
      languages,
    },
    openGraph: {
      title: `${title} | Loadly`,
      description,
      url: `${SITE_URL}/${canonicalLocale}/shipping-routes/${laneSlug}`,
    },
  };
}

export const revalidate = 3600; // active loads change often — refresh hourly

export default async function LanePage({ params }: Props) {
  const { locale: rawLocale, lane: laneSlug } = await params;
  const locale: Locale = (rawLocale in TRANSLATIONS) ? (rawLocale as Locale) : 'en';
  const t = LABELS[locale] ?? LABELS.en;

  const lane = await getLane(laneSlug);

  if (!lane) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-fg mb-4">
          {locale === 'tr' ? 'Güzergah bulunamadı' : 'Route not found'}
        </h1>
        <Link href={`/${locale}/marketplace`} className="text-accent font-bold hover:underline">
          {t.browseCta}
        </Link>
      </div>
    );
  }

  const origin = `${lane.originCity}, ${lane.originCountry}`;
  const destination = `${lane.destinationCity}, ${lane.destinationCountry}`;

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: t.activeLoads, item: `${SITE_URL}/${locale}/marketplace` },
      {
        '@type': 'ListItem',
        position: 3,
        name: t.title(origin, destination),
        item: `${SITE_URL}/${locale}/shipping-routes/${laneSlug}`,
      },
    ],
  };

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t.title(origin, destination),
    numberOfItems: lane.loads.length,
    itemListElement: lane.loads.map((load, idx) => ({
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
            {t.title(origin, destination)}
          </h1>
          <p className="text-base font-medium text-muted mt-3 max-w-2xl">
            {t.intro(origin, destination)}
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold text-fg mb-6 flex items-center gap-2">
          <Package size={20} className="text-accent" />
          {t.activeLoads} ({lane.loads.length})
        </h2>

        {lane.loads.length === 0 ? (
          <p className="text-muted">{t.noLoads}</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {lane.loads.map((load) => (
              <li key={load.id}>
                <Link
                  href={`/${locale}/marketplace/${load.id}`}
                  className="block p-5 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:border-accent/40 transition-colors"
                >
                  <div className="font-bold text-fg text-sm mb-2 line-clamp-2">
                    {load.title_translations?.[locale] || load.title || `${origin} → ${destination}`}
                  </div>
                  <div className="text-xs text-muted flex flex-col gap-1.5">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <MapPin size={13} /> {origin} → {destination}
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

        <div className="flex flex-wrap gap-3 mt-6 text-sm">
          <Link
            href={`/${locale}/shipping-routes/from/${buildCitySlug(lane.originCity, lane.originCountry)}`}
            className="text-accent font-semibold hover:underline"
          >
            {locale === 'tr' ? `Tüm ${lane.originCity} çıkışlı ilanlar` : `All loads from ${lane.originCity}`}
          </Link>
          <Link
            href={`/${locale}/shipping-routes/country/${buildCountrySlug(lane.originCountry)}`}
            className="text-accent font-semibold hover:underline"
          >
            {locale === 'tr' ? `Tüm ${lane.originCountry} çıkışlı ilanlar` : `All loads from ${lane.originCountry}`}
          </Link>
        </div>
      </section>
    </>
  );
}
