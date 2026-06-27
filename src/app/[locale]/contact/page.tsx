import type { Metadata } from 'next';
import { ContactPageClient } from './ContactPageClient';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the Loadly team.',
  alternates: { canonical: '/contact' },
};

export default function Page() {
  return <ContactPageClient />;
}
