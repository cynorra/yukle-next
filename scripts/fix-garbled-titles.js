/**
 * fix-garbled-titles.js
 *
 * One-off cleanup for the title-dedup bug in blog-generator.js: when a
 * duplicate title was detected, the old code appended a random 3-5 digit
 * number straight onto the visible title (e.g. "...Customs Compliance 9443").
 * That number leaked into the H1, JSON-LD headline, OG title, and social
 * share text for every language variant of the affected post.
 *
 * meta_title was never touched by that bug, so for a genuinely-affected row
 * meta_title will NOT end in the same trailing number. We use that as a
 * safety check before stripping, so we don't accidentally strip a real
 * trailing number that was always part of the title (e.g. "ISO 9001").
 *
 * Usage: node scripts/fix-garbled-titles.js [--apply]
 *   (no flag = dry run, only prints what would change)
 */
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envLocalPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envLocalPath)) {
  fs.readFileSync(envLocalPath, 'utf8').split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      process.env[parts[0].trim()] = parts.slice(1).join('=').trim();
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, serviceKey);

const APPLY = process.argv.includes('--apply');
const TRAILING_NUMBER_RE = /^(.*\S)\s+(\d{3,5})$/;
// A trailing number that looks like a plausible year is very likely a real,
// intentional part of the title (e.g. "...Prevention Guide 2025"), not the
// randomly-injected dedup suffix (which is uniformly random 1000-9999).
// Skip these for manual review instead of auto-stripping a real year.
const YEAR_MIN = 2015;
const YEAR_MAX = 2035;

async function main() {
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('id, title, meta_title, slug, language');
  if (error) { console.error('Fetch error:', error); process.exit(1); }

  const toFix = [];
  const ambiguous = [];

  for (const post of posts) {
    const m = (post.title || '').match(TRAILING_NUMBER_RE);
    if (!m) continue;
    const [, cleanTitle, trailingNumberStr] = m;
    const trailingNumber = parseInt(trailingNumberStr, 10);

    // Safety check 1: plausible year (e.g. "...Guide 2025") — likely real content.
    const looksLikeYear = trailingNumber >= YEAR_MIN && trailingNumber <= YEAR_MAX;

    // Safety check 2: meta_title was never mutated by the bug. If the same
    // number appears anywhere in meta_title as a standalone token, it's
    // probably legitimate content that happens to end the title too.
    const metaTitle = post.meta_title || '';
    const numberTokenRe = new RegExp(`(^|\\D)${trailingNumberStr}(\\D|$)`);
    const numberAlsoInMeta = numberTokenRe.test(metaTitle);

    if (looksLikeYear || numberAlsoInMeta) {
      ambiguous.push(post);
      continue;
    }

    toFix.push({ ...post, cleanTitle });
  }

  console.log(`Scanned ${posts.length} posts.`);
  console.log(`Confirmed garbled titles to fix: ${toFix.length}`);
  console.log(`Ambiguous (skipped, trailing number also in meta_title): ${ambiguous.length}`);

  if (ambiguous.length) {
    console.log('\n--- Ambiguous (review manually) ---');
    ambiguous.forEach(p => console.log(`  [${p.language}] ${p.title}`));
  }

  console.log('\n--- Titles that will be fixed ---');
  toFix.slice(0, 20).forEach(p => console.log(`  [${p.language}] "${p.title}" -> "${p.cleanTitle}"`));
  if (toFix.length > 20) console.log(`  ... and ${toFix.length - 20} more`);

  if (!APPLY) {
    console.log('\nDry run only. Re-run with --apply to write changes.');
    return;
  }

  let updated = 0;
  for (const post of toFix) {
    const { error: updErr } = await supabase
      .from('blog_posts')
      .update({ title: post.cleanTitle })
      .eq('id', post.id);
    if (updErr) {
      console.error(`Failed to update ${post.id}:`, updErr.message);
    } else {
      updated++;
    }
  }
  console.log(`\nDone. Updated ${updated}/${toFix.length} rows.`);
}

main();
