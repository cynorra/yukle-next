import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const SUPPORTED_LOCALES = [
  'en', 'tr', 'es', 'pt', 'fr', 'de', 'it', 'pl',
  'nl', 'ru', 'uk', 'zh', 'ja', 'hi', 'ar', 'fa',
  'ko', 'vi', 'id', 'bn', 'ur', 'th', 'ms', 'tl',
  'ro', 'sv', 'cs', 'hu', 'el', 'az', 'kk', 'he',
  'bg', 'hr', 'sr', 'sk', 'da', 'fi', 'no', 'uz',
  'ta', 'mr', 'ka', 'lt', 'lv', 'et', 'sl', 'kn', 'te', 'pa', 'gu', 'ml', 'sw', 'ne', 'si'
];

const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

// Only these route segments actually read/mutate an authenticated session
// server-side. Every other locale page (marketplace, blog, shipping-routes,
// the homepage, etc.) is public and doesn't need a per-request Supabase
// session refresh — running updateSession() on those too meant every crawler
// hit (47 locales × a huge SEO page surface) was paying for a Supabase call
// it never used, which was a large chunk of the function-invocation volume
// that got the site paused for exceeding Netlify's Functions quota.
const AUTH_REQUIRED_SEGMENTS = new Set([
  'dashboard', 'profile', 'messages', 'favorites', 'create-load',
]);

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
  // Bypass middleware for sitemaps, feeds, robots.txt, and llms.txt
  if (
    pathname.startsWith('/sitemap') ||
    pathname.startsWith('/loads-feed') ||
    pathname === '/robots.txt' ||
    pathname.startsWith('/llms')
  ) {
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
    // (avoid appending a trailing slash for the root path so we don't trigger
    // a second trailing-slash-normalization redirect on the hosting platform)
    const suffix = pathname === '/' ? '' : pathname;
    const redirectUrl = new URL(`/${locale}${suffix}${search}`, request.url);
    const response = NextResponse.redirect(redirectUrl);
    
    // Set cookie for future visits
    response.cookies.set('NEXT_LOCALE', locale, { path: '/' });
    return response;
  }

  // 3. Run Supabase auth session update/refresh — only on routes that
  // actually need an authenticated session, and never for crawlers.
  const routeSegment = pathname.split('/')[2] || '';
  if (!isCrawler && AUTH_REQUIRED_SEGMENTS.has(routeSegment)) {
    return await updateSession(request);
  }
  return NextResponse.next();
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
    '/((?!api|_next/static|_next/image|favicon\\.ico|logo\\.png|robots\\.txt|sitemap.*\\.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
