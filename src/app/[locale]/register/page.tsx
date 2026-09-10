import type { Metadata } from 'next';
import { RegisterPageClient } from './RegisterPageClient';
import { getAppTranslation } from '@/utils/getAppTranslation';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const c = getAppTranslation(locale);
  return {
    title: c.auth.registerMetaTitle,
    description: c.auth.registerMetaDesc,
    alternates: { canonical: `/${locale}/register` },
    robots: { index: false, follow: false },
  };
}

export default function Page() {
  return <RegisterPageClient />;
}
