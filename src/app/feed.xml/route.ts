import { NextResponse } from 'next/server';
import { SITE_URL } from '@/lib/sitemap-utils';

export const revalidate = 86400;

export async function GET() {
  return NextResponse.redirect(`${SITE_URL}/en/feed.xml`, { status: 301 });
}
