import type { Metadata } from 'next';
import { SeoContent } from '@/components/SeoContent';
import { Package } from 'lucide-react';
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

  const languages = Object.keys(TRANSLATIONS).reduce((acc, code) => {
    acc[code] = `/${code}/marketplace`;
    return acc;
  }, { 'x-default': '/en/marketplace' } as Record<string, string>);

  return {
    title: t.marketplace.title,
    description: t.marketplace.desc,
    alternates: {
      canonical: `/${locale}/marketplace`,
      languages,
    },
    openGraph: {
      title: `${t.marketplace.title} | Loadly`,
      description: t.marketplace.desc,
      url: `${SITE_URL}/${locale}/marketplace`,
    },
    // No longer part of the site's public/indexed surface — see the same
    // note in marketplace/[id]/page.tsx. Unlinked from nav and the
    // homepage; this page stays reachable directly for existing accounts
    // but isn't meant to be discovered via search or browsing.
    robots: { index: false, follow: false },
  };
}

export const revalidate = 86400;

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

  return (
    <>
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

      <MarketClient
        initialLoads={loads as any}
        initialTotal={total}
      />
      
      <SeoContent page="marketplace" locale={locale} />
    </>
  );
}
