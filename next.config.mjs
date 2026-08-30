/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    cpus: 2, // Limit build worker parallelism to reduce peak memory
  },
  images: {
    // Cloudflare Pages has no built-in Next.js image optimizer — all images
    // here are already third-party remote URLs (see remotePatterns below),
    // so optimization value was already marginal.
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'loremflickr.com' },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/.well-known/llms.txt',
        destination: '/llms.txt',
      },
      {
        // Next.js App Router dynamic segments can't mix static text with
        // brackets in one folder name (e.g. sitemap-blogs-[page].xml is not
        // routable — it silently falls through to [locale]). Keep the clean
        // external URL and rewrite internally to a pure [page] segment.
        // (The equivalent rewrites for sitemap-loads/sitemap-routes/loads-feed
        // were removed along with those routes — the marketplace is no longer
        // part of the site's public/indexed surface.)
        source: '/sitemap-blogs-:page(\\d+).xml',
        destination: '/sitemap-blogs/:page',
      },
      {
        // Same reasoning as sitemap-blogs above, applied to the per-locale blog RSS feed chunks.
        source: '/:locale(en|tr|es|pt|fr|de|it|pl|nl|ru|uk|zh|ja|hi|ar|fa|ko|vi|id|bn|ur|th|ms|tl|ro|sv|cs|hu|el|az|kk|he|bg|hr|sr|sk|da|fi|no|uz|ta|mr|ka|lt|lv|et|sl|kn|te|pa|gu|ml|sw|ne|si)/feed-:page(\\d+).xml',
        destination: '/:locale/feed/:page',
      },
    ];
  },
  async redirects() {
    return [
      {
        // Legacy pre-rebrand page (Turkish-only, dead CTAs, broken canonical) — retire in favor of marketplace.
        source: '/:locale(en|tr|es|pt|fr|de|it|pl|nl|ru|uk|zh|ja|hi|ar|fa|ko|vi|id|bn|ur|th|ms|tl|ro|sv|cs|hu|el|az|kk|he|bg|hr|sr|sk|da|fi|no|uz|ta|mr|ka|lt|lv|et|sl|kn|te|pa|gu|ml|sw|ne|si)/load',
        destination: '/:locale/marketplace',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            // Deliberately permissive on script/connect/frame/img sources —
            // this is scoped to what AdSense + GA4 + Supabase + the wide-open
            // remote image patterns above actually need, not a tight lockdown.
            // Getting this wrong would silently break ads/analytics/images,
            // which matters more here than a stricter policy. object-src and
            // frame-ancestors are the two directives worth being strict on.
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googlesyndication.com https://*.googletagmanager.com https://*.google-analytics.com https://*.googleadservices.com https://*.doubleclick.net https://*.google.com https://*.gstatic.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https: http:",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.google-analytics.com https://*.analytics.google.com https://*.googlesyndication.com https://*.doubleclick.net https://*.googleadservices.com https://*.google.com",
              "frame-src 'self' https://*.googlesyndication.com https://*.doubleclick.net https://*.google.com",
              "object-src 'none'",
              "base-uri 'self'",
              "frame-ancestors 'self'",
            ].join('; '),
          },
        ],
      },
      {
        source: '/:locale(en|tr|es|pt|fr|de|it|pl|nl|ru|uk|zh|ja|hi|ar|fa|ko|vi|id|bn|ur|th|ms|tl|ro|sv|cs|hu|el|az|kk|he|bg|hr|sr|sk|da|fi|no|uz|ta|mr|ka|lt|lv|et|sl|kn|te|pa|gu|ml|sw|ne|si)/:path*',
        headers: [
          {
            key: 'Link',
            value: [
              '<https://loadlyapp.com>; rel="preconnect"',
              '<https://fonts.googleapis.com>; rel="preconnect"',
            ].join(', '),
          },
        ],
      },
      {
        source: '/:sitemap(sitemap.xml|sitemap-static.xml|sitemap-loads.xml|sitemap-blogs.xml|sitemap-routes.xml)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=3600' },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, s-maxage=86400' },
        ],
      },
      {
        source: '/:file(llms.txt|llms-full.txt)',
        headers: [
          { key: 'Content-Type', value: 'text/plain; charset=utf-8' },
          { key: 'Cache-Control', value: 'public, max-age=86400, s-maxage=86400' },
        ],
      },
    ];
  },
  // Workaround for EISDIR: illegal operation on a directory, readlink on Windows exFAT drives
  webpack: (config) => {
    config.resolve.symlinks = false;
    if (config.cache) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
