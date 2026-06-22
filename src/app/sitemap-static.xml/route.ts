import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
  SITE_URL, ALL_LOCALES, escapeXml, generateAlternates,
  URLSET_HEADER, SITEMAP_HEADERS,
} from '@/lib/sitemap-utils';

export const revalidate = 86400; // ISR: regenerate every 24 hours

export async function GET() {
  let xml = URLSET_HEADER;

  const staticPaths = getAllStaticPaths();

  for (const routePath of staticPaths) {
    for (const locale of ALL_LOCALES) {
      const url = `${SITE_URL}/${locale}${routePath}`;
      xml += '  <url>\n';
      xml += `    <loc>${escapeXml(url)}</loc>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += `    <priority>${routePath === '' ? '1.0' : routePath === '/marketplace' ? '0.9' : routePath === '/blog' ? '0.85' : '0.8'}</priority>\n`;
      xml += generateAlternates((loc) => `${SITE_URL}/${loc}${routePath}`);
      xml += '  </url>\n';
    }
  }

  xml += '</urlset>\n';

  return new Response(xml, { headers: SITEMAP_HEADERS });
}

/** Walk the [locale] directory to discover all static page routes */
function getAllStaticPaths(): string[] {
  const localeDir = path.join(process.cwd(), 'src', 'app', '[locale]');
  const routes: string[] = ['']; // root homepage

  function walk(dir: string, baseRoute: string) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (
          entry.name.startsWith('api') ||
          entry.name.includes('[') ||
          entry.name.startsWith('_')
        ) {
          continue;
        }
        const routeSegment = `/${entry.name}`;
        const fullPath = baseRoute + routeSegment;
        const hasPage =
          fs.existsSync(path.join(dir, entry.name, 'page.tsx')) ||
          fs.existsSync(path.join(dir, entry.name, 'page.jsx')) ||
          fs.existsSync(path.join(dir, entry.name, 'page.js'));
        if (hasPage) {
          routes.push(fullPath);
        }
        walk(path.join(dir, entry.name), fullPath);
      }
    }
  }

  try {
    walk(localeDir, '');
  } catch {
    // Fallback
  }
  return routes;
}
