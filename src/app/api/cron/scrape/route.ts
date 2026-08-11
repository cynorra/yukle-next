import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { submitToIndexNow } from '@/lib/indexnow';
import { buildLaneSlug, buildCitySlug, buildCountrySlug, buildTruckTypeSlug, buildLoadTypeSlug } from '@/lib/laneRoutes';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';
const ALL_LOCALES = [
  'en', 'tr', 'es', 'pt', 'fr', 'de', 'it', 'pl', 'nl',
  'ru', 'uk', 'zh', 'ja', 'hi', 'ar', 'fa',
  'ko', 'vi', 'id', 'bn', 'ur', 'th', 'ms', 'tl',
  'ro', 'sv', 'cs', 'hu', 'el', 'az', 'kk', 'he',
  'bg', 'hr', 'sr', 'sk', 'da', 'fi', 'no', 'uz',
  'ta', 'mr', 'ka', 'lt', 'lv', 'et', 'sl'
];

export const dynamic = 'force-dynamic';
// Vercel max function duration (Pro = 300s, Hobby = 60s)
export const maxDuration = 300;

export async function GET(request: Request) {
  const runStartedAt = new Date().toISOString();
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
      (typeof results.tr_inserted === 'number' ? (results.tr_inserted as number) : 0) +
      (typeof results.us_inserted === 'number' ? (results.us_inserted as number) : 0);

    // Push newly-inserted loads from this run to IndexNow (Bing/Yandex/Naver/Seznam
    // — Google doesn't support IndexNow, this doesn't help Google directly, but it's
    // free instant indexing for the engines that do support it, and these loads are
    // short-lived so instant beats waiting for the next organic crawl).
    let indexNowSubmitted = 0;
    if (totalInserted > 0) {
      try {
        const { data: newLoads } = await supabase
          .from('loads')
          .select('id, origin_city, origin_country, destination_city, destination_country, required_truck_type, load_type')
          .eq('status', 'active')
          .gte('created_at', runStartedAt);

        if (newLoads && newLoads.length > 0) {
          const laneSlugs = new Set<string>();
          const citySlugs = new Set<string>();
          const countrySlugs = new Set<string>();
          const destCitySlugs = new Set<string>();
          const destCountrySlugs = new Set<string>();
          const truckTypeSlugs = new Set<string>();
          const loadTypeSlugs = new Set<string>();
          for (const load of newLoads) {
            if (load.origin_city && load.origin_country && load.destination_city && load.destination_country) {
              laneSlugs.add(buildLaneSlug(load.origin_city, load.origin_country, load.destination_city, load.destination_country));
            }
            if (load.origin_city && load.origin_country) {
              citySlugs.add(buildCitySlug(load.origin_city, load.origin_country));
              countrySlugs.add(buildCountrySlug(load.origin_country));
            }
            if (load.destination_city && load.destination_country) {
              destCitySlugs.add(buildCitySlug(load.destination_city, load.destination_country));
              destCountrySlugs.add(buildCountrySlug(load.destination_country));
            }
            if (load.required_truck_type) truckTypeSlugs.add(buildTruckTypeSlug(load.required_truck_type));
            if (load.load_type) loadTypeSlugs.add(buildLoadTypeSlug(load.load_type));
          }

          const urls = newLoads.flatMap((load) =>
            ALL_LOCALES.map((locale) => `${SITE_URL}/${locale}/marketplace/${load.id}`)
          );
          // Hub pages (lane/city/country/etc.) may already exist — resubmitting
          // is harmless, and this is the only place a brand-new hub's URL ever
          // gets pushed for fast indexing.
          const laneUrls = Array.from(laneSlugs).flatMap((slug) =>
            ALL_LOCALES.map((locale) => `${SITE_URL}/${locale}/shipping-routes/${slug}`)
          );
          const cityUrls = Array.from(citySlugs).flatMap((slug) =>
            ALL_LOCALES.map((locale) => `${SITE_URL}/${locale}/shipping-routes/from/${slug}`)
          );
          const countryUrls = Array.from(countrySlugs).flatMap((slug) =>
            ALL_LOCALES.map((locale) => `${SITE_URL}/${locale}/shipping-routes/country/${slug}`)
          );
          const destCityUrls = Array.from(destCitySlugs).flatMap((slug) =>
            ALL_LOCALES.map((locale) => `${SITE_URL}/${locale}/shipping-routes/to/${slug}`)
          );
          const destCountryUrls = Array.from(destCountrySlugs).flatMap((slug) =>
            ALL_LOCALES.map((locale) => `${SITE_URL}/${locale}/shipping-routes/to-country/${slug}`)
          );
          const truckTypeUrls = Array.from(truckTypeSlugs).flatMap((slug) =>
            ALL_LOCALES.map((locale) => `${SITE_URL}/${locale}/shipping-routes/truck-type/${slug}`)
          );
          const loadTypeUrls = Array.from(loadTypeSlugs).flatMap((slug) =>
            ALL_LOCALES.map((locale) => `${SITE_URL}/${locale}/shipping-routes/cargo-type/${slug}`)
          );
          await submitToIndexNow([
            ...urls, ...laneUrls, ...cityUrls, ...countryUrls,
            ...destCityUrls, ...destCountryUrls, ...truckTypeUrls, ...loadTypeUrls,
          ]);
          indexNowSubmitted = newLoads.length;
        }
      } catch (err: any) {
        console.error('[Cron] IndexNow submission error:', err.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Scraper cron complete. Total inserted: ${totalInserted}`,
      details: results,
      indexNowSubmitted,
    });

  } catch (error: any) {
    console.error('[Cron] Fatal error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Scraper Error' },
      { status: 500 }
    );
  }
}
