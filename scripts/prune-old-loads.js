// Daily retention for the `loads` table: deletes scraped loads older than RETENTION_DAYS.
//   node scripts/prune-old-loads.js [--dry-run]
//
// Why: the scraper never expires anything and each row carries 47-language translations
// (~9KB), so the table grew to 108k rows and, together with the free-tier database, caused
// the 2026-10-10 outage. The Android app only lists the newest active loads.
//
// Small batches with retries on purpose: the database answers 57014 statement timeouts when
// it is under load, and a failed run is harmless (the next day's run just deletes more).
// Plain fetch against PostgREST, no dependencies.

const fs = require('fs');
const path = require('path');

const envLocal = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envLocal)) {
  for (const line of fs.readFileSync(envLocal, 'utf8').split('\n')) {
    const i = line.indexOf('=');
    if (i > 0 && !process.env[line.slice(0, i).trim()]) process.env[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$|\r/g, '');
  }
}

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL_ || !KEY) { console.error('Missing Supabase env vars'); process.exit(1); }

const RETENTION_DAYS = 14;
const BATCH = 100;
const MAX_PER_RUN = 20000; // bounded so one run can never hammer the database for long
const dryRun = process.argv.includes('--dry-run');
const cutoff = new Date(Date.now() - RETENTION_DAYS * 86400000).toISOString();
const H = { apikey: KEY, Authorization: `Bearer ${KEY}` };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function req(pathAndQuery, opts = {}, tries = 8) {
  for (let t = 1; t <= tries; t++) {
    try {
      const res = await fetch(`${URL_}/rest/v1/${pathAndQuery}`, { ...opts, headers: { ...H, ...(opts.headers || {}) }, signal: AbortSignal.timeout(60000) });
      if (res.ok) return res;
      const body = (await res.text()).slice(0, 160);
      if (res.status < 500 && res.status !== 429) throw Object.assign(new Error(`HTTP ${res.status} ${body}`), { fatal: true });
      console.log(`retry ${t}: HTTP ${res.status} ${body}`);
    } catch (e) {
      if (e.fatal) throw e;
      console.log(`retry ${t}: ${e.message}`);
    }
    await sleep(Math.min(2000 * t, 15000));
  }
  throw new Error(`giving up: ${pathAndQuery.slice(0, 80)}`);
}

(async () => {
  console.log(`Pruning loads created before ${cutoff} (${RETENTION_DAYS} days)${dryRun ? ' [dry run]' : ''}`);
  let deleted = 0;
  while (deleted < MAX_PER_RUN) {
    const rows = await (await req(`loads?select=id&created_at=lt.${encodeURIComponent(cutoff)}&order=created_at.asc&limit=${BATCH}`)).json();
    if (!rows.length) break;
    if (dryRun) {
      const res = await req(`loads?select=id&created_at=lt.${encodeURIComponent(cutoff)}&limit=1`, { headers: { Prefer: 'count=exact' } });
      console.log(`Dry run: ${res.headers.get('content-range').split('/')[1]} rows would be deleted`);
      return;
    }
    await req(`loads?id=in.(${rows.map((r) => r.id).join(',')})`, { method: 'DELETE', headers: { Prefer: 'return=minimal' } });
    deleted += rows.length;
    if (deleted % 1000 < BATCH) console.log(`deleted ${deleted}`);
    await sleep(150);
  }
  console.log(`Done. Deleted ${deleted} loads older than ${RETENTION_DAYS} days.`);
})().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
