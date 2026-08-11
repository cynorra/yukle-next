import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Weight, Package } from 'lucide-react';
import { getLoadTypeHub, normalizeCountryName } from '@/lib/laneRoutes';
import { TRANSLATIONS } from '@/utils/translations';
import type { Locale } from '@/utils/translations';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

const LOAD_TYPE_LABELS: Record<string, { tr: string; en: string }> = {
  general: { tr: 'Genel Kargo', en: 'General Cargo' },
  hazardous: { tr: 'Tehlikeli Madde', en: 'Hazardous Material' },
  perishable: { tr: 'Bozulabilir Ürün', en: 'Perishable' },
  oversized: { tr: 'Gabari Dışı', en: 'Oversized' },
  fragile: { tr: 'Kırılabilir', en: 'Fragile' },
};

function loadTypeLabel(raw: string, locale: 'tr' | 'en'): string {
  const known = LOAD_TYPE_LABELS[raw.toLowerCase()];
  if (known) return known[locale];
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

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
    title: (c) => `${c} Yük İlanları | Nakliye Fırsatları`,
    desc: (c) => `${c} kategorisindeki aktif yük ilanlarını görüntüleyin. Bu tür kargo taşıyan nakliyecilerle doğrudan iletişime geçin.`,
    intro: (c) => `${c} kategorisinde, platformumuzda o an aktif olan gerçek yük ilanlarını aşağıda bulabilirsiniz. Bu sayfa canlıdır; yeni ilanlar eklendikçe otomatik güncellenir.`,
    activeLoads: 'Aktif Yük İlanları',
    noLoads: 'Bu kargo tipi için şu anda aktif ilan bulunmuyor. Yeni ilanlar için tekrar kontrol edin veya tüm ilanları inceleyin.',
    postCta: 'Bu Kategoride İlan Ver',
    browseCta: 'Tüm İlanları Gör',
    faqTitle: 'Sık Sorulan Sorular',
    faq: (c, count) => [
      {
        q: `Kaç aktif ${c} ilanı var?`,
        a: count > 0
          ? `Şu anda ${count} aktif ${c} ilanı bulunuyor. Bu sayı ilanlar tamamlandıkça veya yenileri eklendikçe değişir.`
          : `Şu anda aktif ${c} ilanı bulunmuyor, ancak yeni ilanlar eklendikçe sayfa otomatik güncellenir.`,
      },
      {
        q: `${c} taşımak için nasıl nakliyeci bulurum?`,
        a: `Aşağıdaki aktif ilanlardan birine tıklayıp teklif verebilir veya doğrudan ilan sahibiyle iletişime geçebilirsiniz. Teklifiniz kabul edildiğinde güvenli mesajlaşma otomatik olarak açılır.`,
      },
      {
        q: 'Bu sayfa ne sıklıkla güncelleniyor?',
        a: 'Bu sayfa canlıdır ve platformdaki güncel aktif ilanları yansıtacak şekilde otomatik olarak yenilenir.',
      },
    ],
  },
  en: {
    title: (c) => `${c} Freight Loads | Shipping & Load Postings`,
    desc: (c) => `Browse active ${c} freight loads. Connect directly with shippers who need this cargo carried.`,
    intro: (c) => `Below are the ${c} freight loads currently active on our platform. This page updates automatically as new loads are posted.`,
    activeLoads: 'Active Load Postings',
    noLoads: 'No active loads for this cargo type right now. Check back soon, or browse all current listings.',
    postCta: 'Post a Load In This Category',
    browseCta: 'Browse All Loads',
    faqTitle: 'Frequently Asked Questions',
    faq: (c, count) => [
      {
        q: `How many active ${c} loads are there?`,
        a: count > 0
          ? `There are currently ${count} active ${c} loads. This number changes as loads are completed or new ones are posted.`
          : `There are no active ${c} loads right now, but the page updates automatically as new ones are posted.`,
      },
      {
        q: `How do I find a carrier for a ${c} load?`,
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
  params: Promise<{ locale: string; loadType: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale, loadType } = await params;
  const locale: Locale = (rawLocale in TRANSLATIONS) ? (rawLocale as Locale) : 'en';
  const t = LABELS[locale] ?? LABELS.en;

  const hub = await getLoadTypeHub(loadType);

  if (!hub || hub.loads.length === 0) {
    return {
      title: 'Cargo Type Not Found',
      robots: { index: false, follow: false },
    };
  }

  const label = loadTypeLabel(hub.loadType, locale === 'tr' ? 'tr' : 'en');
  const title = t.title(label);
  const description = t.desc(label);

  const translatedLocales = Object.keys(LABELS);
  const canonicalLocale = translatedLocales.includes(locale) ? locale : 'en';
  const languages = translatedLocales.reduce((acc, code) => {
    acc[code] = `${SITE_URL}/${code}/shipping-routes/cargo-type/${loadType}`;
    return acc;
  }, {} as Record<string, string>);
  languages['x-default'] = `${SITE_URL}/en/shipping-routes/cargo-type/${loadType}`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${canonicalLocale}/shipping-routes/cargo-type/${loadType}`,
      languages,
    },
    openGraph: {
      title: `${title} | Loadly`,
      description,
      url: `${SITE_URL}/${canonicalLocale}/shipping-routes/cargo-type/${loadType}`,
    },
  };
}

export const revalidate = 3600; // active loads change often — refresh hourly

export default async function LoadTypeHubPage({ params }: Props) {
  const { locale: rawLocale, loadType } = await params;
  const locale: Locale = (rawLocale in TRANSLATIONS) ? (rawLocale as Locale) : 'en';
  const t = LABELS[locale] ?? LABELS.en;

  const hub = await getLoadTypeHub(loadType);

  if (!hub) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-fg mb-4">
          {locale === 'tr' ? 'Kargo tipi bulunamadı' : 'Cargo type not found'}
        </h1>
        <Link href={`/${locale}/marketplace`} className="text-accent font-bold hover:underline">
          {t.browseCta}
        </Link>
      </div>
    );
  }

  const label = loadTypeLabel(hub.loadType, locale === 'tr' ? 'tr' : 'en');

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: t.activeLoads, item: `${SITE_URL}/${locale}/marketplace` },
      {
        '@type': 'ListItem',
        position: 3,
        name: t.title(label),
        item: `${SITE_URL}/${locale}/shipping-routes/cargo-type/${loadType}`,
      },
    ],
  };

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t.title(label),
    numberOfItems: hub.loads.length,
    itemListElement: hub.loads.map((load, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: `${SITE_URL}/${locale}/marketplace/${load.id}`,
      name: load.title_translations?.[locale] || load.title || `${load.origin_city} - ${load.destination_city}`,
    })),
  };

  const faqItems = t.faq(label, hub.loads.length);
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
            <Package className="text-accent shrink-0" size={32} />
            {t.title(label)}
          </h1>
          <p className="text-base font-medium text-muted mt-3 max-w-2xl">
            {t.intro(label)}
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
                      <MapPin size={13} /> {load.origin_city}, {normalizeCountryName(load.origin_country || '')} → {load.destination_city}, {normalizeCountryName(load.destination_country || '')}
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
