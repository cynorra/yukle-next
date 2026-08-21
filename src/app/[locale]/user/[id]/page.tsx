import type { Metadata } from 'next';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import { createPublicClient } from '@/lib/supabase/public';
import { PublicProfilePageClient } from './PublicProfilePageClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

export const revalidate = 86400;

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

    // roleText only actually differs between en/tr (see above) — every other
    // locale renders the English copy verbatim, so self-canonicalizing all 47
    // just creates near-duplicate profile URLs. Same fix as the shipping-routes
    // hub pages and marketplace/[id]: canonicalize untranslated locales to /en.
    const translatedLocales = ['en', 'tr'];
    const canonicalLocale = translatedLocales.includes(locale) ? locale : 'en';
    const languagesAlternates: Record<string, string> = {};
    translatedLocales.forEach((loc) => {
      languagesAlternates[loc] = `${SITE_URL}/${loc}/user/${id}`;
    });
    languagesAlternates['x-default'] = `${SITE_URL}/en/user/${id}`;

    return {
      title: `${name} - ${roleText}`,
      description: `${name} (${roleText}) profile. Rating: ${data.rating || 0}.`,
      alternates: {
        canonical: `${SITE_URL}/${canonicalLocale}/user/${id}`,
        languages: languagesAlternates
      },
      openGraph: {
        title: `${name} - Loadly ${roleText}`,
        url: `${SITE_URL}/${canonicalLocale}/user/${id}`,
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
  const { id, locale } = await params;
  const { profile, reviews, loads } = await getProfileData(id);

  if (!profile) notFound();

  // Loadly is a B2B freight marketplace — every account (driver or shipper)
  // acts as a business entity, not a private consumer, so Organization is the
  // correct schema.org type here. Google's review-snippet guidelines don't
  // support rating markup on plain Person profiles, so `aggregateRating`/
  // `review` are only emitted when there's a real rating to back them —
  // an empty/zero AggregateRating is itself a structured-data misuse flag.
  const orgName = profile.company_name || profile.full_name;
  const profileJsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: orgName,
    url: `${SITE_URL}/${locale}/user/${id}`,
    ...(profile.avatar_url ? { logo: profile.avatar_url } : {}),
  };
  if (profile.rating != null && reviews.length > 0) {
    profileJsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: profile.rating,
      reviewCount: reviews.length,
      bestRating: 5,
      worstRating: 1,
    };
    profileJsonLd.review = reviews.map((r) => ({
      '@type': 'Review',
      reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5, worstRating: 1 },
      author: { '@type': 'Person', name: r.reviewer?.full_name || 'Loadly User' },
      datePublished: r.created_at,
      ...(r.comment ? { reviewBody: r.comment } : {}),
    }));
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd) }}
      />
      <PublicProfilePageClient profile={profile} reviews={reviews} loads={loads} />
    </>
  );
}
