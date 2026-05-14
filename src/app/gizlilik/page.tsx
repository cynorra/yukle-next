import type { Metadata } from 'next';
import { PrivacyPageClient } from './PrivacyPageClient';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası',
  description: 'YükLe gizlilik politikası.',
  alternates: { canonical: '/gizlilik' },
};

export default function Page() {
  return <PrivacyPageClient />;
}
