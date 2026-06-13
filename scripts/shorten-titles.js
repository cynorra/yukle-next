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

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

function shortenTitle(title, maxLength = 65) {
  if (title.length <= maxLength) return title;
  const truncated = title.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + '...';
  }
  return truncated + '...';
}

async function run() {
  console.log('Fetching blogs to check title lengths...');
  let allPosts = [];
  let hasMore = true;
  let lastId = '00000000-0000-0000-0000-000000000000';

  while (hasMore) {
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('id, title')
      .order('id', { ascending: true })
      .gt('id', lastId)
      .limit(1000);

    if (error) {
      console.error(error);
      return;
    }
    if (posts && posts.length > 0) {
      allPosts = allPosts.concat(posts);
      lastId = posts[posts.length - 1].id;
    } else {
      hasMore = false;
    }
  }

  const toUpdate = allPosts.filter(p => p.title.length > 70);
  console.log(`Found ${toUpdate.length} posts with titles > 70 chars out of ${allPosts.length} total.`);

  for (let i = 0; i < toUpdate.length; i++) {
    const post = toUpdate[i];
    const newTitle = shortenTitle(post.title, 65);
    const { error } = await supabase
      .from('blog_posts')
      .update({ title: newTitle })
      .eq('id', post.id);
    
    if (error) {
      console.error(`Error updating post ${post.id}:`, error);
    }
    
    if (i % 100 === 0) {
      console.log(`Updated ${i} of ${toUpdate.length}`);
    }
  }
  console.log('Finished shortening titles.');
}

run();
