import type { Metadata } from 'next';
import { AdPageClient } from './AdPageClient';

export const metadata: Metadata = {
  title: 'Reklam Verin',
  description: 'YükLe reklam fırsatları ve detayları.',
  alternates: { canonical: '/reklam' },
};

export default function Page() {
  return <AdPageClient />;
}
