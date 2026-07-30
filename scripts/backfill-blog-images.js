// One-off backfill for blog_posts rows whose cover_image is a broken loremflickr
// relative path (e.g. "/cache/resized/x.jpg") stored before the URL-resolution fix
// in blog-generator.js. Groups rows by base article (translations of the same
// article share one slug prefix, e.g. "some-post-en" / "some-post-tr") so each
// article only costs one Pexels API call + one image download, not one per language.
//
// Usage: node scripts/backfill-blog-images.js [--dry-run] [--limit N]
const fs = require('fs');
const path = require('path');
const https = require('https');
const { createClient } = require('@supabase/supabase-js');

const envLocalPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      process.env[parts[0].trim()] = parts.slice(1).join('=').trim();
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const BLOG_COVERS_BUCKET = 'blog-covers';

if (!supabaseUrl || !serviceKey) {
  console.error('Supabase URL or service role key is missing from .env.local!');
  process.exit(1);
}
if (!PEXELS_API_KEY) {
  console.error('PEXELS_API_KEY is missing from .env.local!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

const DRY_RUN = process.argv.includes('--dry-run');
const limitArgIdx = process.argv.indexOf('--limit');
// Dry run still performs real Pexels calls + storage uploads (only the
// blog_posts update is skipped), so default it to a small preview unless the
// caller explicitly asks for more.
const GROUP_LIMIT = limitArgIdx !== -1 ? parseInt(process.argv[limitArgIdx + 1], 10) : (DRY_RUN ? 3 : Infinity);

// Pexels free tier: 200 req/hour, 20000/month. One group = one search call
// (occasionally two if every top result is already used). Stay well under that.
const DELAY_BETWEEN_GROUPS_MS = 4000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const STOPWORDS = new Set([
  'the', 'a', 'an', 'to', 'of', 'for', 'in', 'on', 'and', 'or', 'your', 'you', 'how',
  'why', 'what', 'when', 'is', 'are', 'with', 'from', 'by', 'at', 'as', 'it', 'this',
  'that', 'guide', 'playbook', 'masterclass', 'ultimate', 'complete', 'proven',
  'strategies', 'strategy', 'tips', 'best', 'top', 'vs', 'cut', 'costs', 'cost',
  'boost', 'slash', 'avoid', 'secure', 'maximize', 'minimize', 'reduce', 'improve',
  'guarantee', 'win', 'decision', 'expert', 'playbooks', '2025', '2026'
]);

function extractQueryFromTitle(title) {
  const words = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w) && isNaN(Number(w)));
  return words.slice(0, 4).join(' ').trim();
}

function pexelsSearch(query, perPage = 15) {
  return new Promise((resolve) => {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`;
    const req = https.get(url, { headers: { Authorization: PEXELS_API_KEY } }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(Array.isArray(parsed.photos) ? parsed.photos : []);
        } catch {
          resolve([]);
        }
      });
    });
    req.on('error', () => resolve([]));
    req.setTimeout(10000, () => { req.destroy(); resolve([]); });
  });
}

function downloadImageBuffer(url, redirectsLeft = 3) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirectsLeft > 0) {
        res.resume();
        downloadImageBuffer(new URL(res.headers.location, url).href, redirectsLeft - 1).then(resolve, reject);
        return;
      }
      if (res.statusCode !== 200) {
        res.resume();
        reject(new Error(`Download failed with status ${res.statusCode}`));
        return;
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function getUsedPhotoIds(photoIds) {
  if (photoIds.length === 0) return new Set();
  const { data, error } = await supabase
    .from('used_blog_images')
    .select('photo_id')
    .in('photo_id', photoIds.map(String));
  if (error || !data) return new Set();
  return new Set(data.map((r) => r.photo_id));
}

async function markPhotoIdUsed(photoId) {
  await supabase.from('used_blog_images').insert({ photo_id: String(photoId) });
}

async function uploadCoverImage(photoId, buffer) {
  const filePath = `pexels-${photoId}.jpg`;
  const { error } = await supabase.storage
    .from(BLOG_COVERS_BUCKET)
    .upload(filePath, buffer, { contentType: 'image/jpeg', upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from(BLOG_COVERS_BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}

const FALLBACK_QUERIES = ['truck highway', 'freight logistics', 'cargo shipping', 'warehouse forklift', 'supply chain'];

async function getFreshCoverImageForTitle(title) {
  const queries = [extractQueryFromTitle(title), ...FALLBACK_QUERIES].filter(Boolean);
  for (const query of queries) {
    const photos = await pexelsSearch(query, 15);
    if (photos.length === 0) continue;
    const usedIds = await getUsedPhotoIds(photos.map((p) => p.id));
    for (const photo of photos) {
      if (usedIds.has(String(photo.id))) continue;
      try {
        const srcUrl = photo.src?.large2x || photo.src?.large || photo.src?.original;
        const buffer = await downloadImageBuffer(srcUrl);
        const publicUrl = await uploadCoverImage(photo.id, buffer);
        await markPhotoIdUsed(photo.id);
        return { url: publicUrl, query, photoId: photo.id };
      } catch (err) {
        console.warn(`  [Image] Failed pexels#${photo.id}:`, err.message);
      }
    }
  }
  return null;
}

function baseSlugOf(slug) {
  return slug.replace(/-[a-z]{2}$/, '');
}

async function fetchAllBrokenRows() {
  // Paginate the full set before grouping — translations of the same article
  // share a base slug, and grouping page-by-page risks splitting one article's
  // language rows across two pages, which would assign them different images.
  const pageSize = 1000;
  let all = [];
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, slug, title, cover_image')
      .like('cover_image', '/cache/resized/%')
      .order('slug', { ascending: true })
      .range(from, from + pageSize - 1);
    if (error) {
      console.error('Failed to fetch broken rows:', error);
      process.exit(1);
    }
    all = all.concat(data);
    if (data.length < pageSize) break;
    from += pageSize;
  }
  return all;
}

async function main() {
  console.log(DRY_RUN ? '--- DRY RUN (no writes) ---' : '--- LIVE RUN ---');

  const rows = await fetchAllBrokenRows();
  console.log(`Found ${rows.length} rows with broken cover_image.`);

  const groups = new Map();
  for (const row of rows) {
    const key = baseSlugOf(row.slug);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }
  console.log(`Grouped into ${groups.size} distinct articles.`);

  let processed = 0;
  let failed = 0;
  for (const [key, groupRows] of groups) {
    if (processed >= GROUP_LIMIT) break;
    processed++;
    // Prefer the English title if present in the group for the most reliable keyword extraction
    const titleSource = groupRows.find((r) => r.slug.endsWith('-en')) || groupRows[0];
    console.log(`\n[group ${processed}/${Math.min(groups.size, GROUP_LIMIT)}] "${key}" (${groupRows.length} language rows) — title: "${titleSource.title.slice(0, 70)}"`);

    const result = await getFreshCoverImageForTitle(titleSource.title);
    if (!result) {
      console.warn('  No replacement image found, skipping group.');
      failed++;
      continue;
    }
    console.log(`  → query "${result.query}" → pexels#${result.photoId} → ${result.url}`);

    if (!DRY_RUN) {
      const ids = groupRows.map((r) => r.id);
      const { error: updateErr } = await supabase
        .from('blog_posts')
        .update({ cover_image: result.url })
        .in('id', ids);
      if (updateErr) {
        console.error('  Failed to update rows:', updateErr.message);
        failed++;
      }
    }

    await sleep(DELAY_BETWEEN_GROUPS_MS);
  }

  console.log(`\nDone. Processed ${processed} article groups, ${failed} failed.`);
}

main();
