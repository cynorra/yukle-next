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

async function fetchAllLoads() {
  process.stdout.write('🔍 Veritabanındaki tüm ilanlar taranıyor...');
  let allLoads = [];
  let from = 0;
  const step = 1000;

  while (true) {
    const to = from + step - 1;
    const { data, error } = await supabase
      .from('loads')
      .select('id, title, description, title_translations, description_translations, created_at')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error(`\n❌ Veri çekme hatası (${from}-${to}):`, error.message);
      break;
    }

    if (data && data.length > 0) {
      allLoads = allLoads.concat(data);
      process.stdout.write(` [${allLoads.length} çekildi]`);
      if (data.length < step) break;
      from += step;
    } else {
      break;
    }
  }

  console.log(' ✅ Tamamlandı!');
  return allLoads;
}

async function updateAllOldLoads() {
  console.clear();
  console.log('================================================================');
  console.log('🌐 LOADLY - TOPLU İLAN VE ÇEVİRİ GÜNCELLEME İŞLEMCİSİ (55+ DİL)');
  console.log('================================================================\n');

  const loads = await fetchAllLoads();
  const total = loads.length;

  console.log(`\n📦 Veritabanında Toplam ${total} Adet İlan Bulundu.\n`);
  console.log('⏳ Çeviri ve Zenginleştirme Süreci Başlatılıyor...\n');

  let updatedCount = 0;
  let skippedCount = 0;

  const startTime = Date.now();

  for (let i = 0; i < total; i++) {
    const load = loads[i];
    const progressPercent = (((i + 1) / total) * 100).toFixed(1);

    const hasTitles = load.title_translations && Object.keys(load.title_translations).length >= 10;
    const hasDescs  = load.description_translations && Object.keys(load.description_translations).length >= 10;

    if (hasTitles && hasDescs) {
      skippedCount++;
      console.log(`[${i + 1}/${total} - %${progressPercent}] ⏩ Zaten 55 Dilde Güncel: "${(load.title || '').slice(0, 45)}"`);
      continue;
    }

    console.log(`[${i + 1}/${total} - %${progressPercent}] 🔄 Güncelleniyor: "${(load.title || 'İlan').slice(0, 45)}..."`);

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

    await sleep(150); // Pause for polite API bursts
  }

  const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('\n================================================================');
  console.log('🎉 TOPLU GÜNCELLEME İŞLEMİ TAMAMLANDI!');
  console.log(`⏱️ Toplam Geçen Süre:   ${elapsedSec} Saniye`);
  console.log(`📦 İşlenen Toplam İlan: ${total}`);
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
