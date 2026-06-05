import { MetadataRoute } from 'next';
import { createPublicClient } from '@/lib/supabase/public';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

const LOCALES = [
  'en', 'tr', 'es', 'pt', 'fr', 'de', 'it', 'pl', 'nl',
  'ru', 'uk', 'zh', 'ja', 'hi', 'ar', 'fa',
  'ko', 'vi', 'id', 'bn', 'ur', 'th', 'ms', 'tl',
  'ro', 'sv', 'cs', 'hu', 'el', 'az', 'kk', 'he',
  'bg', 'hr', 'sr', 'sk', 'da', 'fi', 'no', 'uz',
  'ta', 'mr', 'ka', 'lt', 'lv', 'et', 'sl'
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createPublicClient();

  // 1. Fetch active loads
  const { data: loads } = await supabase
    .from('loads')
    .select('id, created_at')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1000); // safety limit to prevent huge payload

  // 2. Fetch published blog posts
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, created_at, language')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(500);

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // 3. Static Pages for each locale
  const staticPaths = ['', '/marketplace', '/blog', '/login', '/register'];
  for (const locale of LOCALES) {
    for (const path of staticPaths) {
      sitemapEntries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === '' || path === '/marketplace' ? 'always' : 'weekly',
        priority: path === '' ? 1.0 : path === '/marketplace' ? 0.9 : 0.8,
      });
    }
  }

  // 4. Dynamic Loads for each locale
  if (loads) {
    for (const load of loads) {
      const lastMod = load.created_at ? new Date(load.created_at) : new Date();
      for (const locale of LOCALES) {
        sitemapEntries.push({
          url: `${SITE_URL}/${locale}/marketplace/${load.id}`,
          lastModified: lastMod,
          changeFrequency: 'daily',
          priority: 0.7,
        });
      }
    }
  }

  // 5. Dynamic Blog Posts
  if (posts) {
    for (const post of posts) {
      const lastMod = post.created_at ? new Date(post.created_at) : new Date();
      const locale = post.language && LOCALES.includes(post.language as any)
        ? post.language
        : 'en';
      sitemapEntries.push({
        url: `${SITE_URL}/${locale}/blog/${post.slug}`,
        lastModified: lastMod,
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }
  }

  return sitemapEntries;
}
