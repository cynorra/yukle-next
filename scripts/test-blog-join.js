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
const supabaseKey = env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBlogsJoin() {
  console.log('Testing select(*, author:profiles(full_name)) with ANON KEY...');
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*, author:profiles(full_name)')
    .limit(5);

  if (error) {
    console.error('Supabase ERROR:', error.message, error.details, error.hint);
  } else {
    console.log('SUCCESS! Got data:', data.length);
    console.log(data[0]);
  }
}

checkBlogsJoin();
