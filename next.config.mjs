/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    cpus: 2, // Limit build worker parallelism to reduce peak memory
  },
  images: {
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
        // brackets in one folder name (e.g. sitemap-loads-[page].xml is not
        // routable — it silently falls through to [locale]). Keep the clean
        // external URL and rewrite internally to a pure [page] segment.
        source: '/sitemap-loads-:page(\\d+).xml',
        destination: '/sitemap-loads/:page',
      },
      {
        // Same reasoning as sitemap-loads above, applied to the blog chunks.
        source: '/sitemap-blogs-:page(\\d+).xml',
        destination: '/sitemap-blogs/:page',
      },
      {
        // Same reasoning as sitemap-loads above, applied to the lane-page chunks.
        source: '/sitemap-routes-:page(\\d+).xml',
        destination: '/sitemap-routes/:page',
      },
      {
        // Same reasoning as sitemap-loads above, applied to the loads RSS feed chunks.
        source: '/loads-feed-:page(\\d+).xml',
        destination: '/loads-feed/:page',
      },
    ];
  },
  async redirects() {
    return [
      {
        // Legacy pre-rebrand page (Turkish-only, dead CTAs, broken canonical) — retire in favor of marketplace.
        source: '/:locale(en|tr|es|pt|fr|de|it|pl|nl|ru|uk|zh|ja|hi|ar|fa|ko|vi|id|bn|ur|th|ms|tl|ro|sv|cs|hu|el|az|kk|he|bg|hr|sr|sk|da|fi|no|uz|ta|mr|ka|lt|lv|et|sl)/load',
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
        ],
      },
      {
        source: '/:locale(en|tr|es|pt|fr|de|it|pl|nl|ru|uk|zh|ja|hi|ar|fa|ko|vi|id|bn|ur|th|ms|tl|ro|sv|cs|hu|el|az|kk|he|bg|hr|sr|sk|da|fi|no|uz|ta|mr|ka|lt|lv|et|sl)/:path*',
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
