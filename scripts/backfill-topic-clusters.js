// One-off backfill: tags every pre-existing blog_posts row with a topic_cluster
// so "related posts" and in-content internal linking (see blog-generator.js
// getRecentPostsForLinking, page.tsx getRelatedPosts) can match articles by
// real topic instead of pure recency. New posts get topic_cluster at
// generation time; this catches everything published before that.
//
// Classification is pure keyword scoring (title + excerpt + full body) against
// the same `topicClusters` taxonomy blog-generator.js already uses to pick
// images/topics — no API calls needed, so it's free and safe to re-run.
// Groups rows by base slug (translations of one article share a base slug,
// e.g. "some-post-en" / "some-post-tr") so one classification decision
// applies to every language variant, and only the base English row's
// title/excerpt/content is scored (translated text would need per-language
// keyword lists).
//
// Usage: node scripts/backfill-topic-clusters.js [--dry-run] [--limit N]
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { topicClusters } = require('./blog-generator');

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

if (!supabaseUrl || !serviceKey) {
  console.error('Supabase URL or service role key is missing from .env.local!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

const DRY_RUN = process.argv.includes('--dry-run');
const limitArgIdx = process.argv.indexOf('--limit');
const GROUP_LIMIT = limitArgIdx !== -1 ? parseInt(process.argv[limitArgIdx + 1], 10) : Infinity;

// A cluster keyword phrase literally repeating in the TITLE is a strong
// enough signal on its own (titles are short and deliberate). Anywhere else
// (excerpt/full body), a single incidental hit (e.g. "rate" in a long
// generic article) is too weak — require 2 distinct keyword phrases from the
// same cluster before trusting it. Falling short leaves topic_cluster null,
// which just falls back safely to the old recency-based linking rather than
// risking a wrong tag.
const MIN_ANY_HITS = 2;

function classify(title, excerpt, content) {
  const titleText = (title || '').toLowerCase();
  const bodyText = `${excerpt || ''} ${(content || '').replace(/<[^>]+>/g, ' ')}`.toLowerCase();

  let best = null;
  let bestTitleHits = 0;
  let bestAnyHits = 0;

  for (const cluster of topicClusters) {
    let titleHits = 0;
    let anyHits = 0;
    for (const kw of cluster.keywords) {
      const k = kw.toLowerCase();
      const inTitle = titleText.includes(k);
      const inBody = inTitle || bodyText.includes(k);
      if (inTitle) titleHits++;
      if (inBody) anyHits++;
    }
    // Prefer whichever cluster has a title hit; among those (or if none has
    // one) prefer the cluster with the most distinct keyword hits overall.
    const better = titleHits > bestTitleHits || (titleHits === bestTitleHits && anyHits > bestAnyHits);
    if (better) {
      bestTitleHits = titleHits;
      bestAnyHits = anyHits;
      best = cluster.name;
    }
  }

  return (bestTitleHits >= 1 || bestAnyHits >= MIN_ANY_HITS) ? best : null;
}

function baseSlugOf(slug) {
  return slug.replace(/-[a-z]{2}$/, '');
}

async function fetchAllUntaggedRows() {
  const pageSize = 1000;
  let all = [];
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, slug, title, excerpt, language')
      .is('topic_cluster', null)
      .order('slug', { ascending: true })
      .range(from, from + pageSize - 1);
    if (error) {
      console.error('Failed to fetch untagged rows:', error);
      process.exit(1);
    }
    all = all.concat(data);
    if (data.length < pageSize) break;
    from += pageSize;
  }
  return all;
}

// Fetches full article body for a batch of row ids so classify() can score
// against actual content, not just the (often keyword-thin) title/excerpt —
// titles are creatively rephrased for CTR, but a "Load Board Tactics" article
// reliably uses that niche's vocabulary throughout its 2000+ word body.
async function fetchContentByIds(ids) {
  const contentById = new Map();
  const chunkSize = 200;
  for (let i = 0; i < ids.length; i += chunkSize) {
    const chunk = ids.slice(i, i + chunkSize);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, content')
      .in('id', chunk);
    if (error) {
      console.warn('  fetchContentByIds chunk failed:', error.message);
      continue;
    }
    for (const row of data) contentById.set(row.id, row.content);
  }
  return contentById;
}

async function main() {
  console.log(DRY_RUN ? '--- DRY RUN (no writes) ---' : '--- LIVE RUN ---');

  const rows = await fetchAllUntaggedRows();
  console.log(`Found ${rows.length} untagged rows.`);

  const groups = new Map();
  for (const row of rows) {
    const key = baseSlugOf(row.slug);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }
  console.log(`Grouped into ${groups.size} distinct articles.`);

  const groupEntries = [...groups.entries()].slice(0, GROUP_LIMIT);
  const titleSources = groupEntries.map(([, groupRows]) => groupRows.find(r => r.slug.endsWith('-en')) || groupRows[0]);
  console.log(`Fetching article bodies for ${titleSources.length} title-source rows...`);
  const contentById = await fetchContentByIds(titleSources.map(r => r.id));

  let processed = 0;
  let tagged = 0;
  let unmatched = 0;
  for (let gi = 0; gi < groupEntries.length; gi++) {
    const [key, groupRows] = groupEntries[gi];
    processed++;

    const titleSource = titleSources[gi];
    const cluster = classify(titleSource.title, titleSource.excerpt, contentById.get(titleSource.id));

    if (!cluster) {
      unmatched++;
      continue;
    }
    tagged++;
    console.log(`[${processed}/${groupEntries.length}] "${titleSource.title.slice(0, 60)}" → ${cluster} (${groupRows.length} rows)`);

    if (!DRY_RUN) {
      const ids = groupRows.map(r => r.id);
      const { error } = await supabase
        .from('blog_posts')
        .update({ topic_cluster: cluster })
        .in('id', ids);
      if (error) console.error('  Failed to update rows:', error.message);
    }
  }

  console.log(`\nDone. ${tagged} articles tagged, ${unmatched} left unmatched (no confident keyword hit — safe to leave null).`);
}

main();
