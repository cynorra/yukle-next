const fs = require('fs');
const path = require('path');
const https = require('https');

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

const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  console.error('GEMINI_API_KEY is not defined in .env.local!');
  process.exit(1);
}

const turkishCountries = [
  "Afganistan", "Almanya", "American Samoa", "Amerika Birlesik Devletleri", "Andorra", "Angola", "Anguilla", "Antartika", "Antigua & Barbuda", "Arjantin",
  "Arnavutluk", "Aruba", "Avustralya", "Avusturya", "Azerbaycan", "BAE", "Bahamas", "Bahrain", "Banglades", "Barbados",
  "Belarus", "Belcika", "Belize", "Benin", "Bermuda", "Bhutan", "Birlesik Arap Emirligi", "Bolivya", "Bosna Hersek", "Botswana",
  "Brezilya", "Britanya", "British Virgin Islands", "Brunei", "Bulgaristan", "Burkina Faso", "Burundi", "Buyuk Sahra", "cad", "Cape Verde",
  "Cayman Islands", "Cek Cumhuriyeti", "Cezayir", "Cin", "Comoros", "Congo (Dem. Rep.)", "Cook Islands", "Costa Rica", "Cote d'Ivoire", "Cozumel",
  "Cuba", "Curaçao", "Danımarka", "Djibouti", "Dominica", "Dominik Cumhuriyeti", "East Timor", "Ekvator", "Ekvator Ginesi", "El Salvador",
  "Endonezya", "Eritre", "Ermenistan", "Estonya", "Etiyopya", "Falkland Islands", "Faroe Islands", "Fas", "Fiji", "Filipinler",
  "Finlandiya", "Fransa", "French Guiana", "French Polynesia", "Gabon", "Galler", "Gambia", "Gana", "Georgia", "Gibraltar",
  "Grenada", "Grönland", "Guadeloupe", "Guam", "Guatemala", "Guernsey", "Guyana", "Guney Afrika", "Guney Kore", "Gurcistan",
  "Haiti", "Hırvatistan", "Hindistan", "Hollanda", "Honduras", "Hong Kong", "Irak", "Iran", "Irlanda", "Ispanya",
  "Israil", "Isvec", "Isvicre", "Italya", "Izlanda", "Jamaika", "Japonya", "Jersey", "Kambocya", "Kamerun",
  "Kanada", "Katar", "Kazakistan", "Kenya", "KIBRIS", "Kirgizistan", "Kiribati", "Kolombiya", "Kongo", "Kosova",
  "Kostarika", "Kuba", "Kuveyt", "Kuzey Kore", "Laos", "Lesotho", "Letonya Cumhuriyeti", "Liberya", "Libya", "Liechtenstein",
  "Litvanya", "Lubnan", "Luksemburg", "Macaristan", "Madagaskar", "Makedonya", "Malawi", "Maldives", "Malezya", "Mali",
  "Malta", "Man (Isle of)", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Meksika", "Micronesia", "Misir",
  "Mogolistan", "Moldova", "Monako", "Moritanya", "Mozambik", "Myanmar", "Nauru", "Nepal", "Netherlands Antilles", "New Caledonia",
  "Nijer", "Nijerya", "Nikaragua", "Niue", "Norfolk", "Northern Mariana Islands", "Norvec", "Orta Afrika", "Ozbekistan", "Pakistan",
  "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Polonya", "Portekiz", "Puerto Rico", "Romanya", "Rusya",
  "Rwanda", "Saint Helena", "Saint Kitts and Nevis", "Saint Lucia", "Saint Pierre & Miquelon", "Samoa", "San Marino", "Sao Tome & Principe", "Senegal", "Seychelles",
  "Sierra Leone", "Sili", "Singapur", "Sirbistan", "Sirbistan Karadag", "Slovakya", "Slovenya", "Smaller Territories of the UK", "Solomon Islands", "Somali",
  "Sri Lanka", "St. Vincent & the Grenadines", "Sudan", "Suriname", "Suriye", "Suudi Arabistan", "Svalbard and Jan Mayen", "Swaziland", "Tacikistan", "Tanzanya",
  "Tayland", "Tayvan", "Terres Australes", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunus", "Turkiye", "Turkmenistan",
  "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukrayna", "Umman", "Urdun", "Uruguay", "Vanuatu", "Vatikan", "Venezuella",
  "Vietnam", "Virgin Islands of the USA", "Wallis & Futuna", "Yemen", "Yeni Zelanda", "Yunanistan", "Zambiya"
];

const countriesDataPath = 'scripts/countries-data.json';
let existingData = [];
if (fs.existsSync(countriesDataPath)) {
  try {
    existingData = JSON.parse(fs.readFileSync(countriesDataPath, 'utf8'));
  } catch (e) {
    console.error('Error reading countries-data.json:', e);
  }
}

const existingTurkishNames = new Set(existingData.map(c => c.turkishName));
const missingCountries = turkishCountries.filter(c => !existingTurkishNames.has(c));

console.log('Total countries:', turkishCountries.length);
console.log('Existing translated countries:', existingData.length);
console.log('Missing countries to translate:', missingCountries.length);

if (missingCountries.length === 0) {
  console.log('All countries are already translated!');
  process.exit(0);
}

function callGeminiTranslate(countriesBatch) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      contents: [{
        parts: [{
          text: `Translate this list of country names from Turkish (or Windows-1254 style Turkish/English) to standard English country names.
Also, for each country, provide its capital and 4 other major cities.
Return a JSON array of objects. Each object should have:
- turkishName: The exact string from the input list.
- englishName: Standard English country name (e.g. "Germany", "United States", "Saudi Arabia").
- cities: An array of 5 strings (the capital first, followed by 4 other major cities in that country. If the country is very small or has fewer cities, repeat the capital or provide available major towns).

Input list:
${JSON.stringify(countriesBatch, null, 2)}

Provide the output strictly in JSON format matching the schema.`
        }]
      }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              turkishName: { type: 'STRING' },
              englishName: { type: 'STRING' },
              cities: {
                type: 'ARRAY',
                items: { type: 'STRING' }
              }
            },
            required: ['turkishName', 'englishName', 'cities']
          }
        }
      }
    });

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
          if (res.statusCode !== 200) {
            reject(new Error(`Gemini API error ${res.statusCode}: ${parsed.error?.message || data}`));
            return;
          }
          
          const textResponse = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!textResponse) {
            reject(new Error('Empty response from Gemini API'));
            return;
          }
          
          resolve(JSON.parse(textResponse));
        } catch (e) {
          reject(new Error(`Failed to parse Gemini output: ${e.message}. Raw response: ${data.slice(0, 500)}`));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function chunkArray(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

async function run() {
  const batches = chunkArray(missingCountries, 40); // smaller chunks (40) to prevent timeouts
  const results = [];

  for (let i = 0; i < batches.length; i++) {
    console.log(`Processing missing batch ${i + 1}/${batches.length}...`);
    try {
      const batchRes = await callGeminiTranslate(batches[i]);
      results.push(...batchRes);
      console.log(`Successfully translated batch ${i + 1}. Got ${batchRes.length} countries.`);
    } catch (e) {
      console.error(`Error in batch ${i + 1}:`, e.message);
      // Wait and retry once
      console.log('Retrying in 5 seconds...');
      await new Promise(r => setTimeout(r, 5000));
      try {
        const batchRes = await callGeminiTranslate(batches[i]);
        results.push(...batchRes);
        console.log(`Successfully translated batch ${i + 1} on retry.`);
      } catch (e2) {
        console.error('Retry failed:', e2.message);
      }
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  const finalData = [...existingData, ...results];
  console.log(`Saving final list. Total countries: ${finalData.length}`);
  fs.writeFileSync(countriesDataPath, JSON.stringify(finalData, null, 2));
  console.log('Saved successfully.');
}

run();
