const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envLocalPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envLocalPath)) {
  fs.readFileSync(envLocalPath, 'utf8').split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      process.env[parts[0].trim()] = parts.slice(1).join('=').trim();
    }
  });
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkDatabase() {
  console.log('🔍 Veritabanı canlı durumu kontrol ediliyor...\n');

  // Total loads count
  const { count: totalCount, error: countErr } = await supabase
    .from('loads')
    .select('*', { count: 'exact', head: true });

  if (countErr) {
    console.error('Count Error:', countErr.message);
    return;
  }

  console.log(`📊 Veritabanındaki Toplam İlan Sayısı: ${totalCount}`);

  // Fetch sample of loads
  const { data: sampleLoads, error: sampleErr } = await supabase
    .from('loads')
    .select('id, title, title_translations, created_at')
    .order('created_at', { ascending: false })
    .limit(15);

  if (sampleErr) {
    console.error('Sample Error:', sampleErr.message);
    return;
  }

  console.log('\n--- SON EKLENEN 15 İLANIN ÇEVİRİ DURUMU ---');
  let translatedCount = 0;

  sampleLoads.forEach((load, idx) => {
    const keysCount = load.title_translations ? Object.keys(load.title_translations).length : 0;
    if (keysCount > 0) translatedCount++;
    console.log(`${idx + 1}. [ID: ${load.id.slice(0, 8)}...] "${(load.title || 'Başlıksız').slice(0, 35)}" -> ${keysCount} dilde çevirisi VAR`);
  });

  console.log(`\n✅ Örneklenen 15 ilandan ${translatedCount} tanesinin çevirileri veritabanında aktif!`);
}

checkDatabase();
