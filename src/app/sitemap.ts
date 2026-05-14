import type { MetadataRoute } from 'next';
import { createPublicClient } from '@/lib/supabase/public';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

// Saatlik ISR - sitemap dinamik ama cache'li
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Statik sayfalar
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/pazar`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/yuk-bulma`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/yuk-ilani`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/kayit`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/giris`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/kvkk`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/gizlilik`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/kullanim-sartlari`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/reklam`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  // Dinamik: ilanlar + blog yazıları
  let dynamicPages: MetadataRoute.Sitemap = [];

  try {
    const supabase = createPublicClient();

    // Aktif ilanlar
    const { data: loads } = await supabase
      .from('loads')
      .select('id, created_at')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(5000);

    if (loads) {
      dynamicPages = dynamicPages.concat(
        loads.map((load) => ({
          url: `${SITE_URL}/pazar/${load.id}`,
          lastModified: new Date(load.created_at),
          changeFrequency: 'daily' as const,
          priority: 0.7,
        }))
      );
    }

    // Blog yazıları
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('published', true)
      .order('updated_at', { ascending: false });

    if (posts) {
      dynamicPages = dynamicPages.concat(
        posts.map((post) => ({
          url: `${SITE_URL}/blog/${post.slug}`,
          lastModified: new Date(post.updated_at),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        }))
      );
    }
  } catch (err) {
    console.error('[sitemap] dynamic pages fetch error:', err);
  }

  return [...staticPages, ...dynamicPages];
}
