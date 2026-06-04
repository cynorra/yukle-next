import type { Metadata } from 'next';
import { YukIlaniClient } from './YukIlaniClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

export const metadata: Metadata = {
  title: 'Ücretsiz Yük İlanı Ver | Nakliye Pazaryeri',
  description:
    'Ücretsiz yük ilanı verin, yüzlerce nakliyeciden teklif alın. TIR, kamyon ve kamyonet ilanları için en doğru adres.',
  alternates: { canonical: '/yuk-ilani' },
  openGraph: {
    title: 'Ücretsiz Yük İlanı Ver | YükLe',
    description:
      'TIR, kamyon, kamyonet ilanlarınız için Türkiye genelinde nakliyeci teklifleri. Ücretsiz ve hızlı.',
    url: `${SITE_URL}/yuk-ilani`,
  },
};

export default function YukIlaniPage() {
  return <YukIlaniClient />;
}
