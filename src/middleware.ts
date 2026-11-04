import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { BLOG_REDIRECTS } from '@/lib/blog-redirects';

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
const CRAWLER_UA_PATTERN = /bot|crawl|spider|slurp|googlebot|bingbot|yandex|baidu|duckduck|applebot|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|discordbot|pinterest|semrush|ahrefs|gptbot|chatgpt-user|claudebot|claude-web|anthropic-ai|perplexitybot|amazonbot|bytespider|ccbot|diffbot|petalbot|mojeekbot|seznambot|coccocbot|google|mediapartners|lighthouse|inspectiontool|pagespeed|bing|msnbot/i;

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
const LEGACY_PAGE_SLUGS: Record<string, string> = {
  '/iletisim': '/contact',
  '/gizlilik-politikasi': '/privacy',
  '/hakkimizda': '/about',
};

function legacyLocalePath(rest: string): string {
  if (LEGACY_PAGE_SLUGS[rest]) return LEGACY_PAGE_SLUGS[rest];
  const m = rest.match(/^\/blog\/([^/]+)$/);
  if (!m) return rest;
  // No English sibling derivable (older native-language slug) → blog index.
  return `/blog/${englishBlogSlug(m[1]) ?? ''}`.replace(/\/$/, '');
}


// ── 410 Gone support ─────────────────────────────────────────────────────────
// Retired URL families (non-English locale prefixes, legacy un-prefixed blog /
// marketplace paths, blog archive pages, blog slugs that are no longer published)
// answer 410 instead of 301-ing to a generic page: a redirect to an unrelated page
// is treated by Google as a soft 404 and keeps the dead URL in "crawled, not indexed".
const goneResponse = () =>
  new NextResponse('Gone', {
    status: 410,
    headers: { 'content-type': 'text/plain; charset=utf-8', 'x-robots-tag': 'noindex' },
  });

// Live (published) English slugs, read from the database — never hard-coded, so a
// newly published guide is not 410'd. Cached per server process.
const LIVE_SLUGS_TTL_MS = 5 * 60 * 1000;
const LIVE_SLUGS_MIN_REFRESH_MS = 30 * 1000;
let liveSlugs: { set: Set<string>; at: number } | null = null;

async function getLiveSlugs(forceRefresh = false): Promise<Set<string> | null> {
  const now = Date.now();
  if (liveSlugs) {
    const age = now - liveSlugs.at;
    if (age < LIVE_SLUGS_MIN_REFRESH_MS || (!forceRefresh && age < LIVE_SLUGS_TTL_MS)) return liveSlugs.set;
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return liveSlugs?.set ?? null;
  try {
    const res = await fetch(
      `${url}/rest/v1/blog_posts?select=slug&published=eq.true&language=eq.en&limit=1000`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(4000) }
    );
    if (!res.ok) return liveSlugs?.set ?? null;
    const rows: Array<{ slug: string }> = await res.json();
    if (!Array.isArray(rows) || rows.length === 0) return liveSlugs?.set ?? null; // never 410 everything on an empty/odd answer
    liveSlugs = { set: new Set(rows.map((r) => r.slug)), at: now };
    return liveSlugs.set;
  } catch {
    return liveSlugs?.set ?? null; // fail open: let the page decide
  }
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
  // Next.js <Link> prefetches and RSC navigations fire many background requests per page
  // (a blog index has 60 links); they are not abusive traffic and must not count toward the limit.
  const isPrefetch = request.headers.has('next-router-prefetch') || request.headers.has('rsc');
  const isCrawler = CRAWLER_UA_PATTERN.test(userAgent) || isPrefetch;
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
        if (record.count > 300) { // 300 req / min limit
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

  // "/EN", "/En/blog" and similar: normalise the language prefix to lowercase in one hop
  // instead of treating it as a bare path and prefixing "/en" (which produced /en/EN, a 404).
  const upperMatch = pathname.match(/^\/([A-Za-z]{2})(\/.*)?$/);
  if (upperMatch && upperMatch[1] !== upperMatch[1].toLowerCase() && SUPPORTED_LOCALES.includes(upperMatch[1].toLowerCase())) {
    return NextResponse.redirect(new URL(`/${upperMatch[1].toLowerCase()}${upperMatch[2] || ''}${search}`, origin), 301);
  }

  const localeMatch = pathname.match(/^\/([a-z]{2})(\/.*)?$/);
  const urlLocale = localeMatch && SUPPORTED_LOCALES.includes(localeMatch[1]) ? localeMatch[1] : null;

  if (!urlLocale) {
    // Bare path (e.g. "/", "/blog", "/marketplace/123") — always English.
    // (avoid appending a trailing slash for the root path so we don't trigger
    // a second trailing-slash-normalization redirect on the hosting platform)
    if (/^\/(blog|marketplace)\/.+/.test(pathname)) return goneResponse(); // legacy un-prefixed deep URLs
    const suffix = pathname === '/' ? '' : pathname;
    return NextResponse.redirect(new URL(`/${ACTIVE_LOCALE}${suffix}${search}`, origin), 301);
  }

  if (urlLocale !== ACTIVE_LOCALE) {
    const rest = localeMatch![2] || '';
    // Locale home and the three legacy Turkish page slugs still have a real English
    // equivalent -> 301. Every other deep URL (blog, marketplace, routes ...) is gone.
    if (rest === '' || rest === '/' || LEGACY_PAGE_SLUGS[rest]) {
      return NextResponse.redirect(new URL(`/${ACTIVE_LOCALE}${LEGACY_PAGE_SLUGS[rest] || ''}${search}`, origin), 301);
    }
    return goneResponse();
  }

  // English blog archive pages were removed (the archive route returned 500).
  if (/^\/en\/blog\/archive(\/|$)/.test(pathname)) return goneResponse();

  // 3. Blog slugs are minted as "{base-slug}-{language}", so a translated
  // slug under /en/blog/ (e.g. /en/blog/foo-de) maps to its English sibling
  // "foo-en" from the URL alone — no DB call.
  const blogSlugMatch = pathname.match(/^\/en\/blog\/([^/]+)\/?$/);
  if (blogSlugMatch) {
    const slug = blogSlugMatch[1];
    const mapped = englishBlogSlug(slug);
    let live = await getLiveSlugs();
    if (live && !live.has(slug)) live = await getLiveSlugs(true); // maybe just published
    // Explicit one-hop redirects for retired slugs that have a topical replacement.
    const target = BLOG_REDIRECTS[mapped ?? slug];
    if (target) {
      return NextResponse.redirect(new URL(`/en/blog/${target}${search}`, origin), 301);
    }
    if (live && !live.has(slug)) {
      // Translated sibling of a live guide ("foo-de" -> "foo-en") keeps its redirect.
      if (mapped && mapped !== slug && live.has(mapped)) {
        return NextResponse.redirect(new URL(`/en/blog/${mapped}${search}`, origin), 301);
      }
      return goneResponse();
    }
    if (!live && mapped && mapped !== slug) {
      return NextResponse.redirect(new URL(`/en/blog/${mapped}${search}`, origin), 301); // DB unreachable: old behaviour
    }
  }

  // Marketplace pages are scraped third-party listings: keep them out of the index at
  // the HTTP level (works without JS).
  if (/^\/en\/marketplace(\/|$)/.test(pathname)) {
    const res = NextResponse.next();
    res.headers.set('x-robots-tag', 'noindex');
    return res;
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
