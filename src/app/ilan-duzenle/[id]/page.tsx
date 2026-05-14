import type { Metadata } from 'next';
import ProtectedRoute from '@/components/ProtectedRoute';
import { EditLoadPageClient } from './EditLoadPageClient';

export const metadata: Metadata = {
  title: 'İlanı Düzenle',
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
