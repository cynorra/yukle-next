import type { Metadata } from 'next';
import { LoginPageClient } from './LoginPageClient';
import { getAppTranslation } from '@/utils/getAppTranslation';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const c = getAppTranslation(locale);
  return {
    title: c.auth.metaTitle,
    description: c.auth.metaDesc,
    robots: { index: false, follow: false },
  };
}

export default function Page() {
  return <LoginPageClient />;
}
