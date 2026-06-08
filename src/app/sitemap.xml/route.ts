import { NextResponse } from 'next/server';
import { createPublicClient } from '@/lib/supabase/public';
import fs from 'fs';
import path from 'path';
import { getCachedSitemap, setCachedSitemap } from '@/lib/sitemapCache';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

const LOCALES = [
  'en', 'tr', 'es', 'pt', 'fr', 'de', 'it', 'pl', 'nl',
  'ru', 'uk', 'zh', 'ja', 'hi', 'ar', 'fa',
  'ko', 'vi', 'id', 'bn', 'ur', 'th', 'ms', 'tl',
  'ro', 'sv', 'cs', 'hu', 'el', 'az', 'kk', 'he',
  'bg', 'hr', 'sr', 'sk', 'da', 'fi', 'no', 'uz',
  'ta', 'mr', 'ka', 'lt', 'lv', 'et', 'sl'
] as const;

export async function GET() {
  // Optional cache check – return cached sitemap if fresh
  const cached = getCachedSitemap();
  if (cached) {
    return new Response(cached, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=600'
      }
    });
  }

  const supabase = createPublicClient();

  // 1. Fetch active loads
  const { data: loads } = await supabase
    .from('loads')
    .select('id, created_at')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    // No explicit limit – fetch all active loads

  // 2. Fetch all published blog posts (removed the tight limit)
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, created_at, language, cover_image')
    .eq('published', true)
    .order('created_at', { ascending: false });

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml"\n';
  xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';

  // Helper to escape XML characters
  const escapeXml = (unsafe: string) => {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  };

  // 3. Static Pages - dynamically discover all static routes under src/app/[locale]
  const staticPaths = getAllStaticPaths();
  for (const path of staticPaths) {
    for (const locale of LOCALES) {
      const url = `${SITE_URL}/${locale}${path}`;
      xml += '  <url>\n';
      xml += `    <loc>${escapeXml(url)}</loc>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += `    <priority>${path === '' ? '1.0' : path === '/marketplace' ? '0.9' : '0.8'}</priority>\n`;
      
      // Alternates
      for (const altLocale of LOCALES) {
        const altUrl = `${SITE_URL}/${altLocale}${path}`;
        xml += `    <xhtml:link rel="alternate" hreflang="${altLocale}" href="${escapeXml(altUrl)}"/>\n`;
      }
      // x-default
      const defaultUrl = `${SITE_URL}/en${path}`;
      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(defaultUrl)}"/>\n`;
      xml += '  </url>\n';
    }
  }

  // 4. Dynamic Loads
  if (loads) {
    for (const load of loads) {
      const lastMod = load.created_at ? new Date(load.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      for (const locale of LOCALES) {
        const url = `${SITE_URL}/${locale}/marketplace/${load.id}`;
        xml += '  <url>\n';
        xml += `    <loc>${escapeXml(url)}</loc>\n`;
        xml += `    <lastmod>${lastMod}</lastmod>\n`;
        xml += '    <changefreq>daily</changefreq>\n';
        xml += '    <priority>0.7</priority>\n';

        // Alternates
        for (const altLocale of LOCALES) {
          const altUrl = `${SITE_URL}/${altLocale}/marketplace/${load.id}`;
          xml += `    <xhtml:link rel="alternate" hreflang="${altLocale}" href="${escapeXml(altUrl)}"/>\n`;
        }
        // x-default
        const defaultUrl = `${SITE_URL}/en/marketplace/${load.id}`;
        xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(defaultUrl)}"/>\n`;
        xml += '  </url>\n';
      }
    }
  }

  // 5. Dynamic Blog Posts (Grouped by base slug to set alternate relations)
  if (posts && posts.length > 0) {
    // Group posts by baseSlug
    const groups: Record<string, typeof posts> = {};
    posts.forEach((post) => {
      const parts = post.slug.split('-');
      const baseSlug = parts.length > 1 ? parts.slice(0, -1).join('-') : post.slug;
      if (!groups[baseSlug]) {
        groups[baseSlug] = [];
      }
      groups[baseSlug].push(post);
    });

    for (const baseSlug in groups) {
      const groupPosts = groups[baseSlug];
      // Let's create sitemap entries for each available post in the group
      for (const post of groupPosts) {
        const locale = post.language || 'en';
        const url = `${SITE_URL}/${locale}/blog/${post.slug}`;
        const lastMod = post.created_at ? new Date(post.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

        xml += '  <url>\n';
        xml += `    <loc>${escapeXml(url)}</loc>\n`;
        xml += `    <lastmod>${lastMod}</lastmod>\n`;
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += '    <priority>0.6</priority>\n';
        // Add image tag if cover image exists
        if (post.cover_image) {
          xml += `    <image:image><image:loc>${escapeXml(post.cover_image)}</image:loc></image:image>\n`;
        }
        // Add alternate links pointing only to existing siblings in this group
        groupPosts.forEach((sibling) => {
          const sibLocale = sibling.language || 'en';
          const sibUrl = `${SITE_URL}/${sibLocale}/blog/${sibling.slug}`;
          xml += `    <xhtml:link rel="alternate" hreflang="${sibLocale}" href="${escapeXml(sibUrl)}"/>\n`;
        });

        // Set English or default as x-default
        const englishPost = groupPosts.find(p => p.language === 'en') || groupPosts[0];
        const defaultUrl = `${SITE_URL}/en/blog/${englishPost.slug}`;
        xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(defaultUrl)}"/>\n`;

        xml += '  </url>\n';
      }
    }
  }

  xml += '</urlset>\n';
  // Store generated sitemap in cache (valid for 1 hour)
  setCachedSitemap(xml);

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=600'
    }
  });
}

// Helper to collect static route paths (excluding dynamic segments)
function getAllStaticPaths(): string[] {
  const localeDir = path.join(process.cwd(), 'src', 'app', '[locale]');
  const routes: string[] = ['']; // include root

  function walk(dir: string, baseRoute: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        // Skip API, files or folders that contain '[' (dynamic) or start with '_' (private)
        if (entry.name.startsWith('api') || entry.name.includes('[') || entry.name.startsWith('_')) {
          continue;
        }
        const routeSegment = `/${entry.name}`;
        const fullPath = baseRoute + routeSegment;
        // If the directory contains a page.tsx (or page.js) treat as a route
        const hasPage = fs.existsSync(path.join(dir, entry.name, 'page.tsx')) ||
                       fs.existsSync(path.join(dir, entry.name, 'page.jsx')) ||
                       fs.existsSync(path.join(dir, entry.name, 'page.js'));
        if (hasPage) {
          routes.push(fullPath);
        }
        // Recurse into subfolders to capture nested static routes
        walk(path.join(dir, entry.name), fullPath);
      }
    }
  }

  try {
    walk(localeDir, '');
  } catch (e) {
    return [];
  }
  return routes;
}
