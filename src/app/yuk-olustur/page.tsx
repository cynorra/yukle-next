import type { Metadata } from 'next';
import ProtectedRoute from '@/components/ProtectedRoute';
import { CreateLoadPageClient } from './CreateLoadPageClient';

export const metadata: Metadata = {
  title: 'Yük İlanı Oluştur',
  description: 'Yeni yük ilanı oluşturun.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <ProtectedRoute roles={['shipper']}>
      <CreateLoadPageClient />
    </ProtectedRoute>
  );
}
