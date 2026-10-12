import type { Metadata } from 'next';
import ProtectedRoute from '@/components/ProtectedRoute';
import { FavoritesPageClient } from './FavoritesPageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'My Favorites',
  description: 'Favori ilanlarınız.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <ProtectedRoute>
      <FavoritesPageClient />
    </ProtectedRoute>
  );
}
