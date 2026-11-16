/**
 * scripts/google-indexing-ping.js
 *
 * Sends URL_UPDATED notifications to the Google Indexing API.
 * NOTE: Google documents this API for JobPosting / BroadcastEvent pages only; use at your own risk.
 * The service account must be an Owner of the loadlyapp.com property in Search Console.
 * Default quota: 200 publish requests per day per project.
 *
 *   node scripts/google-indexing-ping.js <url> [<url> ...]      # send the given URLs
 *   node scripts/google-indexing-ping.js --file urls.txt         # one URL per line
 *
 * The key file is read from GOOGLE_INDEXING_KEY (path), default ~/.claude/tools/indexing-key.json.
 * It is never stored in this repo.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

const KEY_PATH = process.env.GOOGLE_INDEXING_KEY || path.join(os.homedir(), '.claude', 'tools', 'indexing-key.json');
const key = JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));

const b64u = (b) => Buffer.from(b).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

async function accessToken() {
  const now = Math.floor(Date.now() / 1000);
  const head = b64u(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64u(JSON.stringify({
    iss: key.client_email,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }));
  const sig = b64u(crypto.createSign('RSA-SHA256').update(`${head}.${claim}`).sign(key.private_key));
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${head}.${claim}.${sig}` }),
  });
  const j = await r.json();
  if (!j.access_token) throw new Error('token error: ' + JSON.stringify(j));
  return j.access_token;
}

(async () => {
  const args = process.argv.slice(2);
  let urls = args.filter((a) => a.startsWith('http'));
  const fi = args.indexOf('--file');
  if (fi >= 0) urls = urls.concat(fs.readFileSync(args[fi + 1], 'utf8').split(/\r?\n/).map((s) => s.trim()).filter(Boolean));
  if (!urls.length) { console.log('no URLs'); return; }
  const token = await accessToken();
  let ok = 0;
  for (const url of urls) {
    const r = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, type: 'URL_UPDATED' }),
    });
    const t = await r.text();
    if (r.ok) ok++;
    console.log(r.status, url, r.ok ? '' : t.replace(/\s+/g, ' ').slice(0, 300));
    if (r.status === 403 || r.status === 429) { console.log('stopping after', r.status); break; }
  }
  console.log(`done: ${ok}/${urls.length} accepted`);
})().catch((e) => { console.error(e.message); process.exit(1); });
