// Refreshes the live cache for a list of blog posts after their content was changed in the database.
//   node scripts/revalidate-slugs.js D:/android-projeler/backups/year-refresh-slugs.json [--warm]
//
// POSTs the slugs to /api/revalidate in batches (needs REVALIDATE_SECRET), and with --warm requests each page once
// afterwards. revalidatePath is stale-while-revalidate: the FIRST request after it still returns the old HTML and
// regenerates in the background, so warming is what makes the new text show up. The site's rate limiter answers
// 429 above roughly 5 requests per second; this stays around 1.5/s and backs off on 429.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const envLocal = path.join(ROOT, '.env.local');
if (fs.existsSync(envLocal)) {
  for (const line of fs.readFileSync(envLocal, 'utf8').split('\n')) {
    const i = line.indexOf('=');
    if (i > 0 && !process.env[line.slice(0, i).trim()]) process.env[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
  }
}
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const file = process.argv[2];
const warm = process.argv.includes('--warm');
if (!file) { console.error('usage: node scripts/revalidate-slugs.js <slugs.json> [--warm]'); process.exit(1); }
if (!process.env.REVALIDATE_SECRET) { console.error('REVALIDATE_SECRET is not set'); process.exit(1); }
const posts = JSON.parse(fs.readFileSync(file, 'utf8'));

(async () => {
  let done = 0;
  for (let i = 0; i < posts.length; i += 150) {
    const batch = posts.slice(i, i + 150);
    const res = await fetch(`${SITE}/api/revalidate`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${process.env.REVALIDATE_SECRET}` },
      body: JSON.stringify({ posts: batch }),
    });
    console.log(`revalidate batch ${i / 150 + 1}: HTTP ${res.status}`);
    if (!res.ok) { console.error((await res.text()).slice(0, 200)); process.exit(1); }
    done += batch.length;
  }
  console.log(`revalidated ${done} posts`);
  if (!warm) return;
  let ok = 0, rl = 0;
  for (const p of posts) {
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const r = await fetch(`${SITE}/${p.language}/blog/${p.slug}`, { headers: { 'user-agent': 'Mozilla/5.0 (cache warm)' } });
        if (r.status === 429) { rl++; await sleep(8000); continue; }
        await r.text();
        ok++;
        break;
      } catch { await sleep(3000); }
    }
    await sleep(650);
  }
  console.log(`warmed ${ok}/${posts.length} pages (${rl} rate-limit backoffs)`);
})().catch((err) => { console.error('FAILED:', err.message); process.exit(1); });
