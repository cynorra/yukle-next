// Publishes the next hand-written guide that is staged in content-rewrites/ ("staged": true, lowest "stage").
// It only flips published=true and stamps the REAL publication time; it never writes or generates content.
// Usage: node scripts/publish-next-guide.js [--dry-run]
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const envLocal = path.join(ROOT, '.env.local');
if (fs.existsSync(envLocal)) {
  for (const line of fs.readFileSync(envLocal, 'utf8').split(String.fromCharCode(10))) {
    const i = line.indexOf('=');
    if (i > 0 && !process.env[line.slice(0, i).trim()]) process.env[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
  }
}
const { createClient } = require('@supabase/supabase-js');
const dry = process.argv.includes('--dry-run');
const dir = path.join(ROOT, 'content-rewrites');

(async () => {
  const staged = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => ({ slug: f.replace('.json', ''), ...JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) }))
    .filter((p) => p.staged).sort((a, b) => (a.stage || 99) - (b.stage || 99));
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data, error } = await sb.from('blog_posts').select('id,slug,published').eq('language', 'en').in('slug', staged.map((p) => p.slug));
  if (error) throw error;
  const pending = staged.filter((p) => (data.find((d) => d.slug === p.slug) || {}).published === false);
  if (!pending.length) return console.log('Nothing staged. All guides are published.');
  const next = pending[0];
  console.log('Next guide:', next.slug, '| still staged after this one:', pending.length - 1);
  if (dry) return console.log('dry run, nothing written');
  const now = new Date().toISOString();
  const { error: ue } = await sb.from('blog_posts').update({ published: true, created_at: now, updated_at: now }).eq('slug', next.slug).eq('language', 'en');
  if (ue) throw ue;
  console.log('Published', next.slug, 'at', now);
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) return console.log('REVALIDATE_SECRET not set: pages refresh on their normal schedule.');
  const res = await fetch((process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com') + '/api/revalidate', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + secret },
    body: JSON.stringify({ posts: [{ language: 'en', slug: next.slug }] }),
  });
  console.log('revalidate:', res.status, await res.text());
})().catch((e) => { console.error(e); process.exit(1); });
