// Weekly freshness report (universal-adsense-site-standard.md §1.5): lists
// posts older than REVIEW_AFTER_DAYS so a human can decide whether their
// pricing/regulatory specifics still hold up — this script only reports, it
// never edits content or touches created_at/updated_at itself. There's no
// separate "last substantively edited" column in blog_posts; the generator
// only ever INSERTs new posts and never UPDATEs existing ones, so created_at
// is already an accurate "untouched since" timestamp, not just a rough proxy.
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envLocalPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim();
      process.env[key] = val;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const activeKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !activeKey) {
  console.error('Supabase URL or key missing from environment.');
  process.exit(1);
}
const supabase = createClient(supabaseUrl, activeKey);

const REVIEW_AFTER_DAYS = 60;

async function main() {
  const cutoff = new Date(Date.now() - REVIEW_AFTER_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('blog_posts')
    .select('title, slug, created_at')
    .eq('language', 'en')
    .lt('created_at', cutoff)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Freshness report query failed:', error.message);
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.log(`No English posts older than ${REVIEW_AFTER_DAYS} days yet — nothing due for review.`);
    return;
  }

  const now = Date.now();
  console.log(`\n${data.length} English post(s) older than ${REVIEW_AFTER_DAYS} days — worth a skim for stale pricing/regulatory specifics:\n`);
  for (const post of data) {
    const ageDays = Math.floor((now - new Date(post.created_at).getTime()) / (24 * 60 * 60 * 1000));
    console.log(`  [${ageDays}d] ${post.title}`);
    console.log(`        /en/blog/${post.slug}`);
  }
  console.log('\nThis is a report only — nothing was edited. Update a post for real (not just its date) if its numbers/regulations have drifted.\n');
}

main().catch(e => {
  console.error('Fatal freshness-report error:', e);
  process.exit(1);
});
