import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

// Fallback to empty string to avoid crashes during build if env vars are missing
const vapidEmail = 'mailto:info@loadlyapp.com';
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'fake_public_key';
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || 'fake_private_key';

if (process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(vapidEmail, vapidPublicKey, vapidPrivateKey);
}

// Bypass RLS since this is a server webhook
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function POST(request: Request) {
  try {
    const { subscription, title, body, url, userId } = await request.json();

    if (!process.env.VAPID_PRIVATE_KEY) {
      return NextResponse.json({ error: 'Push not configured' }, { status: 500 });
    }

    if (userId && !subscription) {
      // Send to all user devices
      const { data: subs } = await supabaseAdmin
        .from('push_subscriptions')
        .select('subscription')
        .eq('user_id', userId);

      if (subs && subs.length > 0) {
        const payload = JSON.stringify({ title, body, url });
        const promises = subs.map((sub: any) => 
          webpush.sendNotification(sub.subscription, payload).catch(err => {
            // If subscription is invalid/expired, remove it
            if (err.statusCode === 410) {
              return supabaseAdmin.from('push_subscriptions').delete().eq('subscription->endpoint', sub.subscription.endpoint);
            }
          })
        );
        await Promise.allSettled(promises);
      }
      return NextResponse.json({ success: true, count: subs?.length || 0 });
    }

    if (subscription) {
      // Send to a specific subscription directly
      const payload = JSON.stringify({ title, body, url });
      await webpush.sendNotification(subscription, payload);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Missing subscription or userId' }, { status: 400 });
  } catch (error: any) {
    console.error('Push error:', error);
    return NextResponse.json({ error: 'Failed to send push' }, { status: 500 });
  }
}
