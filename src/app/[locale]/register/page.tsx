import type { Metadata } from 'next';
import { RegisterPageClient } from './RegisterPageClient';

export const metadata: Metadata = {
  title: 'Üye Ol',
  description: "YükLe'ye ücretsiz üye olun ve nakliye ilanlarına erişin.",
  alternates: { canonical: '/kayit' },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <RegisterPageClient />;
}
