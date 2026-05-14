import type { Metadata } from 'next';
import { KVKKPageClient } from './KVKKPageClient';

export const metadata: Metadata = {
  title: 'KVKK Aydınlatma Metni',
  description: 'YükLe KVKK kişisel verilerin korunması aydınlatma metni.',
  alternates: { canonical: '/kvkk' },
};

export default function Page() {
  return <KVKKPageClient />;
}
