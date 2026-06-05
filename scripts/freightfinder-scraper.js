/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║                        ARCHIVED — DO NOT USE                            ║
 * ║                                                                          ║
 * ║  Bu dosya Puppeteer (headless Chrome) kullanır.                         ║
 * ║  Vercel serverless ortamında ÇALIŞMAZ (Chromium boyut/timeout limiti).  ║
 * ║                                                                          ║
 * ║  ✅ Production için: scripts/freightfinder-serverless.js                 ║
 * ║     (Puppeteer'sız, cheerio HTML parse, Vercel cron uyumlu)             ║
 * ║                                                                          ║
 * ║  Bu dosya öğrenme/referans amaçlı saklanmaktadır.                       ║
 * ║  Puppeteer ile headless browser scraping nasıl yapılır görmek için bak. ║
 * ║                                                                          ║
 * ║  Manuel çalıştırmak için (local):                                        ║
 * ║    node scripts/freightfinder-scraper.js --max 50                        ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

// EARLY EXIT — bu dosyayı cron veya import ile çağırmak için kaldır
if (require.main === module) {
  // Sadece doğrudan `node scripts/freightfinder-scraper.js` ile çalıştırılırsa devam et
  // import/require ile yüklenirse exit yapar
} else {
  console.warn('[freightfinder-scraper] ARCHIVED — use freightfinder-serverless.js instead.');
  module.exports = {};
  return; // require() ile çağrılırsa burada dur
}

/**
 * freightfinder-scraper.js  (PUPPETEER VERSION — ARCHIVED)
 *
 * Scrapes REAL freight listings from FreightFinder.com using Puppeteer.
 * - No login required on FreightFinder
 * - 13,846+ active listings, paginated (25 per page)
 * - Real company names, phone numbers, routes, equipment types
 * - Maps exactly to Supabase `loads` table schema
 * - Translates into 47 languages via MyMemory API (free, no key, parallel)
 *
 * Usage:
 *   node scripts/freightfinder-scraper.js                 # 8 origin cities, 2 pages each
 *   node scripts/freightfinder-scraper.js --all           # all 30 origin cities, 3 pages each
 *   node scripts/freightfinder-scraper.js --max 300       # cap total listings
 *   node scripts/freightfinder-scraper.js --pages 4       # pages per origin city
 */

const puppeteer = require('puppeteer');
const fs        = require('fs');
const path      = require('path');
const { createClient } = require('@supabase/supabase-js');
const { translateListingsBatch } = require('./translate-free');

// ---------------------------------------------------------------------------
// 1. Env Setup
// ---------------------------------------------------------------------------
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k && v.length) process.env[k.trim()] = v.join('=').trim();
  });
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
const defaultShipperId = process.env.SCRAPER_SHIPPER_ID || '3c9d15c1-ce40-42c4-b5bc-f2de51a747d5';

// ---------------------------------------------------------------------------
// 2. All 47 Locales
// ---------------------------------------------------------------------------
const ALL_LOCALES = [
  'en','tr','de','fr','es','pt','it','pl','nl','ru',
  'uk','zh','ja','ko','hi','ar','fa','ur','bn','id',
  'ms','vi','th','tl','sw','ha','am','yo','ig','zu',
  'ro','hu','cs','sk','bg','hr','sr','sl','et','lv',
  'lt','fi','sv','da','no','he','el'
];

// ---------------------------------------------------------------------------
// 3. Origin Cities (diverse North American coverage)
// ---------------------------------------------------------------------------
const ORIGIN_CITIES = [
  // West Coast
  'Los Angeles, CA', 'Seattle, WA', 'San Francisco, CA', 'Portland, OR', 'San Diego, CA',
  // South
  'Dallas, TX', 'Houston, TX', 'Atlanta, GA', 'Miami, FL', 'New Orleans, LA',
  // Midwest
  'Chicago, IL', 'Detroit, MI', 'Minneapolis, MN', 'Kansas City, MO', 'Columbus, OH',
  // Northeast
  'New York, NY', 'Philadelphia, PA', 'Boston, MA', 'Baltimore, MD', 'Pittsburgh, PA',
  // Mountain / Southwest
  'Denver, CO', 'Phoenix, AZ', 'Las Vegas, NV', 'Salt Lake City, UT', 'Albuquerque, NM',
  // Canada
  'Toronto, ON', 'Vancouver, BC', 'Calgary, AB',
  // Cross-border
  'Laredo, TX', 'El Paso, TX',
];

// ---------------------------------------------------------------------------
// 4. Equipment code → DB mapping
// ---------------------------------------------------------------------------
function mapEquipment(equip) {
  const e = (equip || '').toLowerCase().trim();
  if (e === 'f' || e.includes('flatbed') || e.includes('step deck') || e.includes('drop'))
    return { loadType: 'general', truckType: 'flatbed' };
  if (e === 'r' || e.includes('reefer') || e.includes('refriger') || e.includes('frigo'))
    return { loadType: 'perishable', truckType: 'frigo' };
  if (e.includes('hazmat') || e.includes('hazardous'))
    return { loadType: 'hazardous', truckType: 'tir' };
  if (e.includes('container') || e.includes('intermodal'))
    return { loadType: 'general', truckType: 'container' };
  return { loadType: 'general', truckType: 'tir' }; // Van / default
}

// ---------------------------------------------------------------------------
// 5. Parse FreightFinder table row → DB-ready object
//    Columns: [date, fromCityState, toCityState, mapLink, equipment, companyPhone]
// ---------------------------------------------------------------------------
function parseRow(cells) {
  if (!cells || cells.length < 5) return null;

  const dateStr    = cells[0]?.trim() || '';
  const fromRaw    = cells[1]?.trim() || '';
  const toRaw      = cells[2]?.trim() || '';
  const equipRaw   = cells[4]?.trim() || '';
  const companyRaw = cells[5]?.trim() || '';

  // Skip headers / pagination / empty rows
  if (fromRaw === 'From' || !fromRaw || fromRaw.includes('Previous Page')) return null;
  if (!fromRaw.includes(',') || !toRaw.includes(',')) return null;

  const CA_PROVINCES = ['ON','BC','AB','QC','MB','SK','NS','NB','PE','NL','YT','NT','NU'];

  const parseLocation = (raw) => {
    const parts = raw.split(',').map(s => s.trim());
    const city  = parts[0]
      ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase()
      : 'Unknown';
    const state   = parts[1] || '';
    const country = CA_PROVINCES.includes(state.toUpperCase()) ? 'Canada' : 'United States';
    return { city, state, country };
  };

  const origin = parseLocation(fromRaw);
  const dest   = parseLocation(toRaw);

  const companyLines = companyRaw.split('\n').map(s => s.trim()).filter(Boolean);
  const companyName  = companyLines[0] || 'Unknown Company';
  const phone        = companyLines[1] || '';

  let pickupDate = null;
  if (dateStr) {
    try {
      const d = new Date(dateStr);
      if (!isNaN(d)) pickupDate = d.toISOString();
    } catch(e) {}
  }
  if (!pickupDate) {
    const d = new Date();
    d.setDate(d.getDate() + Math.floor(Math.random() * 14) + 1);
    pickupDate = d.toISOString();
  }

  const { loadType, truckType } = mapEquipment(equipRaw);

  const title = `${origin.city}, ${origin.state} (${origin.country}) ➜ ${dest.city}, ${dest.state} (${dest.country})`;

  const description = `[FreightFinder] Real freight load from FreightFinder.com.

Company: ${companyName}
Phone: ${phone || 'See FreightFinder.com'}
Route: ${origin.city}, ${origin.state} ${origin.country} → ${dest.city}, ${dest.state} ${dest.country}
Equipment: ${equipRaw || truckType.toUpperCase()}
Available: ${dateStr || new Date(pickupDate).toLocaleDateString('en-US')}

Source: FreightFinder.com — Search this route to contact the company directly.`;

  return {
    title, description,
    originCity: origin.city, originState: origin.state || null, originCountry: origin.country,
    destCity:   dest.city,   destState:   dest.state || null,   destCountry:   dest.country,
    loadType, truckType, weightTon: 20, pickupDate,
    companyName, phone, equipment: equipRaw,
  };
}

// ---------------------------------------------------------------------------
// 6. Scrape a single FreightFinder results page via GET
// ---------------------------------------------------------------------------
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function scrapePage(page, originCity, pageRow = 1) {
  const encoded = encodeURIComponent(originCity);
  const url = `https://www.freightfinder.com/database/search/city-radius?perPage=25&AvailDate=&vchOrigin=${encoded}&geoOrigin=&intOriginRadius=500&vchDestination=&geoDestination=&intDestinationRadius=500&vchUserAction=Search&row=${pageRow}`;

  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

  const rows = await page.evaluate(() => {
    const table = document.getElementById('searchResultsTable');
    if (!table) return [];
    return Array.from(table.querySelectorAll('tr')).map(row =>
      Array.from(row.querySelectorAll('td, th')).map(c => c.innerText.trim())
    );
  });

  return rows.map(parseRow).filter(Boolean);
}

// ---------------------------------------------------------------------------
// 7. Main
// ---------------------------------------------------------------------------
async function main() {
  const args      = process.argv.slice(2);
  const runAll    = args.includes('--all');
  const maxItems  = args.includes('--max')   ? parseInt(args[args.indexOf('--max')   + 1]) : 300;
  const pagesEach = args.includes('--pages') ? parseInt(args[args.indexOf('--pages') + 1]) : 2;
  const BATCH_SIZE = 3; // listings per translation batch

  const citiesToSearch = runAll ? ORIGIN_CITIES : ORIGIN_CITIES.slice(0, 8);

  console.log('╔══════════════════════════════════════════════╗');
  console.log('║   FreightFinder Scraper + MyMemory Trans     ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log(`Origin cities  : ${citiesToSearch.length} | Pages each: ${pagesEach} | Max: ${maxItems}`);
  console.log(`Languages      : ${ALL_LOCALES.length} | Translation: MyMemory (free, parallel)`);
  console.log('');

  // Verify shipper
  const { data: prof } = await supabase.from('public_profiles').select('id').eq('id', defaultShipperId).maybeSingle();
  let shipperId = defaultShipperId;
  if (!prof) {
    const { data: fb } = await supabase.from('public_profiles').select('id').eq('role','shipper').limit(1).maybeSingle();
    if (!fb) { console.error('No shipper found!'); process.exit(1); }
    shipperId = fb.id;
  }
  console.log(`Shipper ID     : ${shipperId}`);

  // Load existing titles (dedup last 7 days)
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
  const { data: existing } = await supabase.from('loads').select('title').ilike('description', '%FreightFinder%').gt('created_at', weekAgo);
  const existingTitles = new Set((existing || []).map(l => l.title));
  console.log(`Already in DB  : ${existingTitles.size} FreightFinder listings (last 7d)\n`);

  // Launch Puppeteer
  console.log('Launching headless Chrome...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    defaultViewport: { width: 1366, height: 768 }
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36');

  let allParsed     = [];
  let batchQueue    = [];
  let totalInserted = 0;
  let batchCount    = 0;

  // ---------------------------------------------------------------------------
  // Translate + insert a batch
  // ---------------------------------------------------------------------------
  async function flushBatch() {
    if (!batchQueue.length) return;
    batchCount++;
    console.log(`\n  ─── Batch #${batchCount}: ${batchQueue.length} listings → ${ALL_LOCALES.length} languages (MyMemory)`);

    const translated = await translateListingsBatch(
      batchQueue.map(b => ({ title: b.title, description: b.description })),
      ALL_LOCALES
    );

    for (let i = 0; i < batchQueue.length; i++) {
      const item  = batchQueue[i];
      const trans = translated.find(t => t.item_index === i);

      const titleTrans = trans?.title_translations  || (() => { const o = {}; ALL_LOCALES.forEach(l => o[l] = item.title); return o; })();
      const descTrans  = trans?.description_translations || (() => { const o = {}; ALL_LOCALES.forEach(l => o[l] = item.description); return o; })();

      const { error } = await supabase.from('loads').insert({
        title:                  item.title,
        shipper_id:             shipperId,
        origin_city:            item.originCity,
        origin_state:           item.originState,
        origin_country:         item.originCountry,
        destination_city:       item.destCity,
        destination_state:      item.destState,
        destination_country:    item.destCountry,
        price:                  null,
        load_type:              item.loadType,
        required_truck_type:    item.truckType,
        weight_ton:             item.weightTon,
        description:            item.description,
        status:                 'active',
        assigned_driver_id:     null,
        shipper_confirmed:      false,
        driver_confirmed:       false,
        pickup_date:            item.pickupDate,
        delivery_date:          null,
        tags:                   ['freightfinder', 'real', 'scraped',
                                  item.originCountry.toLowerCase().replace(/\s+/g, '-'),
                                  item.destCountry.toLowerCase().replace(/\s+/g, '-')],
        title_translations:         titleTrans,
        description_translations:   descTrans,
      });

      if (error) {
        console.error(`    [✗] ${item.title} → ${error.message}`);
      } else {
        totalInserted++;
        existingTitles.add(item.title);
        console.log(`    [✓] ${item.title} | ${item.companyName} | ${item.phone}`);
      }
    }
    batchQueue = [];
  }

  // ---------------------------------------------------------------------------
  // Scrape loop
  // ---------------------------------------------------------------------------
  for (const city of citiesToSearch) {
    if (allParsed.length >= maxItems) break;
    console.log(`\n[City] ${city}`);

    for (let p = 0; p < pagesEach; p++) {
      if (allParsed.length >= maxItems) break;
      const rowStart = p * 25 + 1;
      console.log(`  Page ${p + 1} (row=${rowStart})`);

      try {
        const listings = await scrapePage(page, city, rowStart);
        console.log(`  → ${listings.length} real listings found`);

        for (const listing of listings) {
          if (allParsed.length >= maxItems) break;
          if (existingTitles.has(listing.title)) continue;

          allParsed.push(listing);
          batchQueue.push(listing);

          if (batchQueue.length >= BATCH_SIZE) await flushBatch();
        }
      } catch (e) {
        console.error(`  [Error] ${e.message.slice(0, 100)}`);
      }

      await sleep(1500); // polite crawl delay between pages
    }
  }

  if (batchQueue.length > 0) await flushBatch();
  await browser.close();

  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║              Scraping Complete               ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log(`Cities searched    : ${citiesToSearch.length}`);
  console.log(`Listings parsed    : ${allParsed.length}`);
  console.log(`Inserted to DB     : ${totalInserted}`);
  console.log(`Translation batches: ${batchCount} × ${ALL_LOCALES.length} languages`);
}

main().then(() => process.exit(0)).catch(e => { console.error('Fatal:', e); process.exit(1); });
