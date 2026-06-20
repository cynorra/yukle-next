/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    cpus: 2, // Limit build worker parallelism to reduce peak memory
  },
  images: {
    remotePatterns: [
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
    ];
  },
  async redirects() {
    return [];
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
        source: '/:sitemap(sitemap.xml|sitemap-static.xml|sitemap-loads.xml|sitemap-blogs.xml)',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex' },
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
