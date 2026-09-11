import { NextResponse } from 'next/server';
import { SITE_URL } from '@/lib/sitemap-utils';

// Static, not ISR: this route always redirects to the same fixed URL, so
// there's nothing to revalidate. A `revalidate` export here previously made
// Next.js try to ISR-cache the redirect response, but a redirect has an
// empty body - its cache-entry size calculates to 0, which Next's LRU cache
// rejects ("calculateSize returned 0, but size must be > 0"), logging that
// error on every single request in production. `force-static` builds this
// once and serves it from the full route cache instead, with no ISR/ISR-cache
// interaction at all.
export const dynamic = 'force-static';

export async function GET() {
  return NextResponse.redirect(`${SITE_URL}/sitemap-blogs-1.xml`, { status: 301 });
}
