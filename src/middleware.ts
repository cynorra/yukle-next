import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const SUPPORTED_LOCALES = [
  'en', 'tr', 'es', 'pt', 'fr', 'de', 'it', 'pl',
  'nl', 'ru', 'uk', 'zh', 'ja', 'hi', 'ar', 'fa',
  'ko', 'vi', 'id', 'bn', 'ur', 'th', 'ms', 'tl',
  'ro', 'sv', 'cs', 'hu', 'el', 'az', 'kk', 'he',
  'bg', 'hr', 'sr', 'sk', 'da', 'fi', 'no', 'uz',
  'ta', 'mr', 'ka', 'lt', 'lv', 'et', 'sl'
];

const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

// Known search/AI crawler user-agents — never rate-limit these, or deep crawls
// (47 locales × static pages + listings) will trip the limit and get 429'd,
// which shows up in Search Console as crawl errors and can suppress indexing.
const CRAWLER_UA_PATTERN = /bot|crawl|spider|slurp|googlebot|bingbot|yandex|baidu|duckduck|applebot|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|discordbot|pinterest|semrush|ahrefs|gptbot|chatgpt-user|claudebot|claude-web|anthropic-ai|perplexitybot|amazonbot|bytespider|ccbot|diffbot|petalbot|mojeekbot|seznambot|coccocbot/i;

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Basic Rate Limiting
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const userAgent = request.headers.get('user-agent') || '';
  const isCrawler = CRAWLER_UA_PATTERN.test(userAgent);
  const now = Date.now();

  if (ip !== 'unknown' && !isCrawler) {
    let record = rateLimitMap.get(ip);
    if (!record) {
      record = { count: 1, lastReset: now };
      rateLimitMap.set(ip, record);
    } else {
      if (now - record.lastReset > 60000) {
        record.count = 1;
        record.lastReset = now;
      } else {
        record.count++;
        if (record.count > 150) { // 150 req / min limit
          return new NextResponse('Too Many Requests - Rate Limit Exceeded', { status: 429 });
        }
      }
    }
    // Prevent memory leak in edge isolates
    if (rateLimitMap.size > 10000) rateLimitMap.clear();
  }
  // Bypass middleware for sitemap generation
  if (pathname === '/sitemap.xml') {
    return NextResponse.next();
  }

  // 1. Exclude public assets, internal paths, API routes, and OAuth callbacks
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico' ||
    pathname === '/logo.png'
  ) {
    return NextResponse.next();
  }

  // 2. Check if path starts with a supported locale
  const pathnameHasLocale = SUPPORTED_LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    // Determine language preference
    let locale = 'en';

    // A. Check cookie first
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
    if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)) {
      locale = cookieLocale;
    } else {
      // B. Parse Accept-Language header
      const acceptLang = request.headers.get('accept-language');
      if (acceptLang) {
        const preferred = acceptLang
          .split(',')
          .map((lang) => lang.split(';')[0].trim().substring(0, 2))
          .find((lang) => SUPPORTED_LOCALES.includes(lang));
        if (preferred) {
          locale = preferred;
        }
      }
    }

    // Redirect to the URL prefixed with the detected locale
    const redirectUrl = new URL(`/${locale}${pathname}${search}`, request.url);
    const response = NextResponse.redirect(redirectUrl);
    
    // Set cookie for future visits
    response.cookies.set('NEXT_LOCALE', locale, { path: '/' });
    return response;
  }

  // 3. Run Supabase auth session update/refresh
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all pathnames except those starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - logo.png (logo file)
     * - file extensions (png, jpg, jpeg, gif, svg, webp)
     */
    '/((?!api|_next/static|_next/image|favicon\.ico|logo\.png|sitemap\.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
