// node android-app/store-listing/csv/generate.mjs
// Writes store-listing/google_play_translations.csv in Play Console import format:
// header Language,Title,Short description,Full description; UTF-8 no BOM; CRLF rows;
// limits counted in code points (title 30, short 80, full 4000).
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { FULL, LOCALES, FALLBACK } from './content.mjs';

const LIMITS = { title: 30, short: 80, full: 4000 };
const len = (s) => [...s].length;
const esc = (s) => (/[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);

const full = (c) => [
  c.i, '', c.h1, ...c.a.map((x) => `✓ ${x}`), '', c.h2, ...c.b.map((x) => `✓ ${x}`), '', c.w, '', c.v,
].join('\n');

const errors = [];
const rows = ['Language,Title,Short description,Full description'];
for (const loc of LOCALES) {
  const src = FULL[loc] ? loc : (FALLBACK[loc] ?? 'en-US');
  const c = FULL[src];
  const [t, s, f] = [c.t, c.s, full(c)];
  if (len(t) > LIMITS.title) errors.push(`${loc} title ${len(t)}/${LIMITS.title}: ${t}`);
  if (len(s) > LIMITS.short) errors.push(`${loc} short ${len(s)}/${LIMITS.short}: ${s}`);
  if (len(f) > LIMITS.full) errors.push(`${loc} full ${len(f)}/${LIMITS.full}`);
  rows.push([loc, t, s, f].map(esc).join(','));
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
if (!LOCALES.includes('en-US')) throw new Error('en-US row is required');

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'google_play_translations.csv');
writeFileSync(out, rows.join('\r\n') + '\r\n', 'utf8');
console.log(`wrote ${rows.length - 1} rows (${Object.keys(FULL).length} translated, rest reuse nearest) -> ${out}`);
