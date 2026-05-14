import type { Metadata } from 'next';
import ProtectedRoute from '@/components/ProtectedRoute';
import { DashboardPageClient } from './DashboardPageClient';

export const metadata: Metadata = {
  title: 'Panelim',
  description: 'YükLe panelim.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <ProtectedRoute>
      <DashboardPageClient />
    </ProtectedRoute>
  );
}
