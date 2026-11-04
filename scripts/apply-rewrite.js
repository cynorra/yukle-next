// Applies a hand-written rewrite (content-rewrites/<slug>.html + .json) to blog_posts.
//
//   node scripts/apply-rewrite.js <slug>                      dry run (default): gates, link check, diff vs. DB. Writes nothing.
//   node scripts/apply-rewrite.js <slug> --dry-run            same, explicit
//   node scripts/apply-rewrite.js <slug> --backup             full blog_posts backup to backups/, then stop (no write)
//   node scripts/apply-rewrite.js <slug> --apply --backup     backup first, then write this one article
//   node scripts/apply-rewrite.js --restore <backup.json> [--slug <slug>] [--apply]
//                                                              roll back one slug (or every row) from a backup; dry run unless --apply
//
// --apply is refused unless --backup runs in the same command (a fresh full-table backup) so a
// rollback file always exists. Nothing is ever written without --apply.
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
for (const line of fs.readFileSync(path.join(ROOT, '.env.local'), 'utf8').split('\n')) {
  const i = line.indexOf('=');
  if (i > 0 && !process.env[line.slice(0, i).trim()]) process.env[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
}
const { createClient } = require('@supabase/supabase-js');
const Q = require('./lib/article-quality');

const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const apply = flag('--apply');
const wantBackup = flag('--backup');
const restoreFile = opt('--restore');
const slug = restoreFile ? opt('--slug') : args.find((a) => !a.startsWith('--'));
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, { auth: { persistSession: false } });
const BACKUP_DIR = path.join(ROOT, 'backups');

async function backupAll() {
  const rows = [];
  for (let from = 0; ; from += 500) {
    const { data, error } = await sb.from('blog_posts').select('*').order('id', { ascending: true }).range(from, from + 499);
    if (error) throw error;
    rows.push(...data);
    if (data.length < 500) break;
  }
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  const file = path.join(BACKUP_DIR, `blog_posts-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
  fs.writeFileSync(file, JSON.stringify(rows));
  console.log(`backup: ${rows.length} rows -> ${path.relative(ROOT, file)}`);
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) console.log('WARNING: no service-role key; the backup contains only rows visible to the anon key (published posts).');
  return file;
}

const FIELDS = ['content', 'title', 'excerpt', 'meta_title', 'meta_description', 'updated_at'];

async function restore() {
  const rows = JSON.parse(fs.readFileSync(path.resolve(restoreFile), 'utf8'));
  const targets = slug ? rows.filter((r) => r.slug === slug) : rows;
  console.log(`restore: ${targets.length} row(s) from ${restoreFile}${apply ? '' : ' (dry run; add --apply to write)'}`);
  for (const r of targets) {
    const { data: cur } = await sb.from('blog_posts').select('id,content,title,excerpt,meta_title,meta_description,updated_at').eq('id', r.id).maybeSingle();
    const changed = !cur || FIELDS.some((f) => (cur[f] ?? null) !== (r[f] ?? null));
    console.log(`${changed ? 'DIFFERS ' : 'same    '} ${r.slug}`);
    if (apply && changed) {
      const patch = Object.fromEntries(FIELDS.map((f) => [f, r[f] ?? null]));
      const { error } = cur ? await sb.from('blog_posts').update(patch).eq('id', r.id) : await sb.from('blog_posts').insert(r);
      if (error) throw error;
      console.log('  restored', r.slug);
    }
  }
}

async function rewrite() {
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
  const takeaways = (content.match(/<aside[^>]*data-takeaways[^>]*>([\s\S]*?)<\/aside>/i) || [, ''])[1].match(/<li[\s>]/g) || [];
  if (takeaways.length !== 3) checks.takeaways = `expected 3 takeaways, found ${takeaways.length}`;
  const words = Q.stripTags(content).split(/\s+/).filter(Boolean).length;
  const bad = Object.entries(checks).filter(([, v]) => v);
  console.log('words', words, '| gate failures:', bad.length ? JSON.stringify(bad) : 'none');

  const urls = [...new Set([...content.matchAll(/href="(https?:[^"]+)"/g)].map((m) => m[1]))];
  for (const u of urls) {
    let s;
    try { s = (await fetch(u, { headers: { 'user-agent': 'Mozilla/5.0' }, redirect: 'follow' })).status; } catch (e) { s = 'ERR'; }
    console.log(s, u, s === 403 ? '(site blocks scripted requests; open it in a browser)' : '');
  }

  const { data: existing, error: ee } = await sb.from('blog_posts').select('id,content,title,excerpt,meta_title,meta_description,updated_at').eq('slug', slug).eq('language', 'en').maybeSingle();
  if (ee) throw ee;
  if (!existing) { console.log('DB: no row with this slug; this script only updates existing rows.'); process.exit(1); }
  for (const f of ['title', 'excerpt', 'meta_title', 'meta_description', 'content']) {
    console.log(`DB diff ${f}: ${existing[f] === (f === 'content' ? content : meta[f]) ? 'unchanged' : 'WILL CHANGE'}`);
  }
  if (bad.length) process.exit(1);

  if (!apply) {
    if (wantBackup) await backupAll();
    return console.log('dry run only; nothing written.');
  }
  if (!wantBackup) { console.error('--apply requires --backup in the same command.'); process.exit(1); }
  const file = await backupAll();
  const fields = { content, title: meta.title, excerpt: meta.excerpt, meta_title: meta.meta_title, meta_description: meta.meta_description, updated_at: new Date().toISOString() };
  const { error } = await sb.from('blog_posts').update(fields).eq('id', existing.id);
  if (error) throw error;
  console.log('updated', slug);
  console.log(`rollback: node scripts/apply-rewrite.js --restore ${path.relative(ROOT, file)} --slug ${slug} --apply`);
}

(restoreFile ? restore() : rewrite()).catch((e) => { console.error(e); process.exit(1); });
