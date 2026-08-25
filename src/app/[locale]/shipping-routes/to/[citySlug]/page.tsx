import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Weight, Package } from 'lucide-react';
import { getDestinationCityHub, normalizeCountryName } from '@/lib/laneRoutes';
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
  faqTitle: string;
  faq: (c: string, count: number) => { q: string; a: string }[];
}> = {
  tr: {
    title: (c) => `${c} Varışlı Yük İlanları ve Nakliye Fırsatları`,
    desc: (c) => `${c} varışlı aktif yük ilanlarını görüntüleyin. Bu şehre yük taşıyan nakliyecilerle doğrudan iletişime geçin.`,
    intro: (c) => `${c} varışlı, platformumuzda o an aktif olan gerçek yük ilanlarını aşağıda bulabilirsiniz. Bu sayfa canlıdır; yeni ilanlar eklendikçe otomatik güncellenir.`,
    activeLoads: 'Aktif Yük İlanları',
    noLoads: 'Bu şehre şu anda aktif ilan bulunmuyor. Yeni ilanlar için tekrar kontrol edin veya tüm ilanları inceleyin.',
    postCta: 'Bu Şehre İlan Ver',
    browseCta: 'Tüm İlanları Gör',
    faqTitle: 'Sık Sorulan Sorular',
    faq: (c, count) => [
      {
        q: `${c} varışlı kaç aktif yük ilanı var?`,
        a: count > 0
          ? `Şu anda ${c} varışlı ${count} aktif yük ilanı bulunuyor. Bu sayı ilanlar tamamlandıkça veya yenileri eklendikçe değişir.`
          : `${c} varışlı şu anda aktif ilan bulunmuyor, ancak yeni ilanlar eklendikçe sayfa otomatik güncellenir.`,
      },
      {
        q: `${c} varışlı bir yük için nasıl nakliyeci bulurum?`,
        a: `Aşağıdaki aktif ilanlardan birine tıklayıp teklif verebilir veya doğrudan ilan sahibiyle iletişime geçebilirsiniz. Teklifiniz kabul edildiğinde güvenli mesajlaşma otomatik olarak açılır.`,
      },
      {
        q: 'Bu sayfa ne sıklıkla güncelleniyor?',
        a: 'Bu sayfa canlıdır ve platformdaki güncel aktif ilanları yansıtacak şekilde otomatik olarak yenilenir.',
      },
    ],
  },
  en: {
    title: (c) => `Freight Loads To ${c} | Shipping & Load Postings`,
    desc: (c) => `Browse active freight loads heading to ${c}. Connect directly with shippers posting loads bound for this city.`,
    intro: (c) => `Below are the freight loads currently active with a destination of ${c} on our platform. This page updates automatically as new loads are posted.`,
    activeLoads: 'Active Load Postings',
    noLoads: 'No active loads to this city right now. Check back soon, or browse all current listings.',
    postCta: 'Post a Load To This City',
    browseCta: 'Browse All Loads',
    faqTitle: 'Frequently Asked Questions',
    faq: (c, count) => [
      {
        q: `How many active freight loads are heading to ${c}?`,
        a: count > 0
          ? `There are currently ${count} active freight loads with a destination of ${c}. This number changes as loads are completed or new ones are posted.`
          : `There are no active loads to ${c} right now, but the page updates automatically as new ones are posted.`,
      },
      {
        q: `How do I find a carrier for a load to ${c}?`,
        a: `Browse the active listings below and bid on or contact the poster directly. Once a bid is accepted, secure messaging unlocks automatically between both parties.`,
      },
      {
        q: 'How often is this page updated?',
        a: 'This page is live and refreshes automatically to reflect the current active loads on the platform.',
      },
    ],
  },
};

interface Props {
  params: Promise<{ locale: string; citySlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale, citySlug } = await params;

  if (rawLocale !== 'tr' && rawLocale !== 'en') {
    return {
      alternates: { canonical: `${SITE_URL}/en/shipping-routes/to/${citySlug}` },
    };
  }

  const locale: Locale = (rawLocale in TRANSLATIONS) ? (rawLocale as Locale) : 'en';
  const t = LABELS[locale] ?? LABELS.en;

  const hub = await getDestinationCityHub(citySlug);

  if (!hub || hub.loads.length === 0) {
    return {
      title: 'City Not Found',
      robots: { index: false, follow: false },
    };
  }

  const cityLabel = `${hub.city}, ${hub.country}`;
  const title = t.title(cityLabel);
  const description = t.desc(cityLabel);

  // Only tr/en have real copy — canonicalize the other 45 locales to /en
  // instead of self-referencing (same fix as the origin city page).
  const translatedLocales = Object.keys(LABELS);
  const canonicalLocale = translatedLocales.includes(locale) ? locale : 'en';
  const languages = translatedLocales.reduce((acc, code) => {
    acc[code] = `${SITE_URL}/${code}/shipping-routes/to/${citySlug}`;
    return acc;
  }, {} as Record<string, string>);
  languages['x-default'] = `${SITE_URL}/en/shipping-routes/to/${citySlug}`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${canonicalLocale}/shipping-routes/to/${citySlug}`,
      languages,
    },
    openGraph: {
      title: `${title} | Loadly`,
      description,
      url: `${SITE_URL}/${canonicalLocale}/shipping-routes/to/${citySlug}`,
    },
  };
}

export const revalidate = 3600; // active loads change often — refresh hourly

export default async function DestinationCityHubPage({ params }: Props) {
  const { locale: rawLocale, citySlug } = await params;

  if (rawLocale !== 'tr' && rawLocale !== 'en') {
    redirect(`/en/shipping-routes/to/${citySlug}`);
  }

  const locale: Locale = (rawLocale in TRANSLATIONS) ? (rawLocale as Locale) : 'en';
  const t = LABELS[locale] ?? LABELS.en;

  const hub = await getDestinationCityHub(citySlug);

  if (!hub) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-fg mb-4">
          {locale === 'tr' ? 'Şehir bulunamadı' : 'City not found'}
        </h1>
        <Link href={`/${locale}/marketplace`} className="text-accent font-bold hover:underline">
          {t.browseCta}
        </Link>
      </div>
    );
  }

  const cityLabel = `${hub.city}, ${hub.country}`;

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: t.activeLoads, item: `${SITE_URL}/${locale}/marketplace` },
      {
        '@type': 'ListItem',
        position: 3,
        name: t.title(cityLabel),
        item: `${SITE_URL}/${locale}/shipping-routes/to/${citySlug}`,
      },
    ],
  };

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t.title(cityLabel),
    numberOfItems: hub.loads.length,
    itemListElement: hub.loads.map((load, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: `${SITE_URL}/${locale}/marketplace/${load.id}`,
      name: load.title_translations?.[locale] || load.title || `${load.origin_city} - ${load.destination_city}`,
    })),
  };

  const faqItems = t.faq(cityLabel, hub.loads.length);
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <header className="border-b border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <h1 className="text-3xl sm:text-4xl font-black text-fg tracking-tight flex items-center gap-3">
            <MapPin className="text-accent shrink-0" size={32} />
            {t.title(cityLabel)}
          </h1>
          <p className="text-base font-medium text-muted mt-3 max-w-2xl">
            {t.intro(cityLabel)}
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
                    {load.title_translations?.[locale] || load.title || `${load.origin_city} → ${hub.city}`}
                  </div>
                  <div className="text-xs text-muted flex flex-col gap-1.5">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <MapPin size={13} /> {load.origin_city}, {normalizeCountryName(load.origin_country || '')} → {hub.city}
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

        <div className="mt-14 max-w-3xl">
          <h2 className="text-xl font-bold text-fg mb-6">{t.faqTitle}</h2>
          <dl className="flex flex-col gap-5">
            {faqItems.map(({ q, a }) => (
              <div key={q}>
                <dt className="font-bold text-fg text-sm mb-1.5">{q}</dt>
                <dd className="text-sm text-muted leading-relaxed">{a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
