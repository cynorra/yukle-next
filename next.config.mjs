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
