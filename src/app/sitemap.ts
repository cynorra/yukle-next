import type { MetadataRoute } from 'next';

// Deprecated: Use src/app/sitemap.xml/route.ts for XML sitemap with hreflang alternates.
// This file returns an empty array to satisfy Next.js's sitemap convention
// without generating any entries (the real sitemap is in sitemap.xml/route.ts).

export default function sitemap(): MetadataRoute.Sitemap {
  return [];
}
