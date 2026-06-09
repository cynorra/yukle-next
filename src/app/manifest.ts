import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Loadly — Global Freight Marketplace',
    short_name: 'Loadly',
    description: 'International freight marketplace connecting shippers and carriers worldwide. 47 languages, 190+ countries.',
    start_url: '/en',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#F5A623',
    lang: 'en',
    dir: 'ltr',
    orientation: 'portrait-primary',
    categories: ['business', 'productivity', 'transportation'],
    icons: [
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    screenshots: [],
  };
}
