const fs = require('fs');
const path = require('path');
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

const supabase = createClient(supabaseUrl, serviceKey);

async function removeDuplicates() {
  console.log('Fetching all blog posts by chunking via ID...');
  
  let allPosts = [];
  let hasMore = true;
  let lastId = '00000000-0000-0000-0000-000000000000'; // Assuming UUID

  while (hasMore) {
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('id, title, language')
      .order('id', { ascending: true })
      .gt('id', lastId)
      .limit(1000);

    if (error) {
      console.error('Error fetching blog posts:', error.message);
      return;
    }

    if (posts && posts.length > 0) {
      allPosts = allPosts.concat(posts);
      lastId = posts[posts.length - 1].id;
      console.log(`Fetched ${allPosts.length} posts...`);
      if (posts.length < 1000) {
        hasMore = false;
      }
    } else {
      hasMore = false;
    }
  }

  console.log(`Total fetched: ${allPosts.length} blog posts.`);

  const seen = new Set();
  const duplicateIds = [];

  for (const post of allPosts) {
    const key = `${post.language}:::${post.title}`;
    if (seen.has(key)) {
      duplicateIds.push(post.id);
    } else {
      seen.add(key);
    }
  }

  console.log(`Identified ${duplicateIds.length} duplicate blog posts out of ${allPosts.length}.`);

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
    console.log('Duplicate removal complete.');
  } else {
    console.log('No duplicates found.');
  }
}

removeDuplicates();
