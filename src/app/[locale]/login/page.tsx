import type { Metadata } from 'next';
import { LoginPageClient } from './LoginPageClient';

export const metadata: Metadata = {
  title: 'Giriş Yap',
  description: 'YükLe hesabınıza giriş yapın.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <LoginPageClient />;
}
