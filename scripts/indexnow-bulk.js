/**
 * scripts/indexnow-bulk.js
 *
 * One-off / on-demand bulk submit: reads every URL from the live sitemaps
 * (static + blogs) and pushes them to IndexNow (Bing, Yandex, Naver, Seznam).
 *
 *   node scripts/indexnow-bulk.js            # dry run, prints counts
 *   node scripts/indexnow-bulk.js --send     # actually submits
 *   node scripts/indexnow-bulk.js --send --only=blog   # blog URLs only
 */
const KEY = 'b4f7e2a8d1c3956e0a1b2c3d4e5f6789';
const ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://yandex.com/indexnow',
  'https://searchadvisor.naver.com/indexnow',
  'https://search.seznam.cz/indexnow',
];

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';
const send = process.argv.includes('--send');
const onlyArg = process.argv.find((a) => a.startsWith('--only='));
const only = onlyArg ? onlyArg.split('=')[1] : null;

async function getLocs(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
}

(async () => {
  const children = await getLocs(`${SITE_URL}/sitemap.xml`);
  const urls = new Set();
  for (const child of children) {
    for (const loc of await getLocs(child)) urls.add(loc);
  }

  let list = [...urls];
  if (only) list = list.filter((u) => u.includes(`/${only}`));
  console.log(`Sitemaps: ${children.length}, URLs to submit: ${list.length}`);

  if (!send) {
    console.log('Dry run. Sample:', list.slice(0, 3));
    return;
  }

  for (let i = 0; i < list.length; i += 10000) {
    const body = JSON.stringify({
      host: new URL(SITE_URL).host,
      key: KEY,
      keyLocation: `${SITE_URL}/${KEY}.txt`,
      urlList: list.slice(i, i + 10000),
    });
    for (const ep of ENDPOINTS) {
      try {
        const r = await fetch(ep, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body,
        });
        console.log(ep, '->', r.status);
      } catch (e) {
        console.log(ep, '-> ERROR', e.message);
      }
    }
  }
  console.log('Submitted.');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
