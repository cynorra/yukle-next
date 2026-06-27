import type { Metadata } from 'next';
import { AboutPageClient } from './AboutPageClient';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'About Loadly, the digital freight marketplace.',
  alternates: { canonical: '/about' },
};

export default function Page() {
  return <AboutPageClient />;
}
