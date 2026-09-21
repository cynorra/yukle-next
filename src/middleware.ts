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

// The only locale served. Everything else redirects here (see step 2 below).
const ACTIVE_LOCALE = 'en';

/**
 * Maps a translated blog slug ("foo-bar-de") to the English sibling
 * ("foo-bar-en"), which is how every English post is minted. Returns null for
 * slugs with no recognisable locale suffix (older native-language posts).
 */
function englishBlogSlug(slug: string): string | null {
  const parts = slug.split('-');
  const last = parts[parts.length - 1];
  if (parts.length < 2 || !SUPPORTED_LOCALES.includes(last)) return null;
  return last === ACTIVE_LOCALE ? slug : `${parts.slice(0, -1).join('-')}-${ACTIVE_LOCALE}`;
}

/** Path after the locale prefix, rewritten for the English site. */
function legacyLocalePath(rest: string): string {
  const m = rest.match(/^\/blog\/([^/]+)$/);
  if (!m) return rest;
  // No English sibling derivable (older native-language slug) → blog index.
  return `/blog/${englishBlogSlug(m[1]) ?? ''}`.replace(/\/$/, '');
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Standalone `node server.js` doesn't see the public hostname on
  // request.url/request.nextUrl (it reflects the internal listen address,
  // e.g. localhost:3000, even behind a reverse proxy) — build absolute
  // redirect URLs from the forwarded headers instead, or every redirect
  // below would send visitors to https://localhost:3000/...
  const forwardedHost = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
  const origin = forwardedHost ? `${forwardedProto}://${forwardedHost}` : request.url;

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
  // Bypass middleware for sitemaps, robots.txt, and llms.txt
  if (
    pathname.startsWith('/sitemap') ||
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

  // 2. English-only site (since 2026-09-19). Every non-English locale prefix
  // is a permanent redirect to its English equivalent, so previously indexed
  // /de/..., /tr/... etc. URLs consolidate onto /en instead of 404ing, and no
  // locale other than 'en' ever reaches a page/ISR entry. The locale-aware
  // routing/dictionaries stay in the codebase (only the redirect gates them),
  // so re-enabling a language later is a one-line change, not a rebuild.
  // Sole exception: the Turkish KVKK disclosure (Law No. 6698 art. 10 requires the
  // data-subject notice in a language Turkish users understand). It is served
  // noindex, is not in any sitemap and is only linked from /en/privacy.
  if (pathname === '/tr/privacy-policy') {
    return NextResponse.next();
  }

  const localeMatch = pathname.match(/^\/([a-z]{2})(\/.*)?$/);
  const urlLocale = localeMatch && SUPPORTED_LOCALES.includes(localeMatch[1]) ? localeMatch[1] : null;

  if (!urlLocale) {
    // Bare path (e.g. "/", "/blog", "/marketplace/123") — always English.
    // (avoid appending a trailing slash for the root path so we don't trigger
    // a second trailing-slash-normalization redirect on the hosting platform)
    const suffix = pathname === '/' ? '' : pathname;
    return NextResponse.redirect(new URL(`/${ACTIVE_LOCALE}${suffix}${search}`, origin), 301);
  }

  if (urlLocale !== ACTIVE_LOCALE) {
    const rest = localeMatch![2] || '';
    return NextResponse.redirect(new URL(`/${ACTIVE_LOCALE}${legacyLocalePath(rest)}${search}`, origin), 301);
  }

  // 3. Blog slugs are minted as "{base-slug}-{language}", so a translated
  // slug under /en/blog/ (e.g. /en/blog/foo-de) maps to its English sibling
  // "foo-en" from the URL alone — no DB call.
  const blogSlugMatch = pathname.match(/^\/en\/blog\/([^/]+)$/);
  if (blogSlugMatch) {
    const mapped = englishBlogSlug(blogSlugMatch[1]);
    if (mapped && mapped !== blogSlugMatch[1]) {
      return NextResponse.redirect(new URL(`/en/blog/${mapped}${search}`, origin), 301);
    }
  }

  // 4. Run Supabase auth session update/refresh — only on routes that
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
