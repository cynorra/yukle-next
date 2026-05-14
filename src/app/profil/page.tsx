import type { Metadata } from 'next';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ProfilePageClient } from './ProfilePageClient';

export const metadata: Metadata = {
  title: 'Profilim',
  description: 'YükLe profil ayarları.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <ProtectedRoute>
      <ProfilePageClient />
    </ProtectedRoute>
  );
}
