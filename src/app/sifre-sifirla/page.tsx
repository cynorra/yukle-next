import type { Metadata } from 'next';
import { ResetPasswordPageClient } from './ResetPasswordPageClient';

export const metadata: Metadata = {
  title: 'Şifre Sıfırla',
  description: 'YükLe hesabınızın şifresini sıfırlayın.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ResetPasswordPageClient />;
}
