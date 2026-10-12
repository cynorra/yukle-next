import type { Metadata } from 'next';
import ProtectedRoute from '@/components/ProtectedRoute';
import { CreateLoadPageClient } from './CreateLoadPageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Create Listing',
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
