import type { Metadata } from 'next';
import { createPublicClient } from '@/lib/supabase/public';
import { PublicProfilePageClient } from './PublicProfilePageClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

export const revalidate = 600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}): Promise<Metadata> {
  const { id, locale } = await params;
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from('public_profiles')
      .select('full_name, company_name, role, rating')
      .eq('id', id)
      .maybeSingle();

    if (!data) {
      return {
        title: locale === 'tr' ? 'Kullanıcı Bulunamadı' : 'User Not Found',
        robots: { index: false, follow: false },
      };
    }

    const name = data.company_name || data.full_name || 'User';
    const roleText = data.role === 'driver' 
      ? (locale === 'tr' ? 'Nakliyeci' : 'Carrier') 
      : (locale === 'tr' ? 'Yük Sahibi' : 'Shipper');

    const SUPPORTED_LOCALES = [
      'en', 'tr', 'es', 'pt', 'fr', 'de', 'it', 'pl',
      'nl', 'ru', 'uk', 'zh', 'ja', 'hi', 'ar', 'fa',
      'ko', 'vi', 'id', 'bn', 'ur', 'th', 'ms', 'tl',
      'ro', 'sv', 'cs', 'hu', 'el', 'az', 'kk', 'he',
      'bg', 'hr', 'sr', 'sk', 'da', 'fi', 'no', 'uz',
      'ta', 'mr', 'ka', 'lt', 'lv', 'et', 'sl'
    ];

    const languagesAlternates: Record<string, string> = {};
    SUPPORTED_LOCALES.forEach((loc) => {
      languagesAlternates[loc] = `${SITE_URL}/${loc}/user/${id}`;
    });
    languagesAlternates['x-default'] = `${SITE_URL}/en/user/${id}`;

    return {
      title: `${name} - ${roleText}`,
      description: `${name} (${roleText}) profile. Rating: ${data.rating || 0}.`,
      alternates: { 
        canonical: `${SITE_URL}/${locale}/user/${id}`,
        languages: languagesAlternates
      },
      openGraph: {
        title: `${name} - Loadly ${roleText}`,
        url: `${SITE_URL}/${locale}/user/${id}`,
      },
    };
  } catch {
    return {
      title: 'User Profile',
      robots: { index: false, follow: false },
    };
  }
}

export default function Page() {
  return <PublicProfilePageClient />;
}
