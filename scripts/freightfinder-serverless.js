/**
 * freightfinder-serverless.js
 *
 * Serverless-compatible FreightFinder.com scraper (NO Puppeteer/Chromium).
 * Uses plain HTTPS + cheerio HTML parsing.
 *
 * Works in: Vercel Serverless, Node.js scripts, cron jobs.
 *
 * Exports: runFreightFinderScraper(options)
 */

const https    = require('https');
const cheerio  = require('cheerio');
const { translateListingsBatch } = require('./translate-free');

// Varied, natural-language descriptions instead of one rigid "Company: X
// Phone: Y Route: A→B" template repeated identically across every listing —
// that pattern (same structure, only values differ) reads as low-effort
// boilerplate at scale (~thousands of these pages) and hurts text-uniqueness
// signals. Randomly picks one of several phrasings per listing.
function buildListingDescription({ companyName, phone, origin, dest, equipRaw, truckType, dateStr, pickupDate }) {
  const equipment = equipRaw || truckType.toUpperCase();
  const available = dateStr || new Date(pickupDate).toLocaleDateString('en-US');
  const phoneLine = phone || 'contact for details';
  const route = `${origin.city}, ${origin.state} (${origin.country}) to ${dest.city}, ${dest.state} (${dest.country})`;

  const variants = [
    `${companyName} is looking for a carrier to move freight from ${route}. Equipment required: ${equipment}. Pickup available ${available}. Contact ${phoneLine} for rate and details.`,
    `Freight opportunity: ${route}. Posted by ${companyName}, seeking ${equipment} coverage with availability on ${available}. Call ${phoneLine} to book this load.`,
    `${equipment} load needed for the ${route} lane. Shipper: ${companyName}. Ready for pickup ${available} — reach out at ${phoneLine} to discuss rate and schedule.`,
    `Shipment available from ${origin.city}, ${origin.state} to ${dest.city}, ${dest.state}. ${companyName} needs a ${equipment} carrier, pickup date ${available}. Phone: ${phoneLine}.`,
    `${companyName} has a load ready to move: ${route}, ${equipment} required. Available ${available}. Interested carriers can contact ${phoneLine}.`,
  ];
  return variants[Math.floor(Math.random() * variants.length)];
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const ALL_LOCALES = [
  'en','tr','de','fr','es','pt','it','pl','nl','ru',
  'uk','zh','ja','ko','hi','ar','fa','ur','bn','id',
  'ms','vi','th','tl','az','kk','uz','ta','mr','ka',
  'ro','hu','cs','sk','bg','hr','sr','sl','et','lv',
  'lt','fi','sv','da','no','he','el'
];

// Origin cities — diverse US/North America/Canada coverage
const ORIGIN_CITIES = [
  'Los Angeles, CA', 'Seattle, WA', 'San Francisco, CA',
  'Dallas, TX', 'Houston, TX', 'Atlanta, GA', 'Miami, FL',
  'Chicago, IL', 'Detroit, MI', 'Minneapolis, MN',
  'New York, NY', 'Philadelphia, PA', 'Boston, MA',
  'Denver, CO', 'Phoenix, AZ', 'Las Vegas, NV',
  'Toronto, ON', 'Vancouver, BC',
  'Laredo, TX', 'El Paso, TX',
];

const CA_PROVINCES = new Set(['ON','BC','AB','QC','MB','SK','NS','NB','PE','NL','YT','NT','NU']);

// ---------------------------------------------------------------------------
// Equipment → DB type mapping
// ---------------------------------------------------------------------------
function mapEquipment(equip) {
  const e = (equip || '').toLowerCase();
  if (e === 'f' || e.includes('flatbed') || e.includes('step deck') || e.includes('drop'))
    return { loadType: 'general', truckType: 'flatbed' };
  if (e === 'r' || e.includes('reefer') || e.includes('refriger'))
    return { loadType: 'perishable', truckType: 'frigo' };
  if (e.includes('hazmat') || e.includes('hazardous'))
    return { loadType: 'hazardous', truckType: 'tir' };
  if (e.includes('container') || e.includes('intermodal'))
    return { loadType: 'general', truckType: 'container' };
  return { loadType: 'general', truckType: 'tir' };
}

// ---------------------------------------------------------------------------
// Parse city/state string → { city, state, country }
// ---------------------------------------------------------------------------
function parseLocation(raw) {
  const parts = (raw || '').split(',').map(s => s.trim());
  const cityRaw = parts[0] || '';
  const state   = parts[1] || '';
  const city    = cityRaw
    ? cityRaw.charAt(0).toUpperCase() + cityRaw.slice(1).toLowerCase()
    : 'Unknown';
  const country = CA_PROVINCES.has(state.toUpperCase()) ? 'Canada' : 'United States';
  return { city, state, country };
}

// ---------------------------------------------------------------------------
// Fetch a single FreightFinder results page (plain HTTP GET)
// ---------------------------------------------------------------------------
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function fetchPage(originCity, rowStart = 1) {
  return new Promise((resolve, reject) => {
    const encoded = encodeURIComponent(originCity);
    const path = `/database/search/city-radius?perPage=25&AvailDate=&vchOrigin=${encoded}&geoOrigin=&intOriginRadius=500&vchDestination=&geoDestination=&intDestinationRadius=500&vchUserAction=Search&row=${rowStart}`;

    const req = https.request({
      hostname: 'www.freightfinder.com',
      port: 443,
      path,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 20000,
    }, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        // FreightFinder uses latin-1 encoding
        const body = Buffer.concat(chunks).toString('latin1');
        resolve({ status: res.statusCode, body });
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    req.end();
  });
}

// ---------------------------------------------------------------------------
// Parse HTML body → array of listing objects
// ---------------------------------------------------------------------------
function parseListings(html, originCity) {
  const $ = cheerio.load(html, { decodeEntities: false });
  const listings = [];

  $('#searchResultsTable tr').each((i, row) => {
    const cells = $(row).find('td').map((_, td) => $(td).text().trim()).get();
    if (cells.length < 5) return; // skip header/pagination rows

    const dateStr    = cells[0] || '';
    const fromRaw    = cells[1] || '';
    const toRaw      = cells[2] || '';
    const equipRaw   = cells[4] || '';
    const companyRaw = cells[5] || '';

    // Skip non-data rows
    if (fromRaw === 'From' || !fromRaw || !fromRaw.includes(',')) return;
    if (!toRaw || !toRaw.includes(',')) return;

    const origin = parseLocation(fromRaw);
    const dest   = parseLocation(toRaw);

    const companyLines = companyRaw.split('\n').map(s => s.trim()).filter(Boolean);
    const companyName  = companyLines[0] || 'Unknown';
    const phone        = companyLines[1] || '';

    let pickupDate = null;
    if (dateStr) {
      try {
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) pickupDate = d.toISOString();
      } catch(e) {}
    }
    if (!pickupDate) {
      const d = new Date();
      d.setDate(d.getDate() + Math.floor(Math.random() * 14) + 1);
      pickupDate = d.toISOString();
    }

    const { loadType, truckType } = mapEquipment(equipRaw);
    const title = `${origin.city}, ${origin.state} (${origin.country}) ➜ ${dest.city}, ${dest.state} (${dest.country})`;
    const description = buildListingDescription({ companyName, phone, origin, dest, equipRaw, truckType, dateStr, pickupDate });

    listings.push({
      title, description,
      originCity: origin.city, originState: origin.state || null, originCountry: origin.country,
      destCity:   dest.city,   destState:   dest.state || null,   destCountry:   dest.country,
      loadType, truckType, weightTon: 20, pickupDate,
      companyName, phone, equipment: equipRaw,
    });
  });

  return listings;
}

// ---------------------------------------------------------------------------
// Main exported function — called by cron route
// ---------------------------------------------------------------------------
async function runFreightFinderScraper({ supabase, shipperId, maxPerRun = 75, pagesPerCity = 2, verbose = true } = {}) {
  const log = (...args) => { if (verbose) console.log(...args); };
  const citiesToSearch = ORIGIN_CITIES.slice(0, Math.ceil(maxPerRun / (pagesPerCity * 20)));

  log(`[FreightFinder] Starting — ${citiesToSearch.length} cities × ${pagesPerCity} pages | max: ${maxPerRun}`);

  // Load existing titles to dedup (last 7 days)
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
  const { data: existing } = await supabase
    .from('loads')
    .select('title')
    .contains('tags', ['freightfinder'])
    .gt('created_at', weekAgo);
  const existingTitles = new Set((existing || []).map(l => l.title));
  log(`[FreightFinder] Existing in DB (7d): ${existingTitles.size}`);

  let totalInserted = 0;
  let batchQueue    = [];
  const BATCH_SIZE  = 3;
  const insertedLoadIds = [];

  async function flushBatch() {
    if (!batchQueue.length) return;
    log(`[FreightFinder] Translating batch of ${batchQueue.length} into ${ALL_LOCALES.length} languages...`);
    const translated = await translateListingsBatch(
      batchQueue.map(b => ({ title: b.title, description: b.description })),
      ALL_LOCALES
    );

    for (let i = 0; i < batchQueue.length; i++) {
      const item  = batchQueue[i];
      const trans = translated.find(t => t.item_index === i);
      const makeObj = (v) => ALL_LOCALES.reduce((o, l) => { o[l] = v; return o; }, {});

      const { data: insertedRow, error } = await supabase.from('loads').insert({
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
        title_translations:         trans?.title_translations         || makeObj(item.title),
        description_translations:   trans?.description_translations   || makeObj(item.description),
      })
      .select('id')
      .single();

      if (error) {
        console.error(`[FreightFinder] Insert error: ${error.message}`);
      } else {
        totalInserted++;
        existingTitles.add(item.title);
        if (insertedRow) insertedLoadIds.push(insertedRow.id);
        log(`[FreightFinder] ✓ ${item.title} | ${item.companyName}`);
      }
    }
    batchQueue = [];
  }

  for (const city of citiesToSearch) {
    if (totalInserted >= maxPerRun) break;
    log(`[FreightFinder] Scraping city: ${city}`);

    for (let p = 0; p < pagesPerCity; p++) {
      if (totalInserted + batchQueue.length >= maxPerRun) break;
      const rowStart = p * 25 + 1;

      try {
        const { status, body } = await fetchPage(city, rowStart);
        if (status !== 200) { log(`[FreightFinder] Non-200: ${status}`); continue; }

        const listings = parseListings(body, city);
        log(`[FreightFinder]   Page ${p + 1}: ${listings.length} listings`);

        for (const listing of listings) {
          if (totalInserted + batchQueue.length >= maxPerRun) break;
          if (existingTitles.has(listing.title)) continue;
          batchQueue.push(listing);
          if (batchQueue.length >= BATCH_SIZE) await flushBatch();
        }
      } catch (e) {
        console.error(`[FreightFinder] Fetch error for ${city}: ${e.message}`);
      }

      await sleep(1500); // polite delay
    }
  }

  if (batchQueue.length > 0) await flushBatch();

  // Marketplace listings are noindex'd (2026-08-29: marketplace dropped out
  // of the site's public/indexed surface) — submitting their URLs to
  // IndexNow/Baidu/Google here would just be the "submitted a noindexed URL
  // for indexing" red flag search consoles warn about. No indexing push for
  // scraped loads.

  log(`[FreightFinder] Done. Inserted: ${totalInserted}`);
  return totalInserted;
}

// ---------------------------------------------------------------------------
// Execute if run directly (e.g. from GitHub Actions, alongside scraper.js)
// ---------------------------------------------------------------------------
if (require.main === module) {
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

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const shipperId   = process.env.SCRAPER_SHIPPER_ID || '3c9d15c1-ce40-42c4-b5bc-f2de51a747d5';

  if (!supabaseUrl || !serviceKey) {
    console.error('Supabase URL or Key is missing from env!');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  runFreightFinderScraper({ supabase, shipperId, maxPerRun: 60, pagesPerCity: 2, verbose: true })
    .then(() => process.exit(0))
    .catch(e => {
      console.error('Fatal Error running FreightFinder scraper:', e);
      process.exit(1);
    });
}

module.exports = { runFreightFinderScraper };
