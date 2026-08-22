import { NextResponse } from 'next/server';
import { SITE_URL } from '@/lib/sitemap-utils';
import { BLOG_TRANSLATIONS } from '@/utils/blogTranslations';
import type { Locale } from '@/utils/translations';

export const revalidate = 86400;

interface RouteParams {
  params: Promise<{ locale: string }>;
}

export async function GET(_req: Request, { params }: RouteParams) {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale in BLOG_TRANSLATIONS) ? (rawLocale as Locale) : 'en';
  return NextResponse.redirect(`${SITE_URL}/${locale}/feed-1.xml`, { status: 301 });
}
