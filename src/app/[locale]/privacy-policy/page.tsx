import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { KVKKPageClient } from './KVKKPageClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

interface Props {
  params: Promise<{ locale: string }>;
}

// KVKK (Law No. 6698) is a Turkey-specific legal disclosure — the body text is
// Turkish law citations that can't be machine-translated for other locales.
// Every other locale gets the general, properly-localized policy at /privacy instead.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;

  if (rawLocale !== 'tr') {
    return { alternates: { canonical: `${SITE_URL}/${rawLocale}/privacy` } };
  }

  return {
    title: 'KVKK Aydınlatma Metni | Loadly',
    description: 'Loadly platformu KVKK kişisel verilerin korunması aydınlatma metni. 6698 sayılı Kanun kapsamında haklarınız ve veri işleme politikamız.',
    alternates: {
      canonical: `${SITE_URL}/tr/privacy-policy`,
    },
    openGraph: {
      title: 'KVKK Aydınlatma Metni | Loadly',
      description: 'Loadly platformu KVKK kişisel verilerin korunması aydınlatma metni.',
      url: `${SITE_URL}/tr/privacy-policy`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { locale: rawLocale } = await params;

  if (rawLocale !== 'tr') {
    redirect(`/${rawLocale}/privacy`);
  }

  return <KVKKPageClient />;
}
