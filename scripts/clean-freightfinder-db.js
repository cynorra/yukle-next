const fs = require('fs');
const envFile = fs.readFileSync('.env.local', 'utf8');
const envVars = Object.fromEntries(
  envFile.split('\n').filter(l => l && !l.startsWith('#')).map(l => l.split('='))
);

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL.trim(),
  envVars.SUPABASE_SERVICE_ROLE_KEY.trim()
);

async function cleanDB() {
  console.log('Fetching loads with FreightFinder in description...');
  
  // Sadece içinde FreightFinder geçen ilanları al
  const { data: loads, error } = await supabase
    .from('loads')
    .select('id, description, description_translations')
    .ilike('description', '%FreightFinder%');

  if (error) {
    console.error('Error fetching loads:', error);
    return;
  }

  console.log(`Found ${loads.length} loads to clean.`);

  let updatedCount = 0;

  for (let i = 0; i < loads.length; i++) {
    const load = loads[i];
    
    // İngilizce Ana Description'ı temizle
    let newDesc = load.description || '';
    
    // Satır bazlı temizlik: İçinde "FreightFinder" geçen satırları tamamen sil
    const cleanLines = (text) => {
      if (!text) return text;
      return text.split('\n')
        .filter(line => !line.toLowerCase().includes('freightfinder'))
        .join('\n')
        .replace(/\n{3,}/g, '\n\n') // Fazladan boşlukları temizle
        .trim();
    };

    newDesc = cleanLines(newDesc);

    // Çevirileri (JSON) temizle
    let newTrans = load.description_translations || {};
    if (typeof newTrans === 'object') {
      for (const lang in newTrans) {
        newTrans[lang] = cleanLines(newTrans[lang]);
      }
    }

    // Veritabanını güncelle
    const { error: updateError } = await supabase
      .from('loads')
      .update({
        description: newDesc,
        description_translations: newTrans
      })
      .eq('id', load.id);

    if (updateError) {
      console.error(`Error updating load ${load.id}:`, updateError.message);
    } else {
      updatedCount++;
      if (updatedCount % 50 === 0) {
        console.log(`Updated ${updatedCount} of ${loads.length}`);
      }
    }
  }

  console.log(`Finished cleaning. Successfully updated ${updatedCount} loads.`);
}

cleanDB();
