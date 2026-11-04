// Unpublishes every non-English blog_posts row (published=true, language<>'en') in ONE statement (atomic).
//
//   node scripts/unpublish-non-en.js --backup <backup.json>             dry run: counts and backup integrity, writes nothing
//   node scripts/unpublish-non-en.js --backup <backup.json> --apply     saves the affected ids, then runs the single UPDATE
//   node scripts/unpublish-non-en.js --rollback <ids-file.json> --apply sets published=true again for exactly those ids
//
// Requires SUPABASE_SERVICE_ROLE_KEY in .env.local. Nothing is written without --apply.
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
for (const line of fs.readFileSync(path.join(ROOT, '.env.local'), 'utf8').split('\n')) {
  const i = line.indexOf('=');
  if (i > 0 && !process.env[line.slice(0, i).trim()]) process.env[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
}
const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL_ || !KEY) { console.error('Missing Supabase URL or service-role key.'); process.exit(1); }
const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' };
const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const apply = args.includes('--apply');

async function count(filter) {
  const r = await fetch(`${URL_}/rest/v1/blog_posts?select=id${filter ? '&' + filter : ''}`, { headers: { ...H, Prefer: 'count=exact', Range: '0-0' } });
  const m = /\/(\d+)$/.exec(r.headers.get('content-range') || '');
  if (!r.ok || !m) throw new Error(`count failed: ${r.status} ${await r.text()}`);
  return parseInt(m[1], 10);
}
async function ids(filter) {
  const out = [];
  for (let from = 0; ; from += 1000) {
    const r = await fetch(`${URL_}/rest/v1/blog_posts?select=id&${filter}&order=id.asc`, { headers: { ...H, Range: `${from}-${from + 999}` } });
    if (!r.ok) throw new Error(`select failed: ${r.status} ${await r.text()}`);
    const rows = await r.json();
    out.push(...rows.map((x) => x.id));
    if (rows.length < 1000) break;
  }
  return out;
}

(async () => {
  const rollback = opt('--rollback');
  if (rollback) {
    const list = JSON.parse(fs.readFileSync(path.resolve(rollback), 'utf8'));
    console.log(`rollback: ${list.length} ids from ${rollback}${apply ? '' : ' (dry run; add --apply)'}`);
    if (!apply) return;
    let done = 0;
    for (let i = 0; i < list.length; i += 200) {
      const chunk = list.slice(i, i + 200);
      const r = await fetch(`${URL_}/rest/v1/blog_posts?id=in.(${chunk.join(',')})`, { method: 'PATCH', headers: { ...H, Prefer: 'count=exact,return=minimal' }, body: JSON.stringify({ published: true }) });
      if (!r.ok) throw new Error(`rollback failed: ${r.status} ${await r.text()}`);
      done += parseInt((/\/(\d+)$/.exec(r.headers.get('content-range') || '') || [0, 0])[1], 10);
    }
    console.log('rolled back rows:', done);
    return;
  }

  const backupFile = opt('--backup');
  if (!backupFile) { console.error('--backup <file> is required'); process.exit(1); }
  const backup = JSON.parse(fs.readFileSync(path.resolve(backupFile), 'utf8'));
  const total = await count('');
  const target = 'language=neq.en&published=eq.true';
  const targetCount = await count(target);
  const backupTarget = backup.filter((r) => r.language !== 'en' && r.published).map((r) => r.id);
  console.log(`backup rows: ${backup.length} | current table rows: ${total}`);
  console.log(`SELECT count where language<>'en' AND published=true: ${targetCount} | same set in backup: ${backupTarget.length}`);
  const currentIds = await ids(target);
  const backupSet = new Set(backupTarget);
  const same = currentIds.length === backupTarget.length && currentIds.every((id) => backupSet.has(id));
  console.log(`current target ids equal the backup's target ids: ${same}`);
  console.log(`English rows published now: ${await count('language=eq.en&published=eq.true')}`);
  if (backup.length !== 3368 || total !== 3368 || !same) { console.error('Integrity check FAILED; refusing to continue.'); process.exit(1); }
  if (!apply) return console.log('dry run only; nothing written.');

  fs.mkdirSync(path.join(ROOT, 'backups'), { recursive: true });
  const idsFile = path.join(ROOT, 'backups', `unpublish-non-en-ids-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
  fs.writeFileSync(idsFile, JSON.stringify(currentIds));
  console.log('affected ids saved:', path.relative(ROOT, idsFile));
  const r = await fetch(`${URL_}/rest/v1/blog_posts?${target}`, { method: 'PATCH', headers: { ...H, Prefer: 'count=exact,return=minimal' }, body: JSON.stringify({ published: false }) });
  if (!r.ok) throw new Error(`UPDATE failed: ${r.status} ${await r.text()}`);
  const affected = parseInt((/\/(\d+)$/.exec(r.headers.get('content-range') || '') || [0, 0])[1], 10);
  console.log(`UPDATE (single statement) affected rows: ${affected}`);
  console.log(`after: non-en published = ${await count(target)} | English published = ${await count('language=eq.en&published=eq.true')} | total rows = ${await count('')}`);
  console.log(`rollback: node scripts/unpublish-non-en.js --rollback ${path.relative(ROOT, idsFile)} --apply`);
})().catch((e) => { console.error(e); process.exit(1); });
