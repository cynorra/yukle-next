import type { Metadata } from 'next';
import { ResetPasswordPageClient } from './ResetPasswordPageClient';
import { getAppTranslation } from '@/utils/getAppTranslation';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const c = getAppTranslation(locale);
  return {
    title: c.auth.resetPasswordMetaTitle,
    description: c.auth.resetPasswordMetaDesc,
    robots: { index: false, follow: false },
  };
}

export default function Page() {
  return <ResetPasswordPageClient />;
}
