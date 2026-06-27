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

const supabase = createClient(env['NEXT_PUBLIC_SUPABASE_URL'], env['NEXT_PUBLIC_SUPABASE_ANON_KEY']);

async function test() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('language')
    .eq('published', true);
    
  if (error) console.error(error);
  else {
    const counts = {};
    data.forEach(d => {
      counts[d.language] = (counts[d.language] || 0) + 1;
    });
    console.log(counts);
  }
}
test();
