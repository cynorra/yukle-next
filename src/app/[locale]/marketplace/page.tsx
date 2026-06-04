import type { Metadata } from 'next';
import Link from 'next/link';
import { Package, MapPin, Weight, Clock } from 'lucide-react';
import { createPublicClient } from '@/lib/supabase/public';
import { MarketClient } from './MarketClient';
import { TRANSLATIONS } from '@/utils/translations';
import type { Locale } from '@/utils/translations';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = (rawLocale in TRANSLATIONS) ? (rawLocale as Locale) : 'en';
  const t = TRANSLATIONS[locale];
  return {
    title: `${t.marketplace.title} | Loadly`,
    description: t.marketplace.desc,
    alternates: { canonical: `/${locale}/marketplace` },
    openGraph: {
      title: `${t.marketplace.title} | Loadly`,
      description: t.marketplace.desc,
      url: `${SITE_URL}/${locale}/marketplace`,
    },
  };
}

export const revalidate = 60;

export default async function PazarPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  const locale: Locale = (rawLocale in TRANSLATIONS) ? (rawLocale as Locale) : 'en';
  const t = TRANSLATIONS[locale];
  
  const supabase = createPublicClient();

  const { data: initialLoads, count } = await supabase
    .from('loads')
    .select(
      '*, shipper:public_profiles!loads_shipper_id_fkey(id, full_name, company_name, is_verified, rating)',
      { count: 'exact' }
    )
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .range(0, 49);

  const total = count || 0;
  const loads = initialLoads || [];

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t.marketplace.allLoads,
    numberOfItems: total,
    itemListElement: loads.slice(0, 20).map((load: any, idx: number) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: `${SITE_URL}/${locale}/marketplace/${load.id}`,
      name: load.title || `${load.origin_city} - ${load.destination_city}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <div className="bg-accent/5 border-b border-accent/10 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-accent/60">
            Loadly Logistics Network
          </p>
        </div>
      </div>

      <header className="border-b border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl sm:text-4xl font-black text-fg tracking-tight flex items-center gap-3">
            <Package className="text-accent" size={32} />
            {t.marketplace.title}
          </h1>
          <p className="text-base font-medium text-muted mt-2">
            {t.marketplace.desc}
          </p>
        </div>
      </header>

      {/* noscript fallback for SEO crawlers */}
      <noscript>
        <section className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-fg mb-6">Recent Load Postings</h2>
          <ul className="space-y-3">
            {loads.slice(0, 20).map((load: any) => (
              <li key={load.id}>
                <Link
                  href={`/${locale}/marketplace/${load.id}`}
                  className="block p-4 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl hover:border-accent/30"
                >
                  <div className="font-bold text-fg">
                    {load.title || `${load.origin_city} → ${load.destination_city}`}
                  </div>
                  <div className="text-sm text-muted flex items-center gap-4 mt-1">
                    <span className="flex items-center gap-1 font-bold">
                      <MapPin size={14} /> {load.origin_city} → {load.destination_city}
                    </span>
                    {load.weight_ton && (
                      <span className="flex items-center gap-1">
                        <Weight size={14} /> {load.weight_ton} ton
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </noscript>

      <MarketClient
        initialLoads={loads as any}
        initialTotal={total}
      />
    </>
  );
}
