/**
 * scripts/update-old-loads-translations.js
 *
 * Scans ALL existing loads in Supabase using pagination.
 * Shows LIVE progress percentages and status updates in terminal.
 * Translates missing multi-language fields into all 55+ supported locales using MyMemory API.
 *
 * Usage:
 *   node scripts/update-old-loads-translations.js
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { translateListing } = require('./translate-free');

// Load environment variables from .env.local
const envLocalPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envLocalPath)) {
  fs.readFileSync(envLocalPath, 'utf8').split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      process.env[parts[0].trim()] = parts.slice(1).join('=').trim();
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Supabase URL or Key is missing in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

const ALL_LOCALES = [
  'en', 'tr', 'es', 'pt', 'fr', 'de', 'it', 'pl', 'nl',
  'ru', 'uk', 'zh', 'ja', 'hi', 'ar', 'fa',
  'ko', 'vi', 'id', 'bn', 'ur', 'th', 'ms', 'tl',
  'ro', 'sv', 'cs', 'hu', 'el', 'az', 'kk', 'he',
  'bg', 'hr', 'sr', 'sk', 'da', 'fi', 'no', 'uz',
  'ta', 'mr', 'ka', 'lt', 'lv', 'et', 'sl', 'kn', 'te', 'pa', 'gu', 'ml', 'sw', 'ne', 'si'
];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function updateAllOldLoads() {
  console.clear();
  console.log('================================================================');
  console.log('🌐 LOADLY - TOPLU İLAN VE ÇEVİRİ GÜNCELLEME İŞLEMCİSİ (55+ DİL)');
  console.log('================================================================\n');

  // Get total count
  const { count: totalCount, error: countErr } = await supabase
    .from('loads')
    .select('*', { count: 'exact', head: true });

  if (countErr) {
    console.error('❌ Veritabanı sayaç hatası:', countErr.message);
    process.exit(1);
  }

  console.log(`📦 Veritabanında Toplam ${totalCount} Adet İlan Bulundu.`);
  console.log('⏳ Akışkan Paketler Halinde Çeviri Kontrolü Başlatılıyor...\n');

  let updatedCount = 0;
  let skippedCount = 0;
  let processedTotal = 0;
  const BATCH_SIZE = 100;
  let offset = 0;
  const startTime = Date.now();

  while (offset < totalCount) {
    const { data: loads, error } = await supabase
      .from('loads')
      .select('id, title, description, title_translations, description_translations')
      .order('created_at', { ascending: false })
      .range(offset, offset + BATCH_SIZE - 1);

    if (error) {
      console.error(`\n❌ Paket çekme hatası (${offset}-${offset + BATCH_SIZE}):`, error.message);
      // Brief pause and retry
      await sleep(2000);
      continue;
    }

    if (!loads || loads.length === 0) break;

    for (let i = 0; i < loads.length; i++) {
      processedTotal++;
      const load = loads[i];
      const percent = (((processedTotal) / totalCount) * 100).toFixed(1);

      const hasTitles = load.title_translations && Object.keys(load.title_translations).length >= 10;
      const hasDescs  = load.description_translations && Object.keys(load.description_translations).length >= 10;

      if (hasTitles && hasDescs) {
        skippedCount++;
        // Print progress inline without cluttering terminal
        process.stdout.write(`\r[${processedTotal}/${totalCount} - %${percent}] ⏩ Zaten Güncel (${skippedCount} güncel) | ✅ Yeni: ${updatedCount}`);
        continue;
      }

      console.log(`\n\n[${processedTotal}/${totalCount} - %${percent}] 🔄 Çevriliyor: "${(load.title || 'İlan').slice(0, 45)}..."`);

      const titleText = load.title || 'Shipping Freight Load';
      const descText  = load.description || `${load.title} shipping load listing on Loadly.`;

      try {
        const trans = await translateListing(titleText, descText, ALL_LOCALES, 'en');

        const { error: updateErr } = await supabase
          .from('loads')
          .update({
            title_translations: trans.title_translations,
            description_translations: trans.description_translations,
          })
          .eq('id', load.id);

        if (updateErr) {
          console.error(`   ❌ Güncelleme hatası (${load.id}):`, updateErr.message);
        } else {
          updatedCount++;
          console.log(`   ✅ 55+ Dilde Tam Çevrildi ve Veritabanı Güncellendi!`);
        }
      } catch (err) {
        console.error(`   ❌ Çeviri servisi hatası (${load.id}):`, err.message);
      }

      await sleep(150); // API burst rate limit protection
    }

    offset += BATCH_SIZE;
  }

  const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('\n\n================================================================');
  console.log('🎉 TOPLU GÜNCELLEME İŞLEMİ TAMAMLANDI!');
  console.log(`⏱️ Toplam Geçen Süre:   ${elapsedSec} Saniye`);
  console.log(`📦 İşlenen Toplam İlan: ${processedTotal}`);
  console.log(`✅ Yeni Güncellenen:    ${updatedCount}`);
  console.log(`⏩ Zaten Güncel Olan:   ${skippedCount}`);
  console.log('================================================================\n');
}

updateAllOldLoads()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
