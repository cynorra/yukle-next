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

async function cleanDuplicateContent() {
  console.log('Fetching all blog posts to remove by content hash...');
  
  let allPosts = [];
  let hasMore = true;
  let lastId = '00000000-0000-0000-0000-000000000000';

  while (hasMore) {
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('id, content')
      .order('id', { ascending: true })
      .gt('id', lastId)
      .limit(100);

    if (error) {
      console.error('Error fetching blog posts:', error.message);
      return;
    }

    if (posts && posts.length > 0) {
      const processedPosts = posts.map(p => {
        let cHash = null;
        if (p.content) {
          const cleanContent = p.content.replace(/<[^>]+>/g, '').replace(/\s+/g, '').toLowerCase();
          cHash = crypto.createHash('md5').update(cleanContent).digest('hex');
        }
        return {
          id: p.id,
          contentHash: cHash
        };
      });
      allPosts = allPosts.concat(processedPosts);
      lastId = posts[posts.length - 1].id;
      if (posts.length < 100) hasMore = false;
    } else {
      hasMore = false;
    }
  }

  console.log(`Total fetched: ${allPosts.length} blog posts.`);

  const seenHashes = new Set();
  const duplicateIds = [];

  for (const post of allPosts) {
    if (!post.contentHash) continue; // skip empty content

    if (seenHashes.has(post.contentHash)) {
      duplicateIds.push(post.id);
    } else {
      seenHashes.add(post.contentHash);
    }
  }

  console.log(`Identified ${duplicateIds.length} posts with duplicate content.`);

  if (duplicateIds.length > 0) {
    console.log('Deleting duplicates in chunks of 500...');
    const chunkSize = 500;
    for (let i = 0; i < duplicateIds.length; i += chunkSize) {
      const chunk = duplicateIds.slice(i, i + chunkSize);
      const { error: deleteError } = await supabase
        .from('blog_posts')
        .delete()
        .in('id', chunk);

      if (deleteError) {
        console.error(`Error deleting chunk ${i}:`, deleteError.message);
      } else {
        console.log(`Deleted chunk ${Math.floor(i / chunkSize) + 1} of ${Math.ceil(duplicateIds.length / chunkSize)}`);
      }
    }
    console.log('Deep duplicate removal complete.');
  } else {
    console.log('No deep duplicates found.');
  }
}

cleanDuplicateContent();
