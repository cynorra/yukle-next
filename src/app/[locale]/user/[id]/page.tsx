import type { Metadata } from 'next';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import { createPublicClient } from '@/lib/supabase/public';
import { PublicProfilePageClient } from './PublicProfilePageClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

export const revalidate = 86400;

const SUPPORTED_LOCALES = [
  'en', 'tr', 'es', 'pt', 'fr', 'de', 'it', 'pl',
  'nl', 'ru', 'uk', 'zh', 'ja', 'hi', 'ar', 'fa',
  'ko', 'vi', 'id', 'bn', 'ur', 'th', 'ms', 'tl',
  'ro', 'sv', 'cs', 'hu', 'el', 'az', 'kk', 'he',
  'bg', 'hr', 'sr', 'sk', 'da', 'fi', 'no', 'uz',
  'ta', 'mr', 'ka', 'lt', 'lv', 'et', 'sl'
];

const getProfileData = cache(async (id: string) => {
  const supabase = createPublicClient();
  const [profileRes, reviewsRes, loadsRes] = await Promise.all([
    supabase.from('public_profiles').select('*').eq('id', id).maybeSingle(),
    supabase
      .from('reviews')
      .select('*, reviewer:public_profiles!reviews_reviewer_id_fkey(id, full_name, avatar_url)')
      .eq('reviewed_id', id)
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('loads')
      .select('id, title, title_translations, status, origin_city, destination_city, created_at')
      .eq('shipper_id', id)
      .in('status', ['active', 'completed'])
      .order('created_at', { ascending: false })
      .limit(10),
  ]);

  return {
    profile: profileRes.data,
    reviews: reviewsRes.data || [],
    loads: loadsRes.data || [],
  };
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}): Promise<Metadata> {
  const { id, locale } = await params;
  try {
    const { profile: data } = await getProfileData(id);

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

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;
  const { profile, reviews, loads } = await getProfileData(id);

  if (!profile) notFound();

  return <PublicProfilePageClient profile={profile} reviews={reviews} loads={loads} />;
}
