/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },
  // SEO: redirect /index to /
  async redirects() {
    return [];
  },
};

export default nextConfig;
