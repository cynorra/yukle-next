import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
// Plain CommonJS data module shared with scripts/scraper.js and
// scripts/freightfinder-serverless.js - see that file for provenance.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { COUNTRY_TO_ISO2 } = require('../../../../../scripts/lib-country-to-iso2.js');

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

let messagingPromise: Promise<import('firebase-admin/messaging').Messaging | null> | null = null;
function getMessaging() {
  if (!messagingPromise) {
    messagingPromise = (async () => {
      const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
      if (!raw) return null;
      const { initializeApp, getApps, cert } = await import('firebase-admin/app');
      const { getMessaging } = await import('firebase-admin/messaging');
      const app = getApps()[0] || initializeApp({ credential: cert(JSON.parse(raw)) });
      return getMessaging(app);
    })();
  }
  return messagingPromise;
}

const TOPIC_PREFIX = 'new_loads_';

// Called once per scraper run (scripts/scraper.js / freightfinder-serverless.js), not
// per-row - a single run can insert dozens to hundreds of loads across many countries,
// and one push per row would spam users. Groups the run's newly-inserted loads by
// country (both origin and destination - a trucker might care about either leg) and
// sends one summary push per country topic instead.
export async function POST(request: Request) {
  try {
    const auth = request.headers.get('authorization');
    if (auth !== `Bearer ${process.env.SCRAPER_WEBHOOK_SECRET}` || !process.env.SCRAPER_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { loadIds } = await request.json();
    if (!Array.isArray(loadIds) || loadIds.length === 0) {
      return NextResponse.json({ skipped: 'no loadIds' });
    }

    const messaging = await getMessaging();
    if (!messaging) {
      return NextResponse.json({ skipped: 'FIREBASE_SERVICE_ACCOUNT not configured' });
    }

    const { data: loads } = await supabaseAdmin
      .from('loads')
      .select('id,origin_country,destination_country,status,created_at')
      .in('id', loadIds)
      .eq('status', 'active');

    if (!loads || loads.length === 0) {
      return NextResponse.json({ skipped: 'no matching active loads' });
    }

    // Anti-replay: only count loads actually created in roughly this run's window.
    const fresh = loads.filter((l) => Date.now() - new Date(l.created_at).getTime() < 15 * 60 * 1000);

    const countsByCountry = new Map<string, number>();
    const unmapped = new Set<string>();
    for (const load of fresh) {
      for (const countryName of [load.origin_country, load.destination_country]) {
        if (!countryName) continue;
        const iso2 = COUNTRY_TO_ISO2[countryName];
        if (!iso2) {
          unmapped.add(countryName);
          continue;
        }
        countsByCountry.set(iso2, (countsByCountry.get(iso2) || 0) + 1);
      }
    }

    const results: Record<string, string> = {};
    for (const [iso2, count] of countsByCountry) {
      try {
        const id = await messaging.send({
          topic: TOPIC_PREFIX + iso2,
          notification: {
            title: 'Yeni ilanlar',
            body: `${count} yeni ilan eklendi`,
          },
          data: { target_url: 'https://loadlyapp.com/marketplace' },
          android: { priority: 'high' },
        });
        results[iso2] = id;
      } catch (e: any) {
        results[iso2] = `error: ${e.message}`;
      }
    }

    return NextResponse.json({
      success: true,
      sentTo: results,
      unmappedCountries: [...unmapped],
    });
  } catch (error: any) {
    console.error('FCM batch push error:', error);
    return NextResponse.json({ error: 'Failed to send push' }, { status: 500 });
  }
}
