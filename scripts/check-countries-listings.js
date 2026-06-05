const fs = require('fs');
const https = require('https');

// Read the countries list we extracted
const countriesList = [
  "Afganistan", "Almanya", "Amerika Birlesik Devletleri", "Angola", "Arjantin", "Arnavutluk", "Avustralya", "Avusturya", "Azerbaycan", "BAE",
  "Bahrain", "Banglades", "Belarus", "Belcika", "Bosna Hersek", "Brezilya", "Britanya", "Bulgaristan", "Cezayir", "Cin",
  "Danımarka", "Ekvator", "Endonezya", "Ermenistan", "Estonya", "Etiyopya", "Fas", "Filipinler", "Finlandiya", "Fransa",
  "Gana", "Georgia", "Guatemala", "Guney Afrika", "Guney Kore", "Gurcistan", "Hırvatistan", "Hindistan", "Hollanda", "Honduras",
  "Irak", "Iran", "Irlanda", "Ispanya", "Israil", "Isvec", "Isvicre", "Italya", "Izlanda", "Japonya",
  "Kanada", "Katar", "Kazakistan", "Kenya", "KIBRIS", "Kirgizistan", "Kolombiya", "Kosova", "Kuveyt", "Letonya Cumhuriyeti",
  "Libya", "Litvanya", "Lubnan", "Luksemburg", "Macaristan", "Makedonya", "Malezya", "Malta", "Meksika", "Misir",
  "Moldova", "Monako", "Mozambik", "Nepal", "Nijerya", "Norvec", "Ozbekistan", "Pakistan", "Panama", "Paraguay",
  "Peru", "Polonya", "Portekiz", "Romanya", "Rusya", "Senegal", "Sili", "Singapur", "Sirbistan", "Slovakya",
  "Slovenya", "Somali", "Sri Lanka", "Sudan", "Suriye", "Suudi Arabistan", "Tacikistan", "Tayland", "Tayvan", "Tunus",
  "Turkiye", "Turkmenistan", "Uganda", "Ukrayna", "Umman", "Urdun", "Uruguay", "Vatikan", "Venezuella", "Vietnam",
  "Yemen", "Yeni Zelanda", "Yunanistan"
];

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
        default: str += String.fromCharCode(code);
      }
    }
  }
  return str;
}

function fetchPage(countryName) {
  return new Promise((resolve) => {
    const encoded = encodeURIComponent(countryName);
    const options = {
      hostname: 'www.nakliyerehberim.com',
      port: 443,
      path: `/harita-detay/nakliye-firmalari.aspx?ulke=${encoded}`,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)'
      }
    };

    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        resolve({ country: countryName, count: 0, error: res.statusCode });
        return;
      }
      let chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const html = decodeWindows1254(Buffer.concat(chunks));
        const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
        let count = 0;
        let match;
        while ((match = rowRegex.exec(html)) !== null) {
          if (match[1].includes('single5.aspx')) {
            count++;
          }
        }
        resolve({ country: countryName, count });
      });
    });

    req.on('error', (err) => {
      resolve({ country: countryName, count: 0, error: err.message });
    });
    req.end();
  });
}

async function run() {
  console.log('Checking subset of countries for active company listings...');
  const results = [];
  
  // Let's run in chunks of 5
  const chunkSize = 5;
  for (let i = 0; i < countriesList.length; i += chunkSize) {
    const chunk = countriesList.slice(i, i + chunkSize);
    const promises = chunk.map(c => fetchPage(c));
    const chunkRes = await Promise.all(promises);
    results.push(...chunkRes);
    
    // Log progress
    chunkRes.forEach(r => {
      if (r.count > 0) {
        console.log(`Country: ${r.country} has ${r.count} listings.`);
      }
    });
    
    // Tiny sleep to be polite
    await new Promise(r => setTimeout(r, 200));
  }

  const activeCountries = results.filter(r => r.count > 0);
  console.log('\nActive Countries count:', activeCountries.length);
  fs.writeFileSync('scripts/active-countries.json', JSON.stringify(activeCountries, null, 2));
  console.log('Saved to scripts/active-countries.json');
}

run();
