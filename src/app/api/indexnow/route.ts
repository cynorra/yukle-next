import { NextResponse } from 'next/server';
import { submitToIndexNow, INDEXNOW_KEY } from '@/lib/indexnow';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

/**
 * POST /api/indexnow
 * Submit URLs to all IndexNow-compatible search engines for instant indexing.
 *
 * Body: { urls: string[] } or { path: string } (auto-generates all locale variants)
 *
 * Called by blog/load creation crons after new content is published.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    let urls: string[] = [];

    if (body.urls && Array.isArray(body.urls)) {
      urls = body.urls;
    } else if (body.path) {
      // Auto-generate all locale URLs for this path
      const ALL_LOCALES = [
        'en', 'tr', 'es', 'pt', 'fr', 'de', 'it', 'pl', 'nl',
        'ru', 'uk', 'zh', 'ja', 'hi', 'ar', 'fa',
        'ko', 'vi', 'id', 'bn', 'ur', 'th', 'ms', 'tl',
        'ro', 'sv', 'cs', 'hu', 'el', 'az', 'kk', 'he',
        'bg', 'hr', 'sr', 'sk', 'da', 'fi', 'no', 'uz',
        'ta', 'mr', 'ka', 'lt', 'lv', 'et', 'sl'
      ];
      urls = ALL_LOCALES.map((locale) => `${SITE_URL}/${locale}${body.path}`);
    }

    if (!urls.length) {
      return NextResponse.json({ error: 'No URLs provided' }, { status: 400 });
    }

    await submitToIndexNow(urls);

    return NextResponse.json({
      success: true,
      submitted: urls.length,
      engines: ['Bing', 'Yandex', 'Naver', 'Seznam'],
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
}

/**
 * GET /api/indexnow?key=...
 * Verification endpoint – search engines may call this to verify key ownership.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (key === INDEXNOW_KEY) {
    return new Response(INDEXNOW_KEY, {
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  return NextResponse.json({ status: 'IndexNow API active' });
}
