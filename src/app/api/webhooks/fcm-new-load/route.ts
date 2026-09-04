import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
// Plain CommonJS data module shared with scripts/scraper.js and the fcm-batch route.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { COUNTRY_TO_ISO2 } = require('../../../../../scripts/lib-country-to-iso2.js');

// Bypass RLS since this is a server webhook fetching a specific row it already knows the id of.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// Lazily initialized so a missing FIREBASE_SERVICE_ACCOUNT doesn't crash the route -
// it just no-ops until the credential is added (see .env.example).
let messagingPromise: Promise<import('firebase-admin/messaging').Messaging | null> | null = null;

function getMessaging() {
  if (!messagingPromise) {
    messagingPromise = (async () => {
      const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
      if (!raw) return null;
      const { initializeApp, getApps, cert } = await import('firebase-admin/app');
      const { getMessaging } = await import('firebase-admin/messaging');
      const serviceAccount = JSON.parse(raw);
      const app = getApps()[0] || initializeApp({ credential: cert(serviceAccount) });
      return getMessaging(app);
    })();
  }
  return messagingPromise;
}

const TOPIC_PREFIX = 'new_loads_';

export async function POST(request: Request) {
  try {
    const { loadId } = await request.json();
    if (typeof loadId !== 'string' || !/^[0-9a-f-]{36}$/i.test(loadId)) {
      return NextResponse.json({ error: 'Invalid loadId' }, { status: 400 });
    }

    const messaging = await getMessaging();
    if (!messaging) {
      return NextResponse.json({ skipped: 'FIREBASE_SERVICE_ACCOUNT not configured' });
    }

    // Re-fetch server-side rather than trusting client-supplied title/route text,
    // and only push for loads actually visible in the marketplace right now.
    const { data: load } = await supabaseAdmin
      .from('loads')
      .select('id,title,origin_city,destination_city,origin_country,destination_country,status,created_at')
      .eq('id', loadId)
      .eq('status', 'active')
      .single();

    if (!load) {
      return NextResponse.json({ skipped: 'load not found or not active' });
    }
    // Guards against this public endpoint being replayed to re-blast an old load.
    if (Date.now() - new Date(load.created_at).getTime() > 5 * 60 * 1000) {
      return NextResponse.json({ skipped: 'load too old' });
    }

    // Pushed to both legs' country topics - a trucker might care about either end.
    const countries = [load.origin_country, load.destination_country]
      .map((name) => COUNTRY_TO_ISO2[name])
      .filter((iso2, i, arr): iso2 is string => !!iso2 && arr.indexOf(iso2) === i);

    if (countries.length === 0) {
      return NextResponse.json({ skipped: 'no mapped country for this load' });
    }

    await Promise.all(countries.map((iso2) =>
      messaging.send({
        topic: TOPIC_PREFIX + iso2,
        notification: {
          title: 'Yeni ilan',
          body: `${load.origin_city} → ${load.destination_city}: ${load.title}`,
        },
        data: {
          target_url: `https://loadlyapp.com/marketplace/${load.id}`,
        },
        android: { priority: 'high' },
      })
    ));

    return NextResponse.json({ success: true, sentTo: countries });
  } catch (error: any) {
    console.error('FCM new-load push error:', error);
    return NextResponse.json({ error: 'Failed to send push' }, { status: 500 });
  }
}
