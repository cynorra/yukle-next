import type { Metadata } from 'next';
import ProtectedRoute from '@/components/ProtectedRoute';
import { MessagesPageClient } from './MessagesPageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Mesajlar',
  description: 'YükLe mesajlarınız.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <ProtectedRoute>
      <MessagesPageClient />
    </ProtectedRoute>
  );
}
