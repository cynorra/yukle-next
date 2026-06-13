const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await supabase.from('blog_posts').select('id, title');
  if (error) {
    console.error(error);
    return;
  }
  const longTitles = data.filter(d => d.title.length > 70);
  console.log(`Total: ${data.length}, Long: ${longTitles.length}`);
  
  if (longTitles.length > 0) {
    console.log("Samples:", longTitles.slice(0, 3).map(d => d.title));
  }
}
run();
