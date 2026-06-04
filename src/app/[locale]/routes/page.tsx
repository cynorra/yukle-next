import type { Metadata } from 'next';
import ProtectedRoute from '@/components/ProtectedRoute';
import { DriverRoutesPageClient } from './DriverRoutesPageClient';

export const metadata: Metadata = {
  title: 'Güzergahlarım',
  description: 'Şoför güzergah ayarları.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <ProtectedRoute roles={['driver']}>
      <DriverRoutesPageClient />
    </ProtectedRoute>
  );
}
