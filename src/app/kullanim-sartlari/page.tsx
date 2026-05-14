import type { Metadata } from 'next';
import { TermsPageClient } from './TermsPageClient';

export const metadata: Metadata = {
  title: 'Kullanım Şartları',
  description: 'YükLe kullanım şartları ve koşulları.',
  alternates: { canonical: '/kullanim-sartlari' },
};

export default function Page() {
  return <TermsPageClient />;
}
