// Applies a hand-written rewrite (content-rewrites/<slug>.html + .json) to blog_posts after gate + link checks.
// Usage: node scripts/apply-rewrite.js <slug> [--apply]
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const envLocal = path.join(ROOT, '.env.local');
for (const line of fs.readFileSync(envLocal, 'utf8').split(String.fromCharCode(10))) {
  const i = line.indexOf('=');
  if (i > 0 && !process.env[line.slice(0, i).trim()]) process.env[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
}
const { createClient } = require('@supabase/supabase-js');
const Q = require('./lib/article-quality');
const slug = process.argv[2];
const apply = process.argv.includes('--apply');
const dir = path.join(ROOT, 'content-rewrites');
const content = fs.readFileSync(path.join(dir, slug + '.html'), 'utf8');
const meta = JSON.parse(fs.readFileSync(path.join(dir, slug + '.json'), 'utf8'));
const p = { slug, content, ...meta };
const checks = {
  first_person: Q.findFirstPersonExperience(p.title, p.excerpt, p.meta_description, p.content),
  indirect: Q.findIndirectExperience(p.title, p.excerpt, p.meta_description, p.content),
  first_party: Q.findFirstPartyClaim(p.title, p.excerpt, p.meta_description, p.content),
  brand: Q.findBrandMention(p.title, p.excerpt, p.meta_title, p.meta_description, p.content),
  hype: Q.findHypeClaim(p),
  number_in_meta: Q.findInventedNumberInMeta(p.excerpt, p.meta_description, p.meta_title, p.title),
  year_in_title: Q.titleHasYear(p.title, p.meta_title),
  anecdote: Q.findFabricatedAnecdote(p.content),
};
const md = (p.meta_description || '').length;
if (md < 90 || md > 185) checks.meta_length = 'meta_description ' + md;
const words = Q.stripTags(content).split(/\s+/).filter(Boolean).length;
let bad = Object.entries(checks).filter(([, v]) => v);
console.log('words', words, '| gate failures:', bad.length ? JSON.stringify(bad) : 'none');
(async () => {
  const urls = [...new Set([...content.matchAll(/href="(https?:[^"]+)"/g)].map((m) => m[1]))];
  for (const u of urls) {
    let s;
    try { s = (await fetch(u, { headers: { 'user-agent': 'Mozilla/5.0' }, redirect: 'follow' })).status; } catch (e) { s = 'ERR'; }
    console.log(s, u);
  }
  if (bad.length) process.exit(1);
  if (!apply) return console.log('dry run only');
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const fields = { content, title: meta.title, excerpt: meta.excerpt, meta_title: meta.meta_title, meta_description: meta.meta_description, updated_at: new Date().toISOString() };
  const { data: existing } = await sb.from('blog_posts').select('id').eq('slug', slug).eq('language', 'en').maybeSingle();
  if (!existing) {
    const { data: src, error: e1 } = await sb.from('blog_posts').select('author_id,cover_image,topic_cluster').eq('slug', meta.replaces).eq('language', 'en').single();
    if (e1) throw e1;
    const { error: e2 } = await sb.from('blog_posts').insert({ slug, language: 'en', published: !meta.staged, author_id: src.author_id, cover_image: src.cover_image, topic_cluster: meta.topic_cluster || src.topic_cluster, ...fields });
    if (e2) throw e2;
    return console.log(meta.staged ? 'inserted (staged, not published)' : 'inserted', slug);
  }
  const { error } = await sb.from('blog_posts').update(fields).eq('slug', slug).eq('language', 'en');
  if (error) throw error;
  console.log('updated', slug);
})().catch((e) => { console.error(e); process.exit(1); });
