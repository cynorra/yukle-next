import type { Metadata } from 'next';
import Link from 'next/link';
import { Package, MapPin, Weight, Clock } from 'lucide-react';
import { createPublicClient } from '@/lib/supabase/public';
import { MarketClient } from './MarketClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

export const metadata: Metadata = {
  title: 'Nakliye Pazaryeri: Ücretsiz Yük İlanı ve Yük Bulma',
  description:
    'YükLe ile ücretsiz yük ilanı yayınlayın, güzergah bazlı yük bulun ve Türkiye genelinde nakliyeci/taşıyıcı eşleştirin. Hızlı kayıt, kolay ilan, anında eşleşme.',
  alternates: { canonical: '/pazar' },
  openGraph: {
    title: 'Nakliye Pazaryeri: Ücretsiz Yük İlanı ve Yük Bulma',
    description:
      'Türkiye genelinde aktif yük ilanları. Güzergah eşleştirme, doğrulanmış nakliyeciler, ücretsiz kullanım.',
    url: `${SITE_URL}/pazar`,
  },
};

// Pazar sayfası her 60 saniyede yenilensin (yeni ilanlar gelir)
export const revalidate = 60;

// Bu sayfa Server Component: ilk 50 aktif ilanı server'da çeker,
// SEO için statik HTML olarak render eder, sonra MarketClient'a aktarır.
export default async function PazarPage() {
  const supabase = createPublicClient();

  // İlk batch ilanları server'da çek (SEO crawler'lar görsün)
  const [{ data: initialLoads, count }, { data: cities }] = await Promise.all([
    supabase
      .from('loads')
      .select(
        '*, origin_city:cities!loads_origin_city_id_fkey(*), destination_city:cities!loads_destination_city_id_fkey(*), shipper:public_profiles!loads_shipper_id_fkey(id, full_name, company_name, is_verified, rating)',
        { count: 'exact' }
      )
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .range(0, 49),
    supabase.from('cities').select('*').order('name'),
  ]);

  const total = count || 0;
  const loads = initialLoads || [];

  // JSON-LD ItemList for SEO
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Aktif Yük İlanları',
    numberOfItems: total,
    itemListElement: loads.slice(0, 20).map((load: any, idx: number) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: `${SITE_URL}/pazar/${load.id}`,
      name: load.title || `${load.origin_city?.name} - ${load.destination_city?.name}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      {/* SEO için statik server-rendered hero başlığı */}
      <div className="bg-accent/5 border-b border-accent/10 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-accent/60">
            YükLe Lojistik İlan Platformu
          </p>
        </div>
      </div>

      <header className="border-b border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl sm:text-4xl font-black text-fg tracking-tight flex items-center gap-3">
            <Package className="text-accent" size={32} />
            Nakliye Pazaryeri: Ücretsiz Yük İlanı Verin, Yük Bulun
          </h1>
          <p className="text-base font-medium text-muted mt-2">
            Türkiye genelinde {total} aktif yük ilanı. Güzergah, araç tipi ve yük cinsine göre
            filtreleyin.
          </p>
        </div>
      </header>

      {/* Server'da pre-rendered: ilk 20 ilanın özet listesi (botlar görsün) */}
      <noscript>
        <section className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-fg mb-6">Son Yük İlanları</h2>
          <ul className="space-y-3">
            {loads.slice(0, 20).map((load: any) => (
              <li key={load.id}>
                <Link
                  href={`/pazar/${load.id}`}
                  className="block p-4 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl hover:border-accent/30"
                >
                  <div className="font-bold text-fg">
                    {load.title || `${load.origin_city?.name} → ${load.destination_city?.name}`}
                  </div>
                  <div className="text-sm text-muted flex items-center gap-4 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} /> {load.origin_city?.name} → {load.destination_city?.name}
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

      {/* İnteraktif kısım: filtreler + pagination + realtime fetch */}
      <MarketClient
        initialLoads={loads as any}
        initialTotal={total}
        cities={(cities as any) || []}
      />
    </>
  );
}
