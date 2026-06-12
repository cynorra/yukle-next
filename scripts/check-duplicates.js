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

async function checkDuplicates() {
  console.log('Checking blog_posts table...');
  const { data: blogs, error: err1 } = await supabase.from('blog_posts').select('title, language').limit(100);
  if (err1) console.error(err1);
  else {
    const counts = {};
    for (const b of blogs) {
      counts[b.title] = (counts[b.title] || 0) + 1;
    }
    console.log('Sample blog post titles:');
    console.log(Object.entries(counts).filter(x => x[1] > 1).slice(0, 5));
  }

  console.log('\nChecking loads table (often confused with blogs due to scraping)...');
  const { data: loads, error: err2 } = await supabase.from('loads').select('title').limit(100);
  if (err2) console.error(err2);
  else {
    const loadCounts = {};
    for (const l of loads) {
      loadCounts[l.title] = (loadCounts[l.title] || 0) + 1;
    }
    console.log('Sample load titles:');
    console.log(Object.entries(loadCounts).filter(x => x[1] > 1).slice(0, 5));
  }
}
checkDuplicates();
