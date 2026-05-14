import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createPublicClient } from '@/lib/supabase/public';
import { LoadDetailClient } from './LoadDetailClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

const LOAD_TYPES: Record<string, string> = {
  general: 'Genel Kargo',
  hazardous: 'Tehlikeli Madde',
  perishable: 'Bozulabilir',
  oversized: 'Aşırı Büyük',
  fragile: 'Kırılgan',
};

const TRUCK_TYPES: Record<string, string> = {
  tir: 'TIR',
  kamyon: 'Kamyon',
  kamyonet: 'Kamyonet',
  dorser: 'Dorser',
  tanker: 'Tanker',
  frigorifik: 'Frigorifik',
};

// Her istekte yeniden çalış (ilan güncellenirse SEO'ya yansır)
export const revalidate = 300;

async function getLoad(id: string) {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from('loads')
    .select(
      '*, origin_city:cities!loads_origin_city_id_fkey(*), destination_city:cities!loads_destination_city_id_fkey(*), origin_district:districts!loads_origin_district_id_fkey(*), destination_district:districts!loads_destination_district_id_fkey(*), shipper:public_profiles!loads_shipper_id_fkey(id, full_name, company_name, is_verified, rating, avatar_url)'
    )
    .eq('id', id)
    .maybeSingle();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const load = await getLoad(id);

  if (!load) {
    return {
      title: 'İlan Bulunamadı',
      description: 'Aradığınız nakliye ilanı bulunamadı.',
      robots: { index: false, follow: false },
    };
  }

  const origin = load.origin_city?.name || '';
  const destination = load.destination_city?.name || '';
  const truck = load.required_truck_type ? TRUCK_TYPES[load.required_truck_type] : '';
  const loadTypeText = load.load_type ? LOAD_TYPES[load.load_type] : '';

  const title = `${origin} - ${destination} Yük İlanı${truck ? ` (${truck})` : ''}`;
  const description =
    `${origin} - ${destination} arası ${load.weight_ton} ton ${loadTypeText || 'yük'} taşıma ilanı. ` +
    (load.description ? load.description.slice(0, 120) : 'Detaylar ve teklif için ilana göz atın.');

  return {
    title,
    description,
    alternates: { canonical: `/pazar/${id}` },
    openGraph: {
      type: 'website',
      title,
      description,
      url: `${SITE_URL}/pazar/${id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    // İlan tamamlanmış/iptal olmuşsa indexleme
    robots:
      load.status === 'completed' || load.status === 'cancelled'
        ? { index: false, follow: true }
        : { index: true, follow: true },
  };
}

export default async function LoadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const load = await getLoad(id);

  if (!load) {
    notFound();
  }

  // Product schema benzeri JSON-LD (Google Rich Results için)
  const offerJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${load.origin_city?.name} - ${load.destination_city?.name} Nakliye Hizmeti`,
    description:
      load.description ||
      `${load.weight_ton} ton yük taşıma ilanı. ${load.origin_city?.name} → ${load.destination_city?.name}`,
    provider: {
      '@type': 'Organization',
      name: load.shipper?.company_name || load.shipper?.full_name || 'YükLe Kullanıcısı',
    },
    areaServed: [
      { '@type': 'City', name: load.origin_city?.name },
      { '@type': 'City', name: load.destination_city?.name },
    ],
    ...(load.price && {
      offers: {
        '@type': 'Offer',
        price: load.price,
        priceCurrency: 'TRY',
        availability: 'https://schema.org/InStock',
        url: `${SITE_URL}/pazar/${id}`,
      },
    }),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Anasayfa', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Pazar', item: `${SITE_URL}/pazar` },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${load.origin_city?.name} - ${load.destination_city?.name}`,
        item: `${SITE_URL}/pazar/${id}`,
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

      {/* SEO-friendly statik başlık ve özet (botlar bunu görür) */}
      <header className="max-w-5xl mx-auto px-4 pt-8">
        <nav className="text-xs text-muted mb-4">
          <a href="/" className="hover:text-accent">
            Anasayfa
          </a>{' '}
          /{' '}
          <a href="/pazar" className="hover:text-accent">
            Pazar
          </a>{' '}
          / <span>{load.origin_city?.name} → {load.destination_city?.name}</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-black text-fg tracking-tight">
          {load.title}
        </h1>
        <p className="mt-2 text-base text-muted">
          {load.origin_city?.name}
          {load.origin_district?.name ? ` (${load.origin_district.name})` : ''} →{' '}
          {load.destination_city?.name}
          {load.destination_district?.name ? ` (${load.destination_district.name})` : ''} ·{' '}
          {load.weight_ton} ton
          {load.required_truck_type ? ` · ${TRUCK_TYPES[load.required_truck_type]}` : ''}
          {load.load_type ? ` · ${LOAD_TYPES[load.load_type]}` : ''}
        </p>
      </header>

      {/* Client interaktif kısım: teklifler, mesajlaşma, vb. */}
      <LoadDetailClient load={load as any} />
    </>
  );
}
