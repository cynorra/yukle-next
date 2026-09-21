// One-off cleanup of the stale year "2025" in published English articles. GENERATE-ONLY: it never writes to
// the database. It plans the edits (scripts/lib/year-refresh.js), then writes SQL files that a person runs in
// the Supabase SQL Editor - the same review-then-run workflow as the earlier first-party-claim cleanups.
//
//   node scripts/year-refresh.js plan   [--out D:/android-projeler/backups/]   # -> year-refresh-edits.json + REVIEW
//   node scripts/year-refresh.js sql    [--out ...] [--per-file 40]            # -> year-refresh-partNNofMM.sql
//
// The SQL turns triggers off for its transaction (session_replication_role = replica) so the visible "Updated"
// date is not changed by what is only a wording edit, and it raises (rolling back) if updated_at got bumped anyway.

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const YR = require('./lib/year-refresh');

const ROOT = path.join(__dirname, '..');
const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : def; };
const OUT = opt('out', 'D:/android-projeler/backups/').replace(/\/?$/, '/');
const PER_FILE = parseInt(opt('per-file', '40'), 10);
const EDITS_FILE = OUT + 'year-refresh-edits.json';
const FIELDS = ['title', 'excerpt', 'meta_title', 'meta_description'];

const envLocal = path.join(ROOT, '.env.local');
if (fs.existsSync(envLocal)) {
  for (const line of fs.readFileSync(envLocal, 'utf8').split('\n')) {
    const i = line.indexOf('=');
    if (i > 0 && !process.env[line.slice(0, i).trim()]) process.env[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
  }
}
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const strip = (s) => String(s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

async function loadPosts(ids) {
  const cols = 'id,slug,title,excerpt,meta_title,meta_description,content';
  const rows = [];
  if (ids) {
    for (let i = 0; i < ids.length; i += 60) {
      const { data, error } = await sb.from('blog_posts').select(cols).in('id', ids.slice(i, i + 60));
      if (error) throw error;
      rows.push(...data);
    }
    return rows;
  }
  for (let from = 0; ; from += 200) {
    const { data, error } = await sb.from('blog_posts').select(cols).eq('published', true).eq('language', 'en').range(from, from + 199);
    if (error) throw error;
    rows.push(...data);
    if (data.length < 200) break;
  }
  return rows;
}

async function plan() {
  const posts = await loadPosts();
  const result = {};
  const stats = { posts: posts.length, planned: 0, fragments: 0, edited: 0, skippedNoChange: 0, rejected: {}, fieldEdits: 0, before2025: 0, after2025: 0 };
  const samples = [];
  for (const p of posts) {
    const edits = [], fields = [];
    const seen = new Set();
    for (const f of YR.findYearFragments(p.content)) {
      stats.fragments++;
      if (seen.has(f.outer)) continue;
      seen.add(f.outer);
      const nw = YR.refreshHtml(f.inner);
      const why = YR.checkEdit(f.inner, nw);
      if (why === 'unchanged') { stats.skippedNoChange++; continue; }
      if (why) { stats.rejected[why] = (stats.rejected[why] || 0) + 1; continue; }
      edits.push({ tag: f.tag, old: f.outer, nw: `<${f.tag}${f.attrs}>${nw}</${f.tag}>`, deleted: false });
      stats.edited++;
      if (samples.length < 4000) samples.push({ slug: p.slug, tag: f.tag, before: strip(f.inner), after: strip(nw) });
    }
    for (const col of FIELDS) {
      const v = p[col];
      if (!v || !v.includes('2025')) continue;
      const nw = YR.refreshHtml(v);
      const why = YR.checkEdit(v, nw);
      if (!why) { fields.push({ col, old: v, nw }); stats.fieldEdits++; } else if (why !== 'unchanged') stats.rejected['field: ' + why] = (stats.rejected['field: ' + why] || 0) + 1;
    }
    let after = p.content;
    for (const e of [...edits].sort((a, b) => b.old.length - a.old.length)) after = after.split(e.old).join(e.nw);
    stats.before2025 += (strip(p.content).match(/\b2025\b/g) || []).length;
    stats.after2025 += (strip(after).match(/\b2025\b/g) || []).length;
    if (edits.length || fields.length) { result[p.id] = { slug: p.slug, edits, fields, manual: [], residual: null }; stats.planned++; }
  }
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(EDITS_FILE, JSON.stringify(result));
  // random review sample (deterministic order by index stride) + every distinct "before" pattern kind
  const stride = Math.max(1, Math.floor(samples.length / 120));
  const pick = samples.filter((_, i) => i % stride === 0).slice(0, 120);
  let rev = `YEAR REFRESH — REVIEW SAMPLE (${pick.length} of ${samples.length} edits)\n\n`;
  for (const s of pick) rev += `[${s.tag}] ${s.slug}\n  - ${s.before.slice(0, 300)}\n  + ${s.after.slice(0, 300)}\n\n`;
  fs.writeFileSync(OUT + 'year-refresh-REVIEW-sample.txt', rev);
  console.log(JSON.stringify(stats, null, 2));
  console.log(`edits file: ${EDITS_FILE}\nreview sample: ${OUT}year-refresh-REVIEW-sample.txt`);
}

const dq = (tag, s) => { if (s.includes('$' + tag + '$')) throw new Error('dollar tag collision'); return `$${tag}$${s}$${tag}$`; };

async function sql() {
  const edits = JSON.parse(fs.readFileSync(EDITS_FILE, 'utf8'));
  const ids = Object.keys(edits);
  const cur = {};
  for (const p of await loadPosts(ids)) cur[p.id] = p;
  fs.writeFileSync(OUT + 'year-refresh-originals.json', JSON.stringify(cur));
  const posts = [];
  let stale = 0;
  for (const id of ids) {
    const e = edits[id], p = cur[id];
    if (!p) continue;
    const okEdits = [];
    const seen = new Set();
    for (const ed of e.edits) { if (seen.has(ed.old)) continue; seen.add(ed.old); if (p.content.includes(ed.old)) okEdits.push(ed); else stale++; }
    const okFields = e.fields.filter((f) => p[f.col] === f.old);
    if (okEdits.length || okFields.length) posts.push({ p, okEdits, okFields });
  }
  const parts = Math.ceil(posts.length / PER_FILE);
  for (let i = 0; i < parts; i++) {
    const slice = posts.slice(i * PER_FILE, (i + 1) * PER_FILE);
    let out = `-- Stale-year cleanup: drop "2025" used only as framing ("in 2025", "for 2025", "the 2025 freight market") — part ${i + 1}/${parts} (${slice.length} posts)
-- Run in Supabase Dashboard -> SQL Editor. ONE transaction: it raises and rolls back if updated_at gets bumped
-- (triggers are switched off for it, so the visible "Updated" date is NOT changed).
-- Originals of every touched post are saved in year-refresh-originals.json.
begin;
set local session_replication_role = replica;

`;
    for (const { p, okEdits, okFields } of slice) {
      const sets = [];
      if (okEdits.length) {
        let expr = 'content';
        for (const ed of okEdits) expr = `replace(${expr}, ${dq('o', ed.old)}, ${dq('n', ed.nw)})`;
        sets.push(`content = ${expr}`);
      }
      for (const f of okFields) sets.push(`${f.col} = case when ${f.col} = ${dq('o', f.old)} then ${dq('n', f.nw)} else ${f.col} end`);
      out += `-- ${p.slug}\nupdate public.blog_posts set\n  ${sets.join(',\n  ')}\nwhere id = '${p.id}' and language = 'en';\n\n`;
    }
    out += `do $$
begin
  if exists (select 1 from public.blog_posts where updated_at > now() - interval '3 minutes') then
    raise exception 'updated_at was bumped - trigger still active, rolling everything back';
  end if;
end $$;

commit;
`;
    fs.writeFileSync(OUT + `year-refresh-part${String(i + 1).padStart(2, '0')}of${parts}.sql`, out);
  }
  // slugs list for revalidation
  fs.writeFileSync(OUT + 'year-refresh-slugs.json', JSON.stringify(posts.map((x) => ({ language: 'en', slug: x.p.slug }))));
  console.log(`posts to update: ${posts.length} in ${parts} SQL files (${PER_FILE} posts each) | stale proposals dropped: ${stale}\nfiles in ${OUT}: year-refresh-partNNof${parts}.sql, year-refresh-originals.json, year-refresh-slugs.json`);
}

const mode = args[0];
(mode === 'plan' ? plan() : mode === 'sql' ? sql() : Promise.reject(new Error('usage: node scripts/year-refresh.js plan|sql [--out DIR] [--per-file N]')))
  .catch((err) => { console.error('FAILED:', err.message); process.exit(1); });
