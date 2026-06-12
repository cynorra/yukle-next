import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
// Vercel max function duration (Pro = 300s, Hobby = 60s)
export const maxDuration = 300;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret  = searchParams.get('secret');
  const runAll  = searchParams.get('all') === 'true';
  // ?source=tr | ?source=us | ?source=all (default: all)
  const source  = searchParams.get('source') || 'all';

  const authHeader = request.headers.get('Authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret) {
    const isSecretParamValid = secret === cronSecret;
    const isAuthHeaderValid  = authHeader === `Bearer ${cronSecret}`;
    if (!isSecretParamValid && !isAuthHeaderValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  // Auto-blog / scraper disabled
  return NextResponse.json({ success: true, message: 'Auto blog is disabled.' });

  // Shared Supabase client (service role to bypass RLS)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const shipperId = process.env.SCRAPER_SHIPPER_ID || '3c9d15c1-ce40-42c4-b5bc-f2de51a747d5';

  const results: Record<string, number | string> = {};

  try {
    // ──────────────────────────────────────────────────────────────
    // 1. Turkish / Middle East / Europe source (nakliyerehberim.com)
    // ──────────────────────────────────────────────────────────────
    if (source === 'all' || source === 'tr') {
      try {
        console.log('[Cron] Starting TR scraper (nakliyerehberim.com)...');
        // @ts-ignore
        const { runScraper } = require('../../../../../scripts/scraper');
        const inserted = await runScraper({ runAll });
        results.tr_inserted = inserted;
        console.log(`[Cron] TR scraper done. Inserted: ${inserted}`);
      } catch (err: any) {
        console.error('[Cron] TR scraper error:', err.message);
        results.tr_error = err.message;
      }
    }

    // ──────────────────────────────────────────────────────────────
    // 2. USA / North America source (FreightFinder.com — serverless)
    // ──────────────────────────────────────────────────────────────
    if (source === 'all' || source === 'us') {
      try {
        console.log('[Cron] Starting US scraper (FreightFinder.com)...');
        // @ts-ignore
        const { runFreightFinderScraper } = require('../../../../../scripts/freightfinder-serverless');
        const inserted = await runFreightFinderScraper({
          supabase,
          shipperId,
          maxPerRun: 60,     // ~60 listings per cron run (safe for timeout)
          pagesPerCity: 2,
          verbose: true,
        });
        results.us_inserted = inserted;
        console.log(`[Cron] US scraper done. Inserted: ${inserted}`);
      } catch (err: any) {
        console.error('[Cron] US scraper error:', err.message);
        results.us_error = err.message;
      }
    }

    const totalInserted =
      (typeof results.tr_inserted === 'number' ? results.tr_inserted : 0) +
      (typeof results.us_inserted === 'number' ? results.us_inserted : 0);

    return NextResponse.json({
      success: true,
      message: `Scraper cron complete. Total inserted: ${totalInserted}`,
      details: results,
    });

  } catch (error: any) {
    console.error('[Cron] Fatal error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Scraper Error' },
      { status: 500 }
    );
  }
}
