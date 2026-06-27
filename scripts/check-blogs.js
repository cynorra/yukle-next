const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  if (line.includes('=')) {
    const [key, ...rest] = line.split('=');
    env[key.trim()] = rest.join('=').trim().replace(/['"]/g, '');
  }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'] || env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or Key is missing.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBlogs() {
  console.log('Checking blog_posts table...');
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, language, published, slug');

  if (error) {
    console.error('Error fetching blogs:', error);
    return;
  }

  console.log(`Found ${data.length} blogs.`);
  data.forEach(b => console.log(`- [${b.language}] ${b.title} (Published: ${b.published})`));
}

checkBlogs();
