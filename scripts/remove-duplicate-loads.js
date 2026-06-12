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

async function removeDuplicateLoads() {
  console.log('Fetching all loads by chunking via ID...');
  
  let allLoads = [];
  let hasMore = true;
  let lastId = '00000000-0000-0000-0000-000000000000';

  while (hasMore) {
    const { data: loads, error } = await supabase
      .from('loads')
      .select('id, title')
      .order('id', { ascending: true })
      .gt('id', lastId)
      .limit(1000); // supabase cap

    if (error) {
      console.error('Error fetching loads:', error.message);
      return;
    }

    if (loads && loads.length > 0) {
      allLoads = allLoads.concat(loads);
      lastId = loads[loads.length - 1].id;
      console.log(`Fetched ${allLoads.length} loads...`);
      if (loads.length < 1000) hasMore = false;
    } else {
      hasMore = false;
    }
  }

  console.log(`Total fetched: ${allLoads.length} loads.`);

  const seen = new Set();
  const duplicateIds = [];

  for (const load of allLoads) {
    const key = load.title; // duplicate title means duplicate generated load
    if (seen.has(key)) {
      duplicateIds.push(load.id);
    } else {
      seen.add(key);
    }
  }

  console.log(`Identified ${duplicateIds.length} duplicate loads out of ${allLoads.length}.`);

  if (duplicateIds.length > 0) {
    console.log('Deleting duplicate loads in chunks of 500...');
    const chunkSize = 500;
    for (let i = 0; i < duplicateIds.length; i += chunkSize) {
      const chunk = duplicateIds.slice(i, i + chunkSize);
      const { error: deleteError } = await supabase
        .from('loads')
        .delete()
        .in('id', chunk);

      if (deleteError) {
        console.error(`Error deleting chunk ${i}:`, deleteError.message);
      } else {
        console.log(`Deleted chunk ${Math.floor(i / chunkSize) + 1} of ${Math.ceil(duplicateIds.length / chunkSize)}`);
      }
    }
    console.log('Duplicate load removal complete.');
  } else {
    console.log('No duplicate loads found.');
  }
}

removeDuplicateLoads();
