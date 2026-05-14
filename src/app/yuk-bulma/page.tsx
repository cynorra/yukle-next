import type { Metadata } from 'next';
import { YukBulmaClient } from './YukBulmaClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

export const metadata: Metadata = {
  title: 'Yük Bulma: Güvenilir Nakliye Pazaryeri',
  description:
    'En hızlı ve güvenilir yük bulma platformu. Rota bazlı eşleşme, doğrulanmış nakliyeciler ve kolay teklif süreciyle hemen yük bulun.',
  alternates: { canonical: '/yuk-bulma' },
  openGraph: {
    title: 'Yük Bulma: Güvenilir Nakliye Pazaryeri',
    description:
      'Rota bazlı yük eşleşme, doğrulanmış kullanıcılar, anında teklif. Aracınızın boş dönmesini engelleyin.',
    url: `${SITE_URL}/yuk-bulma`,
  },
};

export default function YukBulmaPage() {
  return <YukBulmaClient />;
}
