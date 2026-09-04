import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { TRANSLATIONS } from '@/utils/translations';

function checkSecret(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
    || request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  return !!process.env.REVALIDATE_SECRET && secret === process.env.REVALIDATE_SECRET;
}

// Called by scripts/blog-generator.js right after it publishes - lets the homepage,
// blog listing, and the new post's own page pick up the change immediately instead
// of waiting for their time-based `revalidate` window (which exists as a fallback
// ceiling, not the primary freshness mechanism - see [locale]/page.tsx's comment).
export async function POST(request: NextRequest) {
  if (!checkSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { posts } = (await request.json()) as { posts?: { language?: string; slug?: string }[] };
  const locales = new Set<string>();
  for (const p of posts || []) {
    if (!p.language || !p.slug) continue;
    revalidatePath(`/${p.language}/blog/${p.slug}`, 'page');
    locales.add(p.language);
  }
  for (const locale of locales) {
    revalidatePath(`/${locale}`, 'page');
    revalidatePath(`/${locale}/blog`, 'page');
  }

  return NextResponse.json({ revalidated: true, locales: [...locales], posts: posts?.length || 0 });
}

// Manual/admin fallback - revalidates the homepage + blog listing for every locale
// (not individual post pages, there could be thousands - use POST with specific
// posts for that).
export async function GET(request: NextRequest) {
  if (!checkSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const locales = Object.keys(TRANSLATIONS);
  for (const locale of locales) {
    revalidatePath(`/${locale}`, 'page');
    revalidatePath(`/${locale}/blog`, 'page');
  }

  return NextResponse.json({ revalidated: true, locales, at: new Date().toISOString() });
}
