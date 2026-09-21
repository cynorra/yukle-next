import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Loadly — Freight & Logistics Guides',
    short_name: 'Loadly',
    description: 'Logistics and freight industry guides, route insights, and practical shipping information.',
    start_url: '/en',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#F5A623',
    lang: 'en',
    dir: 'ltr',
    orientation: 'portrait-primary',
    categories: ['business', 'productivity', 'transportation'],
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    screenshots: [],
  };
}
