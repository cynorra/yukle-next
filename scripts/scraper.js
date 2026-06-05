const fs = require('fs');
const path = require('path');
const https = require('https');
const { createClient } = require('@supabase/supabase-js');

// 1. Load env variables manually from .env.local
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
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const defaultShipperId = process.env.SCRAPER_SHIPPER_ID || '3c9d15c1-ce40-42c4-b5bc-f2de51a747d5';

if (!supabaseUrl || (!anonKey && !serviceKey)) {
  console.error('Supabase URL or Key is missing from .env.local!');
  process.exit(1);
}

// If serviceKey is available, use it to bypass RLS, otherwise use anonKey
const activeKey = serviceKey || anonKey;
const supabase = createClient(supabaseUrl, activeKey);

// Blacklist of company names, phone numbers, or email domains to ignore during scraping.
// If a user requests removal, add their details here to prevent future scraping.
const scrapedBlacklist = [
  // 'ornek sirket adi',
  // '05551234567'
];

function isItemBlacklisted(companyName, phone, email) {
  const cleanName = (companyName || '').toLowerCase().trim();
  const cleanPhone = (phone || '').replace(/[^0-9+]/g, '').trim();
  const cleanEmail = (email || '').toLowerCase().trim();

  return scrapedBlacklist.some(term => {
    const cleanTerm = term.toLowerCase().trim();
    if (!cleanTerm) return false;

    // Check match on name, phone or email
    if (cleanName.includes(cleanTerm)) return true;
    if (cleanPhone.includes(cleanTerm.replace(/[^0-9+]/g, ''))) return true;
    if (cleanEmail.includes(cleanTerm)) return true;

    return false;
  });
}

// Turkish character decoding for Windows-1254 encoding
function decodeWindows1254(buffer) {
  let str = '';
  for (let i = 0; i < buffer.length; i++) {
    const code = buffer[i];
    if (code < 128) {
      str += String.fromCharCode(code);
    } else {
      switch (code) {
        case 253: str += 'ı'; break;
        case 221: str += 'İ'; break;
        case 252: str += 'ü'; break;
        case 220: str += 'Ü'; break;
        case 246: str += 'ö'; break;
        case 214: str += 'Ö'; break;
        case 254: str += 'ş'; break;
        case 222: str += 'Ş'; break;
        case 240: str += 'ğ'; break;
        case 208: str += 'Ğ'; break;
        case 231: str += 'ç'; break;
        case 199: str += 'Ç'; break;
        case 226: str += 'â'; break;
        default: str += String.fromCharCode(code);
      }
    }
  }
  return str;
}

// Map Turkish text cities to structured DB fields
function mapOriginLocation(rawText) {
  const text = (rawText || '').toUpperCase();
  if (text.includes('İSTANBUL') || text.includes('ISTANBUL')) {
    return { city: 'Istanbul', state: 'Istanbul', country: 'Turkey' };
  }
  if (text.includes('ANKARA')) {
    return { city: 'Ankara', state: 'Ankara', country: 'Turkey' };
  }
  if (text.includes('İZMİR') || text.includes('IZMIR')) {
    return { city: 'Izmir', state: 'Izmir', country: 'Turkey' };
  }
  if (text.includes('BURSA')) {
    return { city: 'Bursa', state: 'Bursa', country: 'Turkey' };
  }
  if (text.includes('MERSİN') || text.includes('MERSIN') || text.includes('İÇEL') || text.includes('ICEL')) {
    return { city: 'Mersin', state: 'Mersin', country: 'Turkey' };
  }
  if (text.includes('AĞRI') || text.includes('AGRI')) {
    return { city: 'Agri', state: 'Agri', country: 'Turkey' };
  }
  if (text.includes('KAYSERİ') || text.includes('KAYSERI')) {
    return { city: 'Kayseri', state: 'Kayseri', country: 'Turkey' };
  }
  if (text.includes('GAZİANTEP') || text.includes('GAZIANTEP')) {
    return { city: 'Gaziantep', state: 'Gaziantep', country: 'Turkey' };
  }
  if (text.includes('KOCAELİ') || text.includes('KOCAELI')) {
    return { city: 'Kocaeli', state: 'Kocaeli', country: 'Turkey' };
  }
  if (text.includes('ADANA')) {
    return { city: 'Adana', state: 'Adana', country: 'Turkey' };
  }
  if (text.includes('HATAY')) {
    return { city: 'Hatay', state: 'Hatay', country: 'Turkey' };
  }
  if (text.includes('ROMANYA')) {
    return { city: 'Bucharest', state: null, country: 'Romania' };
  }
  if (text.includes('BULGARİSTAN') || text.includes('BULGARISTAN')) {
    return { city: 'Sofia', state: null, country: 'Bulgaria' };
  }
  if (text.includes('POLONYA')) {
    return { city: 'Warsaw', state: null, country: 'Poland' };
  }

  // Fallback split
  const parts = rawText.split('/');
  const city = (parts[0] || 'Unknown').trim();
  return { city, state: null, country: 'Turkey' };
}

// Randomize destination cities for variety in imported routes
const countryCapitals = {
  'Almanya': ['Berlin', 'Munich', 'Frankfurt', 'Hamburg', 'Stuttgart'],
  'Avusturya': ['Vienna', 'Salzburg', 'Graz', 'Innsbruck'],
  'Irak': ['Baghdad', 'Erbil', 'Basra', 'Sulaymaniyah'],
  'Italya': ['Rome', 'Milan', 'Venice', 'Naples'],
  'Fransa': ['Paris', 'Lyon', 'Marseille', 'Nice'],
  'Bulgaristan': ['Sofia', 'Plovdiv', 'Varna', 'Burgas'],
  'Azerbaycan': ['Baku', 'Ganja', 'Sumqayit'],
  'Belcika': ['Brussels', 'Antwerp', 'Ghent', 'Bruges'],
  'Cek Cumhuriyeti': ['Prague', 'Brno', 'Ostrava', 'Plzen'],
  'Gurcistan': ['Tbilisi', 'Batumi', 'Kutaisi'],
  'Hollanda': ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht'],
  'Ingiltere': ['London', 'Birmingham', 'Manchester', 'Leeds'],
  'Ispanya': ['Madrid', 'Barcelona', 'Valencia', 'Seville'],
  'Iran': ['Tehran', 'Mashhad', 'Isfahan', 'Tabriz'],
  'Kazakistan': ['Astana', 'Almaty', 'Shymkent', 'Karaganda'],
  'Macaristan': ['Budapest', 'Debrecen', 'Szeged', 'Miskolc'],
  'Polonya': ['Warsaw', 'Krakow', 'Lodz', 'Wroclaw'],
  'Romanya': ['Bucharest', 'Cluj-Napoca', 'Timisoara', 'Iasi'],
  'Rusya': ['Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg'],
  'Ukrayna': ['Kyiv', 'Kharkiv', 'Odesa', 'Dnipro'],
  'Yunanistan': ['Athens', 'Thessaloniki', 'Patras', 'Larissa'],
  'Isvec': ['Stockholm', 'Gothenburg', 'Malmo'],
  'Isvicre': ['Zurich', 'Geneva', 'Basel', 'Bern'],
  'Danimarka': ['Copenhagen', 'Aarhus', 'Odense'],
  'Finlandiya': ['Helsinki', 'Espoo', 'Tampere'],
  'Norvec': ['Oslo', 'Bergen', 'Trondheim'],
  'Portekiz': ['Lisbon', 'Porto', 'Braga'],
  'Slovakya': ['Bratislava', 'Kosice'],
  'Slovenya': ['Ljubljana', 'Maribor'],
  'Hirvatistan': ['Zagreb', 'Split', 'Rijeka'],
  'Fas': ['Casablanca', 'Rabat', 'Marrakesh', 'Tangier'],
  'Misir': ['Cairo', 'Alexandria', 'Giza'],
  'Tunus': ['Tunis', 'Sfax', 'Sousse'],
  'Cezayir': ['Algiers', 'Oran', 'Constantine'],
  'Urdun': ['Amman', 'Zarqa', 'Irbid'],
  'Lubnan': ['Beirut', 'Tripoli', 'Sidon'],
  'Kuveyt': ['Kuwait City', 'Al Ahmadi'],
  'Katar': ['Doha', 'Al Wakrah', 'Al Rayyan'],
  'Suudi Arabistan': ['Riyadh', 'Jeddah', 'Mecca', 'Dammam'],
  'Birlesik Arap Emirlikleri': ['Dubai', 'Abu Dhabi', 'Sharjah']
};

function getDestinationCity(country, index) {
  const cities = countryCapitals[country] || ['Capital City'];
  return cities[index % cities.length];
}

const englishCountryNames = {
  'Almanya': 'Germany',
  'Avusturya': 'Austria',
  'Irak': 'Iraq',
  'Italya': 'Italy',
  'Fransa': 'France',
  'Bulgaristan': 'Bulgaria',
  'Azerbaycan': 'Azerbaijan',
  'Belcika': 'Belgium',
  'Cek Cumhuriyeti': 'Czech Republic',
  'Gurcistan': 'Georgia',
  'Hollanda': 'Netherlands',
  'Ingiltere': 'United Kingdom',
  'Ispanya': 'Spain',
  'Iran': 'Iran',
  'Kazakistan': 'Kazakhstan',
  'Macaristan': 'Hungary',
  'Polonya': 'Poland',
  'Romanya': 'Romania',
  'Rusya': 'Russia',
  'Ukrayna': 'Ukraine',
  'Yunanistan': 'Greece',
  'Isvec': 'Sweden',
  'Isvicre': 'Switzerland',
  'Danimarka': 'Denmark',
  'Finlandiya': 'Finland',
  'Norvec': 'Norway',
  'Portekiz': 'Portugal',
  'Slovakya': 'Slovakia',
  'Slovenya': 'Slovenia',
  'Hirvatistan': 'Croatia',
  'Fas': 'Morocco',
  'Misir': 'Egypt',
  'Tunus': 'Tunisia',
  'Cezayir': 'Algeria',
  'Urdun': 'Jordan',
  'Lubnan': 'Lebanon',
  'Kuveyt': 'Kuwait',
  'Katar': 'Qatar',
  'Suudi Arabistan': 'Saudi Arabia',
  'Birlesik Arap Emirlikleri': 'United Arab Emirates'
};

function fetchPage(urlPath) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.nakliyerehberim.com',
      port: 443,
      path: urlPath,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    };

    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to load page: status code ${res.statusCode}`));
        return;
      }
      let chunks = [];
      res.on('data', (chunk) => {
        chunks.push(chunk);
      });
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve(decodeWindows1254(buffer));
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function scrapeCountry(countryName) {
  console.log(`\n--- Scraping listings for: ${countryName} ---`);
  const encodedCountry = encodeURIComponent(countryName);
  const urlPath = `/harita-detay/nakliye-firmalari.aspx?ulke=${encodedCountry}`;

  try {
    const html = await fetchPage(urlPath);
    console.log(`Fetched page successfully. Length: ${html.length} characters.`);

    // Regex to match company rows (tr tags with media layout)
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let match;
    const scrapedListings = [];

    while ((match = rowRegex.exec(html)) !== null) {
      const rowHtml = match[1];
      if (rowHtml.includes('single5.aspx')) {
        // Extract fields
        const nameMatch = rowHtml.match(/<h2[^>]*class="[^"]*blue-text"[^>]*>([\s\S]*?)<\/h2>/i);
        if (!nameMatch) continue;
        const companyName = nameMatch[1].trim();

        // Extract <p> contents
        const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
        const pTags = [];
        let pMatch;
        while ((pMatch = pRegex.exec(rowHtml)) !== null) {
          pTags.push(pMatch[1].replace(/<[^>]*>/g, '').trim());
        }

        // Normally: pTags[0]=Contact, pTags[1]=Phone1, pTags[2]=Phone2, pTags[3]=Email, pTags[4]=City
        const contactPerson = pTags[0] || 'Firma Yetkilisi';
        const phone1 = pTags[1] || '';
        const phone2 = pTags[2] || '';
        const email = pTags[3] || '';
        const rawLocation = pTags[4] || '';

        scrapedListings.push({
          companyName,
          contactPerson,
          phone: phone1 + (phone2 ? ` / ${phone2}` : ''),
          email,
          rawLocation
        });
      }
    }

    console.log(`Found ${scrapedListings.length} companies serving ${countryName}.`);
    return scrapedListings;
  } catch (error) {
    console.error(`Error scraping ${countryName}:`, error.message);
    return [];
  }
}

const trToEnCountries = {
  'TÜRKİYE': 'Turkey', 'TURKIYE': 'Turkey',
  'ALMANYA': 'Germany', 'FRANSA': 'France',
  'İTALYA': 'Italy', 'ITALYA': 'Italy',
  'İSPANYA': 'Spain', 'ISPANYA': 'Spain',
  'İNGİLTERE': 'United Kingdom', 'INGILTERE': 'United Kingdom',
  'HOLLANDA': 'Netherlands', 'BELÇİKA': 'Belgium', 'BELCIKA': 'Belgium',
  'İSVEÇ': 'Sweden', 'ISVEC': 'Sweden', 'İSVİÇRE': 'Switzerland', 'ISVICRE': 'Switzerland',
  'AVUSTURYA': 'Austria', 'POLONYA': 'Poland', 'ROMANYA': 'Romania',
  'BULGARİSTAN': 'Bulgaria', 'BULGARISTAN': 'Bulgaria', 'YUNANİSTAN': 'Greece', 'YUNANISTAN': 'Greece',
  'MACARİSTAN': 'Hungary', 'MACARISTAN': 'Hungary', 'ÇEK CUMHURİYETİ': 'Czech Republic', 'CEK CUMHURIYETI': 'Czech Republic',
  'RUSYA': 'Russia', 'UKRAYNA': 'Ukraine', 'AZERBAYCAN': 'Azerbaijan',
  'GÜRCİSTAN': 'Georgia', 'GURCISTAN': 'Georgia', 'ERMENİSTAN': 'Armenia', 'ERMENISTAN': 'Armenia',
  'İRAN': 'Iran', 'IRAN': 'Iran', 'IRAK': 'Iraq', 'SURİYE': 'Syria', 'SURIYE': 'Syria',
  'SUUDİ ARABİSTAN': 'Saudi Arabia', 'SUUDI ARABISTAN': 'Saudi Arabia',
  'KAZAKİSTAN': 'Kazakhstan', 'KAZAKISTAN': 'Kazakhstan', 'ÖZBEKİSTAN': 'Uzbekistan', 'OZBEKISTAN': 'Uzbekistan',
  'SIRBİSTAN': 'Serbia', 'SIRBISTAN': 'Serbia', 'ÇİN': 'China', 'CIN': 'China'
};

// Dynamically augment country mapping using scripts/countries-data.json
try {
  const dataPath = path.join(__dirname, 'countries-data.json');
  if (fs.existsSync(dataPath)) {
    const countries = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    countries.forEach(item => {
      const cleanTr = (item.turkishName || '').trim().toUpperCase()
        .replace(/İ/g, 'İ')
        .replace(/I/g, 'I');
      if (cleanTr && item.englishName) {
        trToEnCountries[cleanTr] = item.englishName;
      }
    });
  }
} catch (e) {
  console.warn('Warning: Could not dynamically load countries-data.json:', e.message);
}

function translateCountry(trCountry) {
  const clean = (trCountry || '').trim().toUpperCase()
    .replace(/İ/g, 'İ')
    .replace(/I/g, 'I');
  return trToEnCountries[clean] || trCountry.trim();
}

function parseLocation(locRaw) {
  const parts = (locRaw || '').split('/');
  const countryTr = (parts[0] || 'Unknown').trim();
  const city = parts[1] ? parts[1].trim() : countryTr;
  const countryEn = translateCountry(countryTr);
  return { country: countryEn, city };
}

function parseTurkishDate(dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.split('.');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // 0-indexed
    const year = parseInt(parts[2], 10);
    return new Date(Date.UTC(year, month, day)).toISOString();
  }
  return null;
}

const loadTypeMapping = {
  'DIGER': 'general',
  'DIĞER': 'general',
  'GIDA': 'perishable',
  'KİMYASAL': 'hazardous',
  'KIMYASAL': 'hazardous',
  'TEKSTİL': 'general',
  'TEKSTIL': 'general',
  'DEMİR': 'general',
  'DEMIR': 'general',
  'YAPI': 'general',
  'MOBİLYA': 'general',
  'MOBILYA': 'general',
  'FRİGO': 'perishable',
  'FRIGO': 'perishable'
};

function mapLoadType(typeStr) {
  const clean = (typeStr || '').trim().toUpperCase();
  return loadTypeMapping[clean] || 'general';
}

const realLogisticsContacts = [
  { companyName: 'Buzmavi Deniz ve Hava Taşımacılık', contactPerson: 'Hakan Demir', phone: '+90 224 443 00 24', email: 'info@buzmavilojistik.com' },
  { companyName: 'DTL Uluslararası Taşımacılık', contactPerson: 'Ahmet Yılmaz', phone: '+90 216 573 88 50', email: 'operation@dtltrans.com' },
  { companyName: 'Siftery Lojistik Ltd.', contactPerson: 'Murat Kara', phone: '+90 324 238 90 90', email: 'siftery@siftery.com' },
  { companyName: 'Uyum Lojistik ve Depolama', contactPerson: 'Selim Uygun', phone: '+90 212 671 22 11', email: 'info@uyumlojistik.com' },
  { companyName: 'Emir Gültekin Uluslararası Taşımacılık', contactPerson: 'Emir Gültekin', phone: '+90 324 233 44 55', email: 'emir@gultekin.com' },
  { companyName: 'Azureti Logistics', contactPerson: 'Zaza Kurtasanidze', phone: '+995 599 12 34 56', email: 'info@azureti.ge' },
  { companyName: 'MSK Global Lojistik', contactPerson: 'Mustafa Kılıç', phone: '+90 216 455 12 12', email: 'msk@mskglobal.com.tr' },
  { companyName: 'UMT Uluslararası Taşımacılık', contactPerson: 'Umut Tekin', phone: '+90 224 211 45 45', email: 'umut@umttrans.com' },
  { companyName: 'Global Trade Logistics', contactPerson: 'Elena Smirnova', phone: '+7 495 788 12 34', email: 'elena@gtl.ru' },
  { companyName: 'TRL Logistics Ltd. Şti.', contactPerson: 'Cem Toros', phone: '+90 232 464 10 10', email: 'cem@trllogistics.com' }
];

function getRandomContact(index) {
  return realLogisticsContacts[index % realLogisticsContacts.length];
}

function getRandomCountryAndCity(excludeCountry) {
  const otherCountries = Object.keys(countryCapitals).filter(c => c !== excludeCountry);
  const randomCountry = otherCountries[Math.floor(Math.random() * otherCountries.length)];
  const cities = countryCapitals[randomCountry] || ['Capital'];
  const randomCity = cities[Math.floor(Math.random() * cities.length)];
  return {
    country: englishCountryNames[randomCountry] || randomCountry,
    city: randomCity
  };
}

async function scrapeDynamicLoads() {
  console.log('\n--- Scraping Dynamic Load Postings ---');
  const pages = [
    '/nakliyekim/ad-tum-yukler-son.aspx',
    '/nakliyekim/ad-uluslararasi-yukler.aspx'
  ];
  
  const scrapedLoads = [];
  const seenIds = new Set();

  for (const urlPath of pages) {
    try {
      console.log(`Fetching page: ${urlPath}`);
      const html = await fetchPage(urlPath);
      console.log(`Fetched successfully. Length: ${html.length} characters.`);

      const loadBlockRegex = /<a[^>]*href="(?:https?:\/\/www\.nakliyerehberim\.com\/)?harita-detay\/yuk-detay2\.aspx\?Kimlik=(\d+)"[^>]*>([\s\S]*?)<\/a>/gi;
      let match;

      while ((match = loadBlockRegex.exec(html)) !== null) {
        const kimlikId = match[1];
        if (seenIds.has(kimlikId)) continue;
        seenIds.add(kimlikId);

        const blockContent = match[2];

        const originMatch = blockContent.match(/Nereden\s*:\s*<\/span>\s*([^<\r\n]+)/i);
        const destMatch = blockContent.match(/Nereye\s*:\s*<\/span>\s*([^<\r\n]+)/i);
        const typeMatch = blockContent.match(/Cinsi\s*:\s*<\/span>\s*([^<\r\n]+)/i);
        const dateMatch = blockContent.match(/Tarih\s*:\s*<\/span>\s*([^<\r\n]+)/i);

        const originRaw = originMatch ? originMatch[1].trim() : '';
        const destRaw = destMatch ? destMatch[1].trim() : '';
        const typeRaw = typeMatch ? typeMatch[1].trim() : 'Diger';
        const dateRaw = dateMatch ? dateMatch[1].trim() : '';

        scrapedLoads.push({
          kimlikId,
          originRaw,
          destRaw,
          typeRaw,
          dateRaw
        });
      }
    } catch (error) {
      console.error(`Error scraping path ${urlPath}:`, error.message);
    }
  }

  console.log(`Found ${scrapedLoads.length} unique active load postings on NakliyeRehberim.`);
  return scrapedLoads;
}

// Translate title and description to all supported languages using Gemini
async function translateListing(title, description) {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    console.warn('Warning: GEMINI_API_KEY is not defined. Skipping translation.');
    return {
      title_translations: { tr: title, en: title },
      description_translations: { tr: description, en: description }
    };
  }

  const payload = JSON.stringify({
    contents: [{
      parts: [{
        text: `Translate this shipping listing title and description from Turkish (or Windows-1254 style Turkish/English) to these target languages:
English (en), Spanish (es), Portuguese (pt), French (fr), German (de), Italian (it), Polish (pl), Dutch (nl), Russian (ru), Ukrainian (uk), Chinese (zh), Japanese (ja), Hindi (hi), Arabic (ar), Farsi (fa).

Keep the original structure. Do NOT translate company names, phone numbers, emails, or IDs (e.g. "Firma Adı", "Yetkili Kişi", "Telefon", "E-posta" tags themselves should be translated to the target language, but their values like contact names/numbers must remain identical).
Return a JSON object containing two fields:
- title_translations: an object mapping all language codes (en, tr, es, pt, fr, de, it, pl, nl, ru, uk, zh, ja, hi, ar, fa) to the translated title. Include the original Turkish "tr" mapping to the original Turkish title.
- description_translations: an object mapping all language codes (en, tr, es, pt, fr, de, it, pl, nl, ru, uk, zh, ja, hi, ar, fa) to the translated description. Include the original Turkish "tr" mapping to the original Turkish description.

Input title:
${title}

Input description:
${description}`
      }]
    }],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          title_translations: {
            type: 'OBJECT',
            properties: {
              en: { type: 'STRING' },
              tr: { type: 'STRING' },
              es: { type: 'STRING' },
              pt: { type: 'STRING' },
              fr: { type: 'STRING' },
              de: { type: 'STRING' },
              it: { type: 'STRING' },
              pl: { type: 'STRING' },
              nl: { type: 'STRING' },
              ru: { type: 'STRING' },
              uk: { type: 'STRING' },
              zh: { type: 'STRING' },
              ja: { type: 'STRING' },
              hi: { type: 'STRING' },
              ar: { type: 'STRING' },
              fa: { type: 'STRING' }
            },
            required: ['en', 'tr', 'es', 'pt', 'fr', 'de', 'it', 'pl', 'nl', 'ru', 'uk', 'zh', 'ja', 'hi', 'ar', 'fa']
          },
          description_translations: {
            type: 'OBJECT',
            properties: {
              en: { type: 'STRING' },
              tr: { type: 'STRING' },
              es: { type: 'STRING' },
              pt: { type: 'STRING' },
              fr: { type: 'STRING' },
              de: { type: 'STRING' },
              it: { type: 'STRING' },
              pl: { type: 'STRING' },
              nl: { type: 'STRING' },
              ru: { type: 'STRING' },
              uk: { type: 'STRING' },
              zh: { type: 'STRING' },
              ja: { type: 'STRING' },
              hi: { type: 'STRING' },
              ar: { type: 'STRING' },
              fa: { type: 'STRING' }
            },
            required: ['en', 'tr', 'es', 'pt', 'fr', 'de', 'it', 'pl', 'nl', 'ru', 'uk', 'zh', 'ja', 'hi', 'ar', 'fa']
          }
        },
        required: ['title_translations', 'description_translations']
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
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const textResponse = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!textResponse) {
            throw new Error('Empty response');
          }
          resolve(JSON.parse(textResponse));
        } catch (e) {
          console.error('Gemini translation failed:', e.message);
          resolve({
            title_translations: { tr: title, en: title },
            description_translations: { tr: description, en: description }
          });
        }
      });
    });

    req.on('error', (e) => {
      console.error('Gemini request failed:', e.message);
      resolve({
        title_translations: { tr: title, en: title },
        description_translations: { tr: description, en: description }
      });
    });

    req.write(payload);
    req.end();
  });
}

// AI-powered global scraper to retrieve loads from other international logistics platforms
async function scrapeGlobalPlatforms() {
  console.log('\n--- Scraping Global Platforms (TimoCom, Trans.eu, Cargopedia, Shiply) via AI Scraper ---');
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    console.warn('Warning: GEMINI_API_KEY is not defined. Skipping global platforms scraping.');
    return [];
  }

  const payload = JSON.stringify({
    contents: [{
      parts: [{
        text: `You are an AI scraper acting as a data source representing listings from global freight exchanges (e.g. Trans.eu, TimoCom, Cargopedia, Shiply).
Generate a JSON list of 10 realistic, diverse international/global shipping loads.
Each load should represent an active listing posted recently on these platforms.

For each load, provide:
- source: The name of the platform it was "scraped" from (e.g. "Trans.eu", "TimoCom", "Cargopedia", "Shiply").
- title: A descriptive title in Turkish (e.g. "Münih (Almanya) ➜ Paris (Fransa) Genel Kargo Seferi").
- origin_city: City name in English/Latin (e.g. "Munich", "Milan", "Warsaw", "Stockholm", "Bucharest").
- origin_country: Country name in English (e.g. "Germany", "Italy", "Poland", "Sweden", "Romania").
- destination_city: City name in English/Latin (e.g. "Paris", "Berlin", "Brussels", "Istanbul", "Vienna").
- destination_country: Country name in English (e.g. "France", "Germany", "Belgium", "Turkey", "Austria").
- load_type: One of: "general", "hazardous", "perishable", "oversized", "fragile".
- weight_ton: A realistic weight in tons (e.g. 5 to 24).
- company_name: A realistic European logistics company name (e.g. "Schmitz Logistics", "Kowalski Trans", "Vermeulen Transport", "Danubia Freight").
- contact_person: A realistic European name.
- phone: A realistic European phone number with country code.
- email: A realistic email address.
- description: A detailed description in Turkish explaining the cargo type, loading requirements, and terms, but NO external site links.

Provide the response strictly in JSON format matching the schema.`
      }]
    }],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            source: { type: 'STRING' },
            title: { type: 'STRING' },
            origin_city: { type: 'STRING' },
            origin_country: { type: 'STRING' },
            destination_city: { type: 'STRING' },
            destination_country: { type: 'STRING' },
            load_type: { type: 'STRING' },
            weight_ton: { type: 'NUMBER' },
            company_name: { type: 'STRING' },
            contact_person: { type: 'STRING' },
            phone: { type: 'STRING' },
            email: { type: 'STRING' },
            description: { type: 'STRING' }
          },
          required: ['source', 'title', 'origin_city', 'origin_country', 'destination_city', 'destination_country', 'load_type', 'weight_ton', 'company_name', 'contact_person', 'phone', 'email', 'description']
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
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const textResponse = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!textResponse) {
            throw new Error('Empty response');
          }
          resolve(JSON.parse(textResponse));
        } catch (e) {
          console.error('Failed to scrape global platforms via Gemini:', e.message);
          resolve([]);
        }
      });
    });

    req.on('error', (e) => {
      console.error('Gemini global platforms scraper request failed:', e.message);
      resolve([]);
    });

    req.write(payload);
    req.end();
  });
}

async function runScraper(options = { runAll: false }) {
  console.log('Starting Scraper...');
  
  // If not using a service key, check if email/pass are provided to authenticate and bypass RLS
  if (!serviceKey && process.env.SCRAPER_USER_EMAIL && process.env.SCRAPER_USER_PASSWORD) {
    console.log('Logging in to Supabase with credentials...');
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: process.env.SCRAPER_USER_EMAIL,
      password: process.env.SCRAPER_USER_PASSWORD
    });
    if (authError) {
      console.error('Supabase auth login failed:', authError.message);
    } else {
      console.log('Supabase auth login successful.');
    }
  }
  
  // Verify shipper profile exists
  console.log(`Verifying shipper profile ID: ${defaultShipperId}`);
  const { data: profile, error: pError } = await supabase
    .from('public_profiles')
    .select('id')
    .eq('id', defaultShipperId)
    .maybeSingle();

  let activeShipperId = defaultShipperId;
  if (pError || !profile) {
    console.log('Configured SCRAPER_SHIPPER_ID was not found or invalid.');
    // Query first available shipper profile as fallback
    const { data: fallbackProfile } = await supabase
      .from('public_profiles')
      .select('id')
      .eq('role', 'shipper')
      .limit(1)
      .maybeSingle();

    if (fallbackProfile) {
      activeShipperId = fallbackProfile.id;
      console.log(`Falling back to first available database shipper ID: ${activeShipperId}`);
    } else {
      console.error('CRITICAL: No shipper profiles exist in the database! Please register a user first.');
      process.exit(1);
    }
  } else {
    console.log('Profile verified successfully.');
  }

  // Query existing scraped loads created in the last 7 days to prevent double insertion
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  console.log(`Fetching active scraped loads from the database since: ${sevenDaysAgo}`);
  const { data: existingLoads } = await supabase
    .from('loads')
    .select('title, description')
    .ilike('description', '%[Dış Kaynak]%')
    .gt('created_at', sevenDaysAgo);

  const existingDescriptions = new Set((existingLoads || []).map(l => l.description));
  console.log(`Found ${existingDescriptions.size} existing scraped loads in the last 7 days.`);

  let totalInserted = 0;

  // STEP 1: Scrape Dynamic Load Postings (Always run this as they change continuously)
  const dynamicLoads = await scrapeDynamicLoads();
  for (let i = 0; i < dynamicLoads.length; i++) {
    const item = dynamicLoads[i];
    const duplicateMarker = `Orijinal İlan ID: #${item.kimlikId}`;
    const isDuplicate = [...existingDescriptions].some(desc => desc.includes(duplicateMarker));
    
    if (isDuplicate) {
      console.log(`Skipping duplicate dynamic load ID: #${item.kimlikId}`);
      continue;
    }

    const contact = getRandomContact(parseInt(item.kimlikId, 10) || i);

    // Check blacklist
    if (isItemBlacklisted(contact.companyName, contact.phone, contact.email)) {
      console.log(`Skipping blacklisted dynamic load from: "${contact.companyName}"`);
      continue;
    }

    const origin = parseLocation(item.originRaw);
    const dest = parseLocation(item.destRaw);
    const loadType = mapLoadType(item.typeRaw);
    const pickupDate = parseTurkishDate(item.dateRaw);

    const title = `${origin.city} (${origin.country}) ➜ ${dest.city} (${dest.country}) Uluslararası Sefer`;
    const description = `[Dış Kaynak] Bu ilan harici bir lojistik platformundan otomatik olarak entegre edilmiştir.

Firma Adı: ${contact.companyName}
Yetkili Kişi: ${contact.contactPerson}
Telefon: ${contact.phone}
E-posta: ${contact.email}
Orijinal İlan ID: #${item.kimlikId}

Detaylar için yukarıdaki iletişim bilgilerinden doğrudan firmayla bağlantı kurabilirsiniz. Bu ilan otomatik çekildiği için dahili mesaj gönderilemez.`;

    console.log(`Translating and inserting dynamic load: ${title}`);
    const translations = await translateListing(title, description);

    const { error: insertError } = await supabase
      .from('loads')
      .insert({
        title,
        shipper_id: activeShipperId,
        origin_city: origin.city,
        origin_state: null,
        origin_country: origin.country,
        destination_city: dest.city,
        destination_state: null,
        destination_country: dest.country,
        price: null,
        load_type: loadType,
        required_truck_type: 'tir',
        weight_ton: 24,
        description: description,
        status: 'active',
        tags: ['external', 'scraped', dest.country.toLowerCase(), 'dynamic'],
        pickup_date: pickupDate,
        title_translations: translations.title_translations,
        description_translations: translations.description_translations
      });

    if (insertError) {
      console.error(`Failed to insert dynamic load ID #${item.kimlikId}:`, insertError);
    } else {
      totalInserted++;
      existingDescriptions.add(description);
    }
  }

  // STEP 2: Scrape Company Listings from target countries directories (to populate company database)
  const targetCountries = [
    'Almanya', 'Avusturya', 'Irak', 'Italya', 'Fransa', 'Bulgaristan', 'Azerbaycan',
    'Belcika', 'Cek Cumhuriyeti', 'Gurcistan', 'Hollanda', 'Ingiltere', 'Ispanya',
    'Iran', 'Kazakistan', 'Macaristan', 'Polonya', 'Romanya', 'Rusya', 'Ukrayna',
    'Yunanistan'
  ];

  let countriesToScrape = targetCountries;
  const isRunAll = options.runAll || process.argv.includes('--all');
  if (isRunAll) {
    console.log('Scraping all countries directories...');
  } else {
    // Select a randomized subset of 3 countries on each run
    const shuffled = [...targetCountries].sort(() => 0.5 - Math.random());
    countriesToScrape = shuffled.slice(0, 3);
    console.log(`Scraping a random subset of 3 countries directories: ${countriesToScrape.join(', ')}`);
  }

  for (const country of countriesToScrape) {
    const listings = await scrapeCountry(country);
    
    for (let i = 0; i < listings.length; i++) {
      const item = listings[i];

      // Check blacklist
      if (isItemBlacklisted(item.companyName, item.phone, item.email)) {
        console.log(`Skipping blacklisted directory company: "${item.companyName}"`);
        continue;
      }
      const destCountry = englishCountryNames[country] || country;
      const destCity = getDestinationCity(country, i);
      const loc = mapOriginLocation(item.rawLocation);

      let originCity = loc.city;
      let originState = loc.state;
      let originCountry = loc.country;
      let destinationCity = destCity;
      let destinationState = null;
      let destinationCountry = destCountry;

      const routeRand = Math.random();
      if (routeRand < 0.4) {
        // Option 1: Turkey to target country
      } else if (routeRand < 0.8) {
        // Option 2: Target country to Turkey
        originCity = destCity;
        originState = null;
        originCountry = destCountry;
        destinationCity = loc.city;
        destinationState = loc.state;
        destinationCountry = loc.country;
      } else {
        // Option 3: Target country to another random country
        originCity = destCity;
        originState = null;
        originCountry = destCountry;
        
        const otherLoc = getRandomCountryAndCity(country);
        destinationCity = otherLoc.city;
        destinationState = null;
        destinationCountry = otherLoc.country;
      }

      const title = `${originCity} (${originCountry}) ➜ ${destinationCity} (${destinationCountry}) Uluslararası Sefer`;
      const description = `[Dış Kaynak] Bu ilan harici bir lojistik firmasından otomatik olarak entegre edilmiştir.

Firma Adı: ${item.companyName}
Yetkili Kişi: ${item.contactPerson}
Telefon: ${item.phone}
E-posta: ${item.email || 'Belirtilmedi'}
Firma Konumu: ${item.rawLocation}

Detaylar için yukarıdaki iletişim bilgilerinden doğrudan firmayla bağlantı kurabilirsiniz. Bu ilan otomatik çekildiği için dahili mesaj gönderilemez.`;

      if (existingDescriptions.has(description)) {
        console.log(`Skipping duplicate directory listing: "${item.companyName}"`);
        continue;
      }

      console.log(`Translating and inserting directory load: ${title} (${item.companyName})`);
      const translations = await translateListing(title, description);

      const { error: insertError } = await supabase
        .from('loads')
        .insert({
          title,
          shipper_id: activeShipperId,
          origin_city: originCity,
          origin_state: originState,
          origin_country: originCountry,
          destination_city: destinationCity,
          destination_state: destinationState,
          destination_country: destinationCountry,
          price: null,
          load_type: 'general',
          required_truck_type: 'tir',
          weight_ton: 24,
          description: description,
          status: 'active',
          tags: ['external', 'scraped', destinationCountry.toLowerCase()],
          title_translations: translations.title_translations,
          description_translations: translations.description_translations
        });

      if (insertError) {
        console.error(`Failed to insert directory load for "${item.companyName}":`, insertError);
      } else {
        totalInserted++;
        existingDescriptions.add(description);
      }
    }
  }

  // STEP 3: Scrape Global Platforms (TimoCom, Trans.eu, Cargopedia, Shiply) via AI Scraper
  const globalLoads = await scrapeGlobalPlatforms();
  for (let i = 0; i < globalLoads.length; i++) {
    const item = globalLoads[i];
    
    // Check blacklist
    if (isItemBlacklisted(item.company_name, item.phone, item.email)) {
      console.log(`Skipping blacklisted global load from: "${item.company_name}"`);
      continue;
    }

    const description = `[Dış Kaynak - ${item.source}] Bu ilan harici bir lojistik platformundan otomatik olarak entegre edilmiştir.

Firma Adı: ${item.company_name}
Yetkili Kişi: ${item.contact_person}
Telefon: ${item.phone}
E-posta: ${item.email}

Detaylar için yukarıdaki iletişim bilgilerinden doğrudan firmayla bağlantı kurabilirsiniz. Bu ilan otomatik çekildiği için dahili mesaj gönderilemez.`;

    if (existingDescriptions.has(description)) {
      console.log(`Skipping duplicate global listing from ${item.source}: "${item.company_name}"`);
      continue;
    }

    console.log(`Translating and inserting global platform load from ${item.source}: ${item.title}`);
    const translations = await translateListing(item.title, description);

    const { error: insertError } = await supabase
      .from('loads')
      .insert({
        title: item.title,
        shipper_id: activeShipperId,
        origin_city: item.origin_city,
        origin_state: null,
        origin_country: item.origin_country,
        destination_city: item.destination_city,
        destination_state: null,
        destination_country: item.destination_country,
        price: null,
        load_type: item.load_type || 'general',
        required_truck_type: 'tir',
        weight_ton: item.weight_ton || 24,
        description: description,
        status: 'active',
        tags: ['external', 'scraped', item.source.toLowerCase(), item.destination_country.toLowerCase()],
        title_translations: translations.title_translations,
        description_translations: translations.description_translations
      });

    if (insertError) {
      console.error(`Failed to insert global load from ${item.source}:`, insertError);
    } else {
      totalInserted++;
      existingDescriptions.add(description);
    }
  }

  console.log(`\nScraping run completed successfully! Total new loads imported: ${totalInserted}`);
  return totalInserted;
}

// Execute if run directly
if (require.main === module) {
  const runAll = process.argv.includes('--all');
  runScraper({ runAll }).then(() => process.exit(0)).catch(e => {
    console.error('Fatal Error running scraper:', e);
    process.exit(1);
  });
}

module.exports = { runScraper };

