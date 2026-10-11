// Unlinks internal blog links that point at unpublished posts (keeps the anchor text). Usage: node scripts/fix-dead-links.js [--apply]
const path = require('path');
const fs = require('fs');
const envLocal = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envLocal)) {
  for (const line of fs.readFileSync(envLocal, 'utf8').split(String.fromCharCode(10))) {
    const i = line.indexOf('=');
    if (i > 0 && !process.env[line.slice(0, i).trim()]) process.env[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
  }
}
const { createClient } = require('@supabase/supabase-js');
const apply = process.argv.includes('--apply');
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
(async () => {
  const posts = [];
  for (let from = 0; ; from += 200) {
    const { data, error } = await sb.from('blog_posts').select('id,slug,content,published').eq('language', 'en').range(from, from + 199);
    if (error) throw error;
    posts.push(...data);
    if (data.length < 200) break;
  }
  const live = new Set(posts.filter((p) => p.published).map((p) => p.slug));
  const re = /<a\s[^>]*href=["'](?:https?:\/\/(?:www\.)?loadlyapp\.com)?\/en\/blog\/([a-z0-9-]+)\/?["'][^>]*>([\s\S]*?)<\/a>/gi;
  for (const p of posts.filter((x) => x.published)) {
    let n = 0;
    const out = p.content.replace(re, (m, slug, text) => (live.has(slug) ? m : (n++, text)));
    if (!n) continue;
    console.log(p.slug, 'unlinked', n);
    if (apply) { const { error } = await sb.from('blog_posts').update({ content: out }).eq('id', p.id); if (error) throw error; console.log('  updated'); }
  }
})().catch((e) => { console.error(e); process.exit(1); });
