import { ImageResponse } from 'next/og';
import { createPublicClient } from '@/lib/supabase/public';

export const alt = 'Loadly Freight Opportunity';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Pre-render the OG image for the indexable listing at build time — Satori's
// SVG->PNG render is CPU-heavy enough to intermittently exceed the Workers
// Free plan's 10ms cap on a cold isolate (confirmed via wrangler tail during
// this migration). Same param source as the page itself; noindexed listings
// stay dynamic since dynamicParams defaults to true.
export async function generateStaticParams() {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from('loads')
    .select('id')
    .eq('status', 'active')
    .not('price', 'is', null);

  const { TRANSLATIONS } = await import('@/utils/translations');
  const locales = Object.keys(TRANSLATIONS);
  return (data || []).flatMap((load) =>
    locales.map((locale) => ({ id: load.id, locale }))
  );
}

const TRUCK_TYPES: Record<string, string> = {
  tir: 'TIR',
  kamyon: 'Truck',
  kamyonet: 'Van',
  dorser: 'Trailer',
  tanker: 'Tanker',
  frigorifik: 'Reefer',
};

export default async function Image({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const { id, locale } = await params;

  const supabase = createPublicClient();
  const { data: load } = await supabase
    .from('loads')
    .select('title, title_translations, origin_city, origin_country, destination_city, destination_country, weight_ton, price, required_truck_type, load_type')
    .eq('id', id)
    .maybeSingle();

  const isTr = locale === 'tr';
  const title = load?.title_translations?.[locale] || load?.title || 'Freight Shipping Opportunity';
  const origin = load ? `${load.origin_city}, ${load.origin_country}` : 'Origin';
  const destination = load ? `${load.destination_city}, ${load.destination_country}` : 'Destination';
  const weight = load?.weight_ton ? `${load.weight_ton} Ton` : 'Standard Weight';
  const truck = load?.required_truck_type ? (TRUCK_TYPES[load.required_truck_type] || load.required_truck_type) : 'TIR / Truck';
  const price = load?.price ? `${load.price} ${isTr ? 'TL' : 'USD'}` : (isTr ? 'Pazarlıklı' : 'Negotiable');

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '60px',
          backgroundColor: '#090D16',
          backgroundImage: 'radial-gradient(circle at 25px 25px, #1E293B 2px, transparent 0)',
          backgroundSize: '50px 50px',
          color: '#FFFFFF',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                backgroundColor: '#F5A623',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '900',
                fontSize: '28px',
                color: '#000000',
              }}
            >
              L
            </div>
            <span style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-1px', color: '#FFFFFF' }}>
              Loadly<span style={{ color: '#F5A623' }}>.</span>
            </span>
          </div>

          <div
            style={{
              padding: '10px 24px',
              borderRadius: '999px',
              backgroundColor: 'rgba(245, 166, 35, 0.15)',
              border: '1px solid rgba(245, 166, 35, 0.3)',
              color: '#F5A623',
              fontSize: '18px',
              fontWeight: '700',
            }}
          >
            {isTr ? 'VERIFIED FREIGHT' : 'VERIFIED FREIGHT'}
          </div>
        </div>

        {/* Route Banner */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px', width: '100%' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              fontSize: '44px',
              fontWeight: '800',
              color: '#F8FAFC',
              lineHeight: '1.2',
            }}
          >
            <span style={{ color: '#FFFFFF' }}>{origin}</span>
            <span style={{ color: '#F5A623', fontSize: '40px' }}>{'→'}</span>
            <span style={{ color: '#FFFFFF' }}>{destination}</span>
          </div>

          <div style={{ fontSize: '24px', color: '#94A3B8', fontWeight: '500' }}>
            {title}
          </div>
        </div>

        {/* Specs Badges Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: 'auto' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div
              style={{
                padding: '14px 28px',
                borderRadius: '16px',
                backgroundColor: '#1E293B',
                border: '1px solid #334155',
                fontSize: '20px',
                fontWeight: '700',
                color: '#E2E8F0',
              }}
            >
              {weight}
            </div>

            <div
              style={{
                padding: '14px 28px',
                borderRadius: '16px',
                backgroundColor: '#1E293B',
                border: '1px solid #334155',
                fontSize: '20px',
                fontWeight: '700',
                color: '#E2E8F0',
              }}
            >
              {truck}
            </div>
          </div>

          <div
            style={{
              fontSize: '36px',
              fontWeight: '900',
              color: '#F5A623',
            }}
          >
            {price}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
