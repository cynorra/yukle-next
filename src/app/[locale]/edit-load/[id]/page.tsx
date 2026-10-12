import type { Metadata } from 'next';
import ProtectedRoute from '@/components/ProtectedRoute';
import { EditLoadPageClient } from './EditLoadPageClient';

export const metadata: Metadata = {
  title: 'Edit Listing',
  description: 'Mevcut yük ilanınızı düzenleyin.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <ProtectedRoute roles={['shipper']}>
      <EditLoadPageClient />
    </ProtectedRoute>
  );
}
