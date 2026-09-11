import { NextResponse } from 'next/server';
import { SITE_URL } from '@/lib/sitemap-utils';

// Deliberately opted OUT of Next's caching layer entirely (not ISR via
// `revalidate`, and not `force-static` either - tried that first, it still
// hit the same bug). A redirect Response has an empty body, so whenever
// Next tries to write this route into its incremental/full-route cache, the
// cache-entry size calculation comes out to 0, which its LRU cache rejects
// ("calculateSize returned 0, but size must be > 0") - logged as an error on
// every single request in production, confirmed still happening even with
// `force-static` (verified via pm2 log flush + fresh requests, 2026-09-11).
// `force-dynamic` skips the caching machinery altogether, so there's nothing
// for that broken size calculation to run against - this handler does zero
// work (no DB call, no computation) so there's no actual cost to not caching
// it.
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.redirect(`${SITE_URL}/sitemap-blogs-1.xml`, { status: 301 });
}
