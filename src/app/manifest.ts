import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Loadly — Freight & Logistics Guides',
    short_name: 'Loadly',
    description: 'Logistics and freight industry guides, route insights, and practical shipping information, published in 55 languages.',
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
