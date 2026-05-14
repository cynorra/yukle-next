import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Auth-gated ve özel sayfaları indeksleme
        disallow: [
          '/panel',
          '/profil',
          '/mesajlar',
          '/favorilerim',
          '/yuk-olustur',
          '/ilan-duzenle',
          '/guzergahlarim',
          '/sifre-sifirla',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
