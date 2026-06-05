const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load env variables manually from .env.local
const envLocalPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim();
      process.env[key] = val;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceKey);

async function run() {
  const { data: loads, error } = await supabase
    .from('loads')
    .select('origin_country, destination_country, tags');

  if (error) {
    console.error('Error fetching loads:', error);
    return;
  }

  const origins = new Set();
  const destinations = new Set();
  loads.forEach(l => {
    origins.add(l.origin_country);
    destinations.add(l.destination_country);
  });

  console.log('Unique origin countries in DB:', Array.from(origins));
  console.log('Unique destination countries in DB:', Array.from(destinations));
  console.log('Total loads in DB:', loads.length);
}

run();
