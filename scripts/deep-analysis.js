const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

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

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function deepAnalysis() {
  console.log('Fetching blog posts for deep analysis (100 at a time)...');
  
  let allPosts = [];
  let hasMore = true;
  let lastId = '00000000-0000-0000-0000-000000000000';

  while (hasMore) {
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('id, title, slug, language, content')
      .order('id', { ascending: true })
      .gt('id', lastId)
      .limit(100);

    if (error) {
      console.error('Error fetching blog posts:', error.message);
      return;
    }

    if (posts && posts.length > 0) {
      // Map to only store hashes to save RAM
      const processedPosts = posts.map(p => {
        let cHash = null;
        if (p.content) {
          const cleanContent = p.content.replace(/<[^>]+>/g, '').replace(/\s+/g, '').toLowerCase();
          cHash = crypto.createHash('md5').update(cleanContent).digest('hex');
        }
        return {
          id: p.id,
          title: p.title,
          slug: p.slug,
          language: p.language,
          contentHash: cHash
        };
      });
      allPosts = allPosts.concat(processedPosts);
      lastId = posts[posts.length - 1].id;
      console.log(`Fetched ${allPosts.length} posts...`);
      if (posts.length < 100) hasMore = false;
    } else {
      hasMore = false;
    }
  }

  console.log(`Total fetched: ${allPosts.length} blog posts.`);

  const titleCounts = {};
  const slugCounts = {};
  const contentCounts = {};

  for (const post of allPosts) {
    const tKey = post.title.trim().toLowerCase();
    titleCounts[tKey] = (titleCounts[tKey] || 0) + 1;

    const sKey = post.slug ? post.slug.trim().toLowerCase() : 'null-slug';
    slugCounts[sKey] = (slugCounts[sKey] || 0) + 1;

    if (post.contentHash) {
      const cHash = post.contentHash;
      if (!contentCounts[cHash]) {
        contentCounts[cHash] = { count: 0, sampleTitle: post.title, sampleLang: post.language };
      }
      contentCounts[cHash].count++;
    }
  }

  const dupTitles = Object.entries(titleCounts).filter(x => x[1] > 1);
  console.log(`\nFound ${dupTitles.length} titles that appear more than once.`);
  
  const dupSlugs = Object.entries(slugCounts).filter(x => x[1] > 1);
  console.log(`\nFound ${dupSlugs.length} slugs that appear more than once.`);

  const dupContents = Object.entries(contentCounts).filter(x => x[1].count > 1);
  console.log(`\nFound ${dupContents.length} unique contents that are duplicated across multiple posts.`);
  if (dupContents.length > 0) {
    console.log('Sample duplicate content groups:');
    dupContents.slice(0, 5).forEach(c => {
      console.log(`- Content Hash: ${c[0]} | Copies: ${c[1].count} | Sample Title: "${c[1].sampleTitle}" (${c[1].sampleLang})`);
    });
  }

  let totalRedundantByContent = 0;
  for (const c of dupContents) {
    totalRedundantByContent += (c[1].count - 1);
  }
  console.log(`\nIf we delete posts with duplicate content, we would remove ${totalRedundantByContent} posts.`);
}

deepAnalysis();
