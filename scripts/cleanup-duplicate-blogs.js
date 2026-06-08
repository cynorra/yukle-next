const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load env variables from .env.local
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
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || (!serviceKey && !anonKey)) {
  console.error('Supabase URL or Key is missing from .env.local!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey || anonKey);

async function cleanupDuplicateBlogs() {
  console.log('=== Blog Duplicate Cleanup Script ===\n');

  // ── 1. Fetch ALL blog posts ──────────────────────────────────────────────
  console.log('Fetching all blog posts from database...');
  const { data: allPosts, error } = await supabase
    .from('blog_posts')
    .select('id, slug, title, language, cover_image, created_at')
    .order('created_at', { ascending: true }); // oldest first → we keep these

  if (error) {
    console.error('Failed to fetch blog posts:', error.message);
    process.exit(1);
  }

  console.log(`Total posts in DB: ${allPosts.length}\n`);

  // ── 2. Detect duplicate slugs ────────────────────────────────────────────
  const slugMap = new Map(); // slug → [posts ordered oldest→newest]
  for (const post of allPosts) {
    if (!slugMap.has(post.slug)) slugMap.set(post.slug, []);
    slugMap.get(post.slug).push(post);
  }

  const duplicateSlugs = [...slugMap.entries()].filter(([, posts]) => posts.length > 1);
  console.log(`Duplicate slug groups found: ${duplicateSlugs.length}`);

  const idsToDeleteBySlug = [];
  for (const [slug, posts] of duplicateSlugs) {
    const keeper = posts[0]; // oldest → keep
    const dupes = posts.slice(1);
    console.log(`  Slug "${slug}": keeping id=${keeper.id}, deleting ${dupes.length} duplicate(s)`);
    dupes.forEach(d => idsToDeleteBySlug.push(d.id));
  }

  // ── 3. Detect duplicate titles per language ──────────────────────────────
  // (same title + same language = duplicate topic run)
  const titleLangMap = new Map(); // `${lang}::${title_lower}` → [posts]
  for (const post of allPosts) {
    const key = `${post.language}::${post.title.toLowerCase().trim()}`;
    if (!titleLangMap.has(key)) titleLangMap.set(key, []);
    titleLangMap.get(key).push(post);
  }

  const duplicateTitles = [...titleLangMap.entries()].filter(([, posts]) => posts.length > 1);
  console.log(`\nDuplicate title+language groups found: ${duplicateTitles.length}`);

  const idsToDeleteByTitle = [];
  for (const [key, posts] of duplicateTitles) {
    const keeper = posts[0]; // oldest → keep
    const dupes = posts.slice(1);
    // Skip if already queued for deletion by slug
    const newDupes = dupes.filter(d => !idsToDeleteBySlug.includes(d.id));
    if (newDupes.length > 0) {
      console.log(`  Title+lang "${key}": keeping id=${keeper.id}, deleting ${newDupes.length} extra(s)`);
      newDupes.forEach(d => idsToDeleteByTitle.push(d.id));
    }
  }

  // ── 4. Detect posts sharing the same cover_image within same base-slug group ─
  // A "base slug group" = posts whose slug shares the same slug prefix (before the lang suffix)
  // e.g. "safe-truck-driving-en" and "safe-truck-driving-tr" are the same article group
  const baseSlugGroupMap = new Map();
  for (const post of allPosts) {
    // Strip last segment if it looks like a lang code (2-3 chars) or lang code + number suffix
    const baseSlug = post.slug.replace(/-[a-z]{2,3}(-\d+)?$/, '');
    if (!baseSlugGroupMap.has(baseSlug)) baseSlugGroupMap.set(baseSlug, []);
    baseSlugGroupMap.get(baseSlug).push(post);
  }

  // Identify cover_image duplicates ACROSS different base-slug groups
  const usedImageMap = new Map(); // url → first post that used it (by created_at)
  const idsWithDuplicateImage = [];
  // Sort groups by oldest post's created_at
  const sortedGroups = [...baseSlugGroupMap.values()].sort((a, b) =>
    new Date(a[0].created_at) - new Date(b[0].created_at)
  );

  for (const groupPosts of sortedGroups) {
    const image = groupPosts[0]?.cover_image;
    if (!image) continue;
    if (usedImageMap.has(image)) {
      // This group reuses an image from a different (older) group
      // We don't delete these posts, but we log them so the user is aware
      // (fixing images requires regeneration, not deletion)
      console.log(`  [INFO] Image reuse detected: "${image.slice(0, 60)}..." used in multiple article groups`);
    } else {
      usedImageMap.set(image, groupPosts[0].id);
    }
  }

  // ── 5. Merge all IDs to delete ───────────────────────────────────────────
  const allIdsToDelete = [...new Set([...idsToDeleteBySlug, ...idsToDeleteByTitle])];

  if (allIdsToDelete.length === 0) {
    console.log('\n✅ No duplicates found. Database is clean!');
    return;
  }

  console.log(`\n🗑  Total posts to delete: ${allIdsToDelete.length}`);
  console.log('IDs:', allIdsToDelete.join(', '));

  // ── 6. Delete in batches of 100 ──────────────────────────────────────────
  const batchSize = 100;
  let totalDeleted = 0;

  for (let i = 0; i < allIdsToDelete.length; i += batchSize) {
    const batch = allIdsToDelete.slice(i, i + batchSize);
    const { error: delError, count } = await supabase
      .from('blog_posts')
      .delete({ count: 'exact' })
      .in('id', batch);

    if (delError) {
      console.error(`Failed to delete batch starting at index ${i}:`, delError.message);
    } else {
      totalDeleted += (count || batch.length);
      console.log(`  Deleted batch ${Math.floor(i / batchSize) + 1}: ${count || batch.length} posts`);
    }
  }

  console.log(`\n✅ Cleanup complete. Deleted ${totalDeleted} duplicate posts.`);

  // ── 7. Final count ───────────────────────────────────────────────────────
  const { count: remaining } = await supabase
    .from('blog_posts')
    .select('id', { count: 'exact', head: true });

  console.log(`📊 Remaining posts in DB: ${remaining}`);
}

cleanupDuplicateBlogs().catch(e => {
  console.error('Fatal error during cleanup:', e);
  process.exit(1);
});
