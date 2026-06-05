/**
 * global-listing-generator.js
 *
 * Generates global cargo listings for ALL countries in the database,
 * translates them into 47 supported languages, and inserts them into Supabase.
 *
 * Usage:
 *   node scripts/global-listing-generator.js                        # missing countries only
 *   node scripts/global-listing-generator.js --all                  # ALL countries
 *   node scripts/global-listing-generator.js --country "Germany"    # single country
 *   node scripts/global-listing-generator.js --limit 20             # limit to N countries
 *   node scripts/global-listing-generator.js --per-country 3        # listings per country (default: 3)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { createClient } = require('@supabase/supabase-js');

// ---------------------------------------------------------------------------
// 1. Environment Setup
// ---------------------------------------------------------------------------
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
const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey     = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;
const defaultShipperId = process.env.SCRAPER_SHIPPER_ID || '3c9d15c1-ce40-42c4-b5bc-f2de51a747d5';

if (!supabaseUrl || (!anonKey && !serviceKey)) {
  console.error('Supabase URL or Key is missing from .env.local!');
  process.exit(1);
}
if (!geminiApiKey) {
  console.error('GEMINI_API_KEY is missing from .env.local!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey || anonKey);

// ---------------------------------------------------------------------------
// 2. All 47 Supported Locales (must match the app's i18n config)
// ---------------------------------------------------------------------------
const ALL_LOCALES = [
  'en', 'tr', 'de', 'fr', 'es', 'pt', 'it', 'pl', 'nl', 'ru',
  'uk', 'zh', 'ja', 'ko', 'hi', 'ar', 'fa', 'ur', 'bn', 'id',
  'ms', 'vi', 'th', 'tl', 'sw', 'ha', 'am', 'yo', 'ig', 'zu',
  'ro', 'hu', 'cs', 'sk', 'bg', 'hr', 'sr', 'sl', 'et', 'lv',
  'lt', 'fi', 'sv', 'da', 'no', 'he', 'el'
];

// ---------------------------------------------------------------------------
// 3. Global Logistics Companies (realistic, regionally matched)
// ---------------------------------------------------------------------------
const globalLogisticsCompanies = [
  // Europe
  { companyName: 'DHL Freight GmbH',         contactPerson: 'Thomas Müller',       phone: '+49 228 182 0',      email: 'freight@dhl.com',              region: 'Europe'      },
  { companyName: 'DB Schenker',               contactPerson: 'Anna Schmidt',        phone: '+49 30 2970 0',      email: 'info@dbschenker.com',          region: 'Europe'      },
  { companyName: 'Kuehne+Nagel',              contactPerson: 'Jean-Pierre Dubois',  phone: '+41 44 786 95 11',   email: 'info@kuehne-nagel.com',        region: 'Europe'      },
  { companyName: 'DSV Road',                  contactPerson: 'Lars Nielsen',        phone: '+45 43 20 30 40',    email: 'road@dsv.com',                 region: 'Europe'      },
  { companyName: 'XPO Logistics Europe',      contactPerson: 'Marie Dupont',        phone: '+33 1 70 61 82 00',  email: 'contact@xpo.com',              region: 'Europe'      },
  { companyName: 'Geodis Road',               contactPerson: 'Pierre Martin',       phone: '+33 1 48 67 35 00',  email: 'info@geodis.com',              region: 'Europe'      },
  { companyName: 'Ceva Logistics',            contactPerson: 'Carlos García',       phone: '+34 93 268 47 00',   email: 'info@cevalogistics.com',       region: 'Europe'      },
  // Middle East
  { companyName: 'Aramex International',      contactPerson: 'Ahmed Al-Mansouri',   phone: '+971 4 286 1001',    email: 'info@aramex.com',              region: 'Middle East' },
  { companyName: 'Agility Logistics',         contactPerson: 'Khalid Al-Rashid',    phone: '+965 2229 9700',     email: 'info@agility.com',             region: 'Middle East' },
  { companyName: 'Bahri Logistics',           contactPerson: 'Faisal Al-Mutawa',    phone: '+966 11 448 0000',   email: 'logistics@bahri.com',          region: 'Middle East' },
  { companyName: 'Emirates SkyCargo',         contactPerson: 'Mohammed Al-Zaabi',   phone: '+971 4 218 4444',    email: 'cargo@emirateslogistics.ae',   region: 'Middle East' },
  // Asia
  { companyName: 'Nippon Express',            contactPerson: 'Takeshi Yamamoto',    phone: '+81 3 6251 1111',    email: 'info@nipponexpress.com',       region: 'Asia'        },
  { companyName: 'Yusen Logistics',           contactPerson: 'Kenji Tanaka',        phone: '+81 3 6324 9000',    email: 'info@yusen-logistics.com',     region: 'Asia'        },
  { companyName: 'COSCO Logistics',           contactPerson: 'Li Wei',              phone: '+86 10 6292 5000',   email: 'logistics@cosco.com',          region: 'Asia'        },
  { companyName: 'Sinotrans',                 contactPerson: 'Zhang Ming',          phone: '+86 10 6643 5000',   email: 'info@sinotrans.com',           region: 'Asia'        },
  { companyName: 'Blue Dart Express',         contactPerson: 'Rajesh Kumar',        phone: '+91 44 6661 5000',   email: 'info@bluedart.com',            region: 'Asia'        },
  { companyName: 'Mahindra Logistics',        contactPerson: 'Priya Sharma',        phone: '+91 22 2490 1441',   email: 'info@mahindralogistics.com',   region: 'Asia'        },
  // Americas
  { companyName: 'FedEx Freight',             contactPerson: 'John Williams',       phone: '+1 800 333 7999',    email: 'freight@fedex.com',            region: 'Americas'    },
  { companyName: 'UPS Supply Chain',          contactPerson: 'Sarah Johnson',       phone: '+1 800 742 5877',    email: 'info@ups.com',                 region: 'Americas'    },
  { companyName: 'C.H. Robinson',             contactPerson: 'Michael Davis',       phone: '+1 952 683 3474',    email: 'info@chrobinson.com',          region: 'Americas'    },
  { companyName: 'J.B. Hunt Transport',       contactPerson: 'Robert Thompson',     phone: '+1 479 820 0000',    email: 'info@jbhunt.com',              region: 'Americas'    },
  { companyName: 'Grupo TMM',                 contactPerson: 'Carlos Hernández',    phone: '+52 55 5629 8500',   email: 'info@tmm.com.mx',              region: 'Americas'    },
  { companyName: 'Braspress Transportes',     contactPerson: 'João Silva',          phone: '+55 11 3003 8000',   email: 'comercial@braspress.com.br',   region: 'Americas'    },
  // Africa
  { companyName: 'Transami Group',            contactPerson: 'David Kamau',         phone: '+254 20 351 7000',   email: 'info@transami.com',            region: 'Africa'      },
  { companyName: 'Imperial Logistics Africa', contactPerson: 'Thabo Mokoena',       phone: '+27 11 201 6000',    email: 'info@imperiallogistics.com',   region: 'Africa'      },
  { companyName: 'DHL Express Nigeria',       contactPerson: 'Emeka Okonkwo',       phone: '+234 1 800 2345',    email: 'nigeria@dhl.com',              region: 'Africa'      },
  // CIS / Russia
  { companyName: 'Globaltruck',               contactPerson: 'Alexei Petrov',       phone: '+7 812 600 60 00',   email: 'info@globaltruck.ru',          region: 'CIS'         },
  { companyName: 'FESCO Transportation',      contactPerson: 'Dmitry Sokolov',      phone: '+7 495 228 80 00',   email: 'info@fesco.ru',                region: 'CIS'         },
  { companyName: 'Delko Group',               contactPerson: 'Ivan Kovalev',        phone: '+7 495 995 28 08',   email: 'info@delko.ru',                region: 'CIS'         },
];

const regionKeywords = {
  Europe:       ['germany','france','spain','italy','netherlands','poland','belgium','sweden','norway','denmark','finland','switzerland','austria','czech republic','romania','hungary','croatia','slovakia','slovenia','estonia','latvia','lithuania','greece','portugal','ireland','bulgaria','serbia','ukraine','united kingdom'],
  'Middle East':['saudi arabia','uae','united arab emirates','kuwait','qatar','bahrain','oman','jordan','lebanon','iraq','iran','syria','yemen'],
  Asia:         ['china','japan','korea','india','indonesia','malaysia','thailand','vietnam','philippines','singapore','bangladesh','pakistan','myanmar','cambodia','laos','nepal','sri lanka'],
  Americas:     ['united states','canada','mexico','brazil','argentina','colombia','chile','peru','venezuela','ecuador','bolivia','paraguay','uruguay'],
  Africa:       ['nigeria','south africa','kenya','ghana','ethiopia','tanzania','egypt','morocco','algeria','senegal','ivory coast','cameroon','angola','mozambique'],
  CIS:          ['russia','kazakhstan','uzbekistan','azerbaijan','georgia','armenia','belarus','moldova','tajikistan','turkmenistan','kyrgyzstan'],
};

function getCompanyForCountry(country, index) {
  const lc = country.toLowerCase();
  let matched = null;
  for (const [region, keywords] of Object.entries(regionKeywords)) {
    if (keywords.some(k => lc.includes(k))) { matched = region; break; }
  }
  const pool = matched
    ? globalLogisticsCompanies.filter(c => c.region === matched)
    : globalLogisticsCompanies;
  return pool[index % pool.length];
}

// ---------------------------------------------------------------------------
// 4. Cargo Templates
// ---------------------------------------------------------------------------
const cargoTemplates = [
  { loadType: 'general',    truckType: 'tir',       weight: 24, label: 'General Cargo'         },
  { loadType: 'general',    truckType: 'container',  weight: 20, label: 'Container Freight'      },
  { loadType: 'perishable', truckType: 'frigo',      weight: 18, label: 'Refrigerated Cargo'     },
  { loadType: 'general',    truckType: 'flatbed',    weight: 30, label: 'Heavy Machinery'        },
  { loadType: 'hazardous',  truckType: 'tir',        weight: 20, label: 'Chemical / Hazmat Cargo'},
  { loadType: 'general',    truckType: 'tir',        weight: 22, label: 'Industrial Equipment'   },
  { loadType: 'general',    truckType: 'container',  weight: 25, label: 'Electronics & Tech'     },
  { loadType: 'perishable', truckType: 'frigo',      weight: 15, label: 'Agricultural Products'  },
];

function getCargoTemplate(index) {
  return cargoTemplates[index % cargoTemplates.length];
}

// ---------------------------------------------------------------------------
// 5. Batch Translation with Gemini (47 languages, ≤3 items per call)
// ---------------------------------------------------------------------------
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function buildLocaleSchemaProps() {
  const props = {};
  ALL_LOCALES.forEach(lc => { props[lc] = { type: 'STRING' }; });
  return props;
}
const LOCALE_SCHEMA_PROPS = buildLocaleSchemaProps();

/** Parse seconds from Gemini error message like "Please retry in 17.92s" */
function parseRetryAfter(errorText) {
  const m = (errorText || '').match(/retry in ([\d.]+)s/i);
  return m ? Math.ceil(parseFloat(m[1])) + 3 : 30; // +3s buffer
}

async function translateBatch(items) {
  /**
   * items: [{ batchIndex, title, description }]
   * returns: { results: [...], retryAfter: number|null }
   */
  const localeList = ALL_LOCALES.join(', ');
  const inputText = items.map((item, idx) =>
    `ITEM_${idx}:\nTitle: ${item.title}\nDescription: ${item.description}`
  ).join('\n\n---\n\n');

  const payload = JSON.stringify({
    contents: [{
      parts: [{
        text: `You are a professional logistics translation engine.
Translate the following cargo listing titles and descriptions into ALL of these languages: ${localeList}.

Rules:
- Keep company names, phone numbers, email addresses, and IDs EXACTLY unchanged in every language.
- Use correct logistics/freight terminology for each language.
- For Arabic (ar), Farsi (fa), Urdu (ur), Hebrew (he): ensure correct RTL natural phrasing.
- For Chinese (zh), Japanese (ja), Korean (ko): use natural business phrasing.
- Return a JSON array with one object per ITEM. Each object must have:
  - item_index (number, 0-based)
  - title_translations (object: locale code → translated title)
  - description_translations (object: locale code → translated description)

Input items:
${inputText}`
      }]
    }],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            item_index: { type: 'NUMBER' },
            title_translations: {
              type: 'OBJECT',
              properties: LOCALE_SCHEMA_PROPS,
              required: ALL_LOCALES
            },
            description_translations: {
              type: 'OBJECT',
              properties: LOCALE_SCHEMA_PROPS,
              required: ALL_LOCALES
            }
          },
          required: ['item_index', 'title_translations', 'description_translations']
        }
      }
    }
  });

  return new Promise((resolve) => {
    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: `/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode === 429 || res.statusCode === 503) {
            const errMsg = parsed.error?.message || data;
            const retryAfter = parseRetryAfter(errMsg);
            console.warn(`  [Gemini] HTTP ${res.statusCode} — retry in ${retryAfter}s. Reason: ${errMsg.slice(0, 120)}`);
            resolve({ results: null, retryAfter });
            return;
          }
          if (res.statusCode !== 200) {
            console.error(`  [Gemini] HTTP ${res.statusCode}:`, parsed.error?.message || data.slice(0, 200));
            resolve({ results: null, retryAfter: 30 }); return;
          }
          const textResponse = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!textResponse) {
            console.error('  [Gemini] Empty response');
            resolve({ results: null, retryAfter: 10 }); return;
          }
          resolve({ results: JSON.parse(textResponse), retryAfter: null });
        } catch (e) {
          console.error('  [Gemini] Parse error:', e.message);
          resolve({ results: null, retryAfter: 15 });
        }
      });
    });

    req.on('error', (e) => {
      console.error('  [Gemini] Request error:', e.message);
      resolve({ results: null, retryAfter: 15 });
    });
    req.write(payload);
    req.end();
  });
}

function buildFallbackTranslations(title, description) {
  const t = {}, d = {};
  ALL_LOCALES.forEach(lc => { t[lc] = title; d[lc] = description; });
  return { title_translations: t, description_translations: d };
}

// ---------------------------------------------------------------------------
// 6. Main
// ---------------------------------------------------------------------------
async function main() {
  const args = process.argv.slice(2);
  const runAll      = args.includes('--all');
  const singleCountry = args.includes('--country') ? args[args.indexOf('--country') + 1] : null;
  const countLimit  = args.includes('--limit')     ? parseInt(args[args.indexOf('--limit') + 1], 10) : Infinity;
  const perCountry  = args.includes('--per-country')? parseInt(args[args.indexOf('--per-country') + 1], 10) : 3;
  const BATCH_SIZE  = 3; // max items per Gemini call

  console.log('╔══════════════════════════════════════════════╗');
  console.log('║       Global Listing Generator v2.0          ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log(`Mode            : ${runAll ? 'ALL countries' : singleCountry ? `Single → ${singleCountry}` : 'Missing countries only'}`);
  console.log(`Listings/country: ${perCountry}`);
  console.log(`Country limit   : ${countLimit === Infinity ? 'unlimited' : countLimit}`);
  console.log(`Batch size      : ${BATCH_SIZE} items → Gemini call (rate-limit safe)`);
  console.log(`Languages       : ${ALL_LOCALES.length}`);
  console.log('');

  // Load countries data
  const countriesDataPath = path.join(__dirname, 'countries-data.json');
  if (!fs.existsSync(countriesDataPath)) {
    console.error('countries-data.json not found! Run: node scripts/translate-all-countries.js');
    process.exit(1);
  }
  const allCountries = JSON.parse(fs.readFileSync(countriesDataPath, 'utf8'))
    .filter(c => c.englishName && c.cities && c.cities.length > 0);

  console.log(`Loaded ${allCountries.length} countries from countries-data.json`);

  // Verify shipper
  const { data: profile } = await supabase
    .from('public_profiles')
    .select('id')
    .eq('id', defaultShipperId)
    .maybeSingle();

  let activeShipperId = defaultShipperId;
  if (!profile) {
    const { data: fallback } = await supabase
      .from('public_profiles')
      .select('id')
      .eq('role', 'shipper')
      .limit(1)
      .maybeSingle();
    if (!fallback) {
      console.error('CRITICAL: No shipper profiles found in DB!');
      process.exit(1);
    }
    activeShipperId = fallback.id;
  }
  console.log(`Shipper ID      : ${activeShipperId}\n`);

  // Find which countries already have listings
  let coveredCountries = new Set();
  if (!runAll && !singleCountry) {
    const { data: existing } = await supabase
      .from('loads')
      .select('origin_country, destination_country')
      .eq('status', 'active')
      .limit(10000);
    (existing || []).forEach(row => {
      if (row.origin_country)      coveredCountries.add(row.origin_country.toLowerCase());
      if (row.destination_country) coveredCountries.add(row.destination_country.toLowerCase());
    });
    console.log(`Already covered: ${coveredCountries.size} countries`);
  }

  // Determine target list
  let targets = [...allCountries];
  if (singleCountry) {
    targets = targets.filter(c => c.englishName.toLowerCase().includes(singleCountry.toLowerCase()));
  } else if (!runAll) {
    targets = targets.filter(c => !coveredCountries.has(c.englishName.toLowerCase()));
  }
  if (isFinite(countLimit)) targets = targets.slice(0, countLimit);

  if (targets.length === 0) {
    console.log('✓ All countries already covered. Use --all to regenerate or --country <name> for a specific one.');
    return;
  }
  console.log(`Countries to generate: ${targets.length}\n`);

  // ---------------------------------------------------------------------------
  // Build all listing records first, then batch-translate and insert
  // ---------------------------------------------------------------------------
  let batchQueue = []; // { listingData, title, description }
  let totalInserted = 0;
  let batchCount = 0;

  function getRandomPickupDate() {
    const d = new Date();
    d.setDate(d.getDate() + Math.floor(Math.random() * 30) + 1);
    return d.toISOString();
  }

  async function flushBatch() {
    if (batchQueue.length === 0) return;
    batchCount++;
    console.log(`\n  ── Batch #${batchCount}: translating ${batchQueue.length} listings into ${ALL_LOCALES.length} languages...`);

    let response = await translateBatch(batchQueue);
    let translated = response?.results || null;

    // Smart retry: respect the exact retry-after time from the API
    if (!translated) {
      const waitMs = ((response?.retryAfter || 30) * 1000);
      console.warn(`  [Rate Limit] Waiting ${Math.round(waitMs/1000)}s before retry...`);
      await sleep(waitMs);
      response = await translateBatch(batchQueue);
      translated = response?.results || null;
    }

    // If still failing, wait longer and try one final time
    if (!translated) {
      const waitMs = ((response?.retryAfter || 45) * 1000);
      console.warn(`  [Rate Limit] Second retry after ${Math.round(waitMs/1000)}s...`);
      await sleep(waitMs);
      response = await translateBatch(batchQueue);
      translated = response?.results || null;
    }

    // Rate-limit delay: 5s after each successful API call
    await sleep(5000);

    for (let i = 0; i < batchQueue.length; i++) {
      const { listingData, title, description } = batchQueue[i];
      const trans = (translated || []).find(t => t.item_index === i);

      let titleTrans, descTrans;
      if (trans && trans.title_translations && trans.description_translations) {
        titleTrans = trans.title_translations;
        descTrans  = trans.description_translations;
      } else {
        console.warn(`  [Fallback] No translation for item ${i} — using en/tr fallback`);
        const fb = buildFallbackTranslations(title, description);
        titleTrans = fb.title_translations;
        descTrans  = fb.description_translations;
      }

      // DB insert — matches loads table schema exactly
      const { error } = await supabase.from('loads').insert({
        title,
        shipper_id:            activeShipperId,
        origin_city:           listingData.originCity,
        origin_state:          null,
        origin_country:        listingData.originCountry,
        destination_city:      listingData.destCity,
        destination_state:     null,
        destination_country:   listingData.destCountry,
        price:                 null,
        load_type:             listingData.loadType,
        required_truck_type:   listingData.truckType,
        weight_ton:            listingData.weight,
        description,
        status:                'active',
        assigned_driver_id:    null,
        shipper_confirmed:     false,
        driver_confirmed:      false,
        pickup_date:           listingData.pickupDate,
        delivery_date:         null,
        tags:                  ['generated', 'global', listingData.originCountry.toLowerCase().replace(/\s+/g, '-'), listingData.destCountry.toLowerCase().replace(/\s+/g, '-')],
        title_translations:    titleTrans,
        description_translations: descTrans
      });

      if (error) {
        console.error(`  [✗] Insert failed (${listingData.originCountry} ➜ ${listingData.destCountry}):`, error.message);
      } else {
        totalInserted++;
        console.log(`  [✓] ${title}`);
      }
    }

    batchQueue = [];
  }

  // ---------------------------------------------------------------------------
  // Generate listings
  // ---------------------------------------------------------------------------
  for (let ci = 0; ci < targets.length; ci++) {
    const { englishName: country, cities } = targets[ci];
    console.log(`[${ci + 1}/${targets.length}] ${country}`);

    for (let li = 0; li < perCountry; li++) {
      const cargo   = getCargoTemplate(ci * perCountry + li);
      const company = getCompanyForCountry(country, li);

      const originCity = cities[li % cities.length];

      // Pick destination from a different country
      const destCountryData = allCountries[(ci * 3 + li + 17) % allCountries.length];
      const safeDestCountry = destCountryData.englishName !== country
        ? destCountryData
        : allCountries[(ci * 3 + li + 41) % allCountries.length];
      const destCity    = safeDestCountry.cities[li % safeDestCountry.cities.length];
      const destCountry = safeDestCountry.englishName;

      // Route variation: outbound / inbound / cross-country
      let finalOriginCity, finalOriginCountry, finalDestCity, finalDestCountry;
      const variant = li % 3;
      if (variant === 0) {
        finalOriginCity    = originCity;    finalOriginCountry = country;
        finalDestCity      = destCity;      finalDestCountry   = destCountry;
      } else if (variant === 1) {
        finalOriginCity    = destCity;      finalOriginCountry = destCountry;
        finalDestCity      = originCity;    finalDestCountry   = country;
      } else {
        const cross = allCountries[(ci + li + 53) % allCountries.length];
        finalOriginCity    = originCity;    finalOriginCountry = country;
        finalDestCity      = cross.cities[0]; finalDestCountry = cross.englishName;
      }

      const title = `${finalOriginCity} (${finalOriginCountry}) ➜ ${finalDestCity} (${finalDestCountry}) — ${cargo.label}`;

      const description = `[Global Cargo Network] International freight opportunity.

Company: ${company.companyName}
Contact: ${company.contactPerson}
Phone: ${company.phone}
Email: ${company.email}

Route: ${finalOriginCity}, ${finalOriginCountry} → ${finalDestCity}, ${finalDestCountry}
Cargo Type: ${cargo.label}
Truck Type: ${cargo.truckType.toUpperCase()}
Estimated Weight: ${cargo.weight} tons

For inquiries, please contact the company directly using the information above.
This listing is part of the Global Cargo Network and was automatically generated.`;

      batchQueue.push({
        title,
        description,
        listingData: {
          originCity: finalOriginCity,
          originCountry: finalOriginCountry,
          destCity: finalDestCity,
          destCountry: finalDestCountry,
          loadType: cargo.loadType,
          truckType: cargo.truckType,
          weight: cargo.weight,
          pickupDate: getRandomPickupDate()
        }
      });

      if (batchQueue.length >= BATCH_SIZE) {
        await flushBatch();
      }
    }
  }

  // Flush remaining
  if (batchQueue.length > 0) await flushBatch();

  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║               Generation Complete            ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log(`Countries processed : ${targets.length}`);
  console.log(`Listings inserted   : ${totalInserted}`);
  console.log(`Languages per listing: ${ALL_LOCALES.length}`);
  console.log(`Gemini API batches  : ${batchCount}`);
}

main().then(() => process.exit(0)).catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
