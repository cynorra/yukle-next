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
const geminiApiKey = process.env.GEMINI_API_KEY;
const defaultAuthorId = process.env.SCRAPER_SHIPPER_ID || '3c9d15c1-ce40-42c4-b5bc-f2de51a747d5';

if (!supabaseUrl || (!anonKey && !serviceKey)) {
  console.error('Supabase URL or Key is missing from .env.local!');
  process.exit(1);
}

const activeKey = serviceKey || anonKey;
const supabase = createClient(supabaseUrl, activeKey);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runWithConcurrency(tasks, concurrency) {
  const results = [];
  const executing = new Set();
  for (const task of tasks) {
    const p = Promise.resolve().then(() => task());
    results.push(p);
    executing.add(p);
    const clean = () => executing.delete(p);
    p.then(clean, clean);
    if (executing.size >= concurrency) {
      await Promise.race(executing);
    }
  }
  return Promise.all(results);
}

// Library of built-in high-quality Turkish/English logistics articles (Fallback Mode)
const localArticles = [
  {
    title: 'Tır Şoförleri İçin Güvenli Sürüş ve Yol İpuçları',
    slug: 'tir-soforleri-icin-guvenli-surus-ve-yol-ipuclari',
    excerpt: 'Uluslararası ve şehirlerarası taşımacılık yapan tır şoförleri için hayati önem taşıyan sürüş güvenliği, uykusuzlukla mücadele ve araç kontrol önlemleri rehberi.',
    content: `
      <h2>1. Yola Çıkmadan Önce Araç Kontrolü (Checklist)</h2>
      <p>Güvenli bir nakliye seferinin ilk kuralı, tekerlekler dönmeden önce başlar. Lastik basınçları, fren balataları, treyler bağlantıları ve far sistemleri her sefer öncesinde kontrol edilmelidir. Küçük bir teknik arıza, otobanda telafisi zor kazalara yol açabilir.</p>
      
      <h2>2. Uykusuzluk ve Yorgunlukla Mücadele</h2>
      <p>Lojistik sektöründe kazaların en büyük nedenlerinden biri yorgun araç kullanımıdır. Yasal sürüş ve dinlenme sürelerine (takograf sınırlarına) harfiyen uyulmalıdır. Uykunuz geldiğinde kafeine güvenmek yerine, aracı güvenli bir cebe çekip en az 20-30 dakika kestirmek hayat kurtarır.</p>
      
      <h2>3. Hava Durumu ve Rota Takibi</h2>
      <p>Özellikle kış aylarında veya dağlık rotalarda kar, yağmur and gizli buzlanma riskine karşı zincirleriniz hazır olmalıdır. Seyir esnasında ani frenlerden kaçınmalı ve normal araçlara göre takip mesafesini en az 3 katına çıkarmalısınız.</p>
      
      <h2>4. Yük Güvenliği</h2>
      <p>Taşıdığınız yükün dorse içinde dengeli dağıldığından ve sabitleme kayışlarının (spanset) sıkıca bağlandığından emin olun. Virajlarda yükün savrulması tırın devrilmesine neden olabilir.</p>
    `,
    meta_title: 'Tır Şoförleri İçin Güvenli Sürüş İpuçları | Loadly',
    meta_description: 'Uluslararası ve uzun yol tır şoförleri için güvenli yol sürüş rehberi, dinlenme süreleri ve yola hazırlık ipuçları.'
  },
  {
    title: 'Global Lojistikte Dijitalleşme ve Yapay Zekanın Rolü',
    slug: 'global-lojistikte-dijitallesme-ve-yapay-zekanin-rolu',
    excerpt: 'Yapay zeka, nesnelerin interneti (IoT) ve akıllı rota optimizasyon teknolojilerinin nakliye borsaları ve lojistik pazaryerlerindeki devrimi.',
    content: `
      <h2>1. Rota Optimizasyonu ve Yakıt Tasarrufu</h2>
      <p>Yapay zeka tabanlı algoritmalar, trafik yoğunluğu, hava durumu ve yol çalışmalarını anlık analiz ederek en kısa ve en az yakıt tüketimi sağlayan rotaları belirlemektedir. This situation reduces carbon emissions and logistics costs.</p>
      
      <h2>2. Dijital Yük Borsaları (Load Boards)</h2>
      <p>Akıllı yük borsaları (örneğin Loadly), tır şoförleri ile yük sahiplerini anlık olarak eşleştirir. Şoförlerin "boş dönüş" yapmasını engelleyerek sefer verimliliğini %40 oranında artırır.</p>
      
      <h2>3. Nesnelerin İnterneti (IoT) ile Takip</h2>
      <p>Dorselere yerleştirilen akıllı sensörler sayesinde yükün sadece konumu değil; sıcaklığı, nem oranı ve darbe alıp almadığı da anlık olarak takip edilebilmektedir. Özellikle gıda ve ilaç taşımacılığında bu teknoloji kritik bir öneme sahiptir.</p>
    `,
    meta_title: 'Lojistikte Dijitalleşme ve Yapay Zeka Devrimi | Loadly',
    meta_description: 'Yapay zeka ve dijitalleşmenin tedarik zinciri ve lojistik sektöründeki etkileri, akıllı nakliye borsaları.'
  },
  {
    title: 'Uluslararası Karayolu Taşımacılığında Gümrük ve Geçiş Belgeleri Rehberi',
    slug: 'uluslararasi-karayolu-tasimaciliginda-gumruk-ve-gecis-belgeleri-rehberi',
    excerpt: 'Sınır kapılarından sorunsuz ve hızlı geçiş yapabilmek için gerekli olan TIR Karnesi, CMR Belgesi ve dozvola gibi gümrük belgeleri açıklaması.',
    content: `
      <h2>1. CMR Belgesi (Karayolu Taşıma Belgesi) nedir?</h2>
      <p>CMR, uluslararası karayolu taşımacılığında gönderici, taşıyıcı ve alıcı arasındaki hakları ve sorumlulukları belirleyen uluslararası bir anlaşmadır. Yükün teslim alındığını ve taşınma şartlarını gösteren en önemli resmi belgedir.</p>
      
      <h2>2. TIR Karnesi (TIR Carnet) Avantajları</h2>
      <p>TIR Karnesi, üye ülkeler arasındaki gümrük geçişlerinde mühürlü taşıtların gümrük kontrollerini asgariye indirir. Ara kapılarda gümrük vergisi ödenmeden veya detaylı arama yapılmadan hızlıca geçiş yapmayı sağlar.</p>
      
      <h2>3. Dozvola (Geçiş Belgesi) Nedir?</h2>
      <p>Yabancı plakalı araçların başka bir ülkenin topraklarını kullanarak transit geçiş yapabilmesi veya yük boşaltıp yükleyebilmesi için o ülkeden alınan resmi izin belgesidir. Sınırlı sayıda dağıtıldığı için nakliyeciler tarafından sıkı takip edilmelidir.</p>
    `,
    meta_title: 'Uluslararası Nakliyat Gümrük ve CMR Belgeleri | Loadly',
    meta_description: 'CMR Belgesi, TIR Karnesi ve transit geçiş izinleri (dozvola) hakkında uluslararası nakliyeciler için rehber.'
  }
];

// Topics for Gemini AI mode
const logisticsTopics = [
  'Factors affecting freight rates in international road transport',
  'Cold chain (reefer) logistics rules and critical temperatures in transport',
  'What is green logistics? Actionable sustainable transport practices',
  'Hazardous materials transport (ADR) training and safety rules',
  'E-commerce logistics and last-mile delivery processes',
  'Differences between 3PL and 4PL logistics in supply chain management',
  'Comparison and cost analysis of LTL vs FTL shipping in logistics',
  'Driver rating systems and safe shipping in logistics marketplaces',
  'How to find high-paying truck loads using online freight marketplaces',
  'Best practices for shippers to negotiate lower shipping and transportation rates',
  'How to minimize empty return runs (backhauls) in road transport logistics',
  'The impact of driver shortages on global freight rates and transport networks',
  'How owner-operators can optimize fuel efficiency and cut trip costs',
  'Why real-time load tracking and freight updates are critical for modern shippers',
  'Understanding cabotage rules in European road transport',
  'How cargo insurance protects shippers and carriers from unexpected losses',
  'How wholesale food distributors optimize shipping routes and reduce spoilage',
  'Key logistics KPI metrics that industrial manufacturers must track',
  'How retail brands can coordinate FTL shipping to minimize warehouse congestion',
  'A guide to customs clearance and documentation for EU-UK freight transport',
  'How small businesses can utilize freight marketplaces for LTL shipping',
  'Understanding Incoterms 2020: Who pays for freight and cargo risk',
  'How automotive parts suppliers manage JIT (Just-In-Time) logistics delivery',
  'Best practices for shipping fragile and high-value electronics',
  'How chemical manufacturers ensure compliance when booking hazardous freight',
  'How e-commerce logistics centers handle seasonal holiday shipping peaks',
  'The role of cross-docking in modern retail distribution and shipping',
  'How freight forwarders optimize consolidation to lower container costs',
  'Understanding multi-modal shipping: Combining road, rail, and sea transport',
  'Top packaging guidelines for securing pallets in long-haul truck shipping'
];

const blogLanguagesMapping = {
  'English': 'en', 'Turkish': 'tr', 'German': 'de', 'French': 'fr',
  'Spanish': 'es', 'Portuguese': 'pt', 'Italian': 'it', 'Dutch': 'nl',
  'Polish': 'pl', 'Russian': 'ru', 'Ukrainian': 'uk', 'Chinese': 'zh',
  'Japanese': 'ja', 'Hindi': 'hi', 'Arabic': 'ar', 'Persian': 'fa',
  'Korean': 'ko', 'Vietnamese': 'vi', 'Indonesian': 'id', 'Bengali': 'bn',
  'Urdu': 'ur', 'Thai': 'th', 'Malay': 'ms', 'Tagalog': 'tl',
  'Romanian': 'ro', 'Swedish': 'sv', 'Czech': 'cs', 'Hungarian': 'hu',
  'Greek': 'el', 'Azerbaijani': 'az', 'Kazakh': 'kk', 'Hebrew': 'he',
  'Bulgarian': 'bg', 'Croatian': 'hr', 'Serbian': 'sr', 'Slovak': 'sk',
  'Danish': 'da', 'Finnish': 'fi', 'Norwegian': 'no', 'Uzbek': 'uz',
  'Tamil': 'ta', 'Marathi': 'mr', 'Georgian': 'ka', 'Lithuanian': 'lt',
  'Latvian': 'lv', 'Estonian': 'et', 'Slovenian': 'sl'
};

// 25 curated high-quality Unsplash image URLs related to logistics
const coverImages = [
  'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800', // Truck highway
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800', // Warehouse container
  'https://images.unsplash.com/photo-1516576885502-d4c30954e73b?auto=format&fit=crop&q=80&w=800', // Logistics cargo ship
  'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=800', // Cargo shipping containers
  'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&q=80&w=800', // Ship logistics
  'https://images.unsplash.com/photo-1519003722824-192514ad9360?auto=format&fit=crop&q=80&w=800', // Truck rear
  'https://images.unsplash.com/photo-1606185540834-d6e40b208b45?auto=format&fit=crop&q=80&w=800', // Logistics center
  'https://images.unsplash.com/photo-1620052581237-5d36667be337?auto=format&fit=crop&q=80&w=800', // Cargo truck front
  'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&q=80&w=800', // Delivery truck city
  'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&q=80&w=800', // Freight loading
  'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=800', // Shipping containers yard
  'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&q=80&w=800', // Truck driving sunset
  'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&q=80&w=800', // Forklift warehouse
  'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&q=80&w=800', // Cargo airplane loading
  'https://images.unsplash.com/photo-1594514336792-b2d28565a044?auto=format&fit=crop&q=80&w=800', // Truck cab interior/road
  'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=800', // Courier delivery
  'https://images.unsplash.com/photo-1549194388-f61be84a6e9e?auto=format&fit=crop&q=80&w=800', // Sea freight port
  'https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&q=80&w=800', // Cargo containers dock
  'https://images.unsplash.com/photo-1585713181935-d5f622cc2415?auto=format&fit=crop&q=80&w=800', // Cargo container ship ocean
  'https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&q=80&w=800', // Global shipping map/computer
  'https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?auto=format&fit=crop&q=80&w=800', // Customs checking cargo
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800', // Freight forwarding business
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800', // Supply chain planning
  'https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?auto=format&fit=crop&q=80&w=800', // Autonomous truck
  'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=800'  // Online shopping delivery box
];

// Helper to check if cover image URL returns HTTP 200
function checkImageUrl(url) {
  return new Promise((resolve) => {
    try {
      const parsedUrl = new URL(url);
      const req = https.request({
        method: 'HEAD',
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname + parsedUrl.search,
        timeout: 5000
      }, (res) => {
        resolve(res.statusCode >= 200 && res.statusCode < 400);
      });
      req.on('error', () => resolve(false));
      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });
      req.end();
    } catch {
      resolve(false);
    }
  });
}

// Select a validated cover image, attempting up to 5 times
async function getValidatedCoverImage() {
  const shuffled = [...coverImages].sort(() => 0.5 - Math.random());
  for (let i = 0; i < Math.min(5, shuffled.length); i++) {
    const imgUrl = shuffled[i];
    console.log(`Checking cover image URL: ${imgUrl}`);
    const isValid = await checkImageUrl(imgUrl);
    if (isValid) {
      console.log(`Cover image validated successfully: ${imgUrl}`);
      return imgUrl;
    }
    console.warn(`Cover image validation failed for: ${imgUrl}`);
  }
  console.log(`Could not validate any random image. Falling back to default: ${coverImages[0]}`);
  return coverImages[0];
}

// Free Google Translate API integration
function translateText(text, targetLang) {
  return new Promise((resolve, reject) => {
    if (!text || text.trim() === '') {
      resolve('');
      return;
    }
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed && parsed[0]) {
            const translatedText = parsed[0].map(item => item[0]).join('');
            resolve(translatedText);
          } else {
            reject(new Error('Invalid response structure from Google Translate'));
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// Translate HTML preserving tag structure using {index} placeholders
async function translateHtml(html, targetLang) {
  if (!html || html.trim() === '') return '';
  
  const tags = [];
  // Replace HTML tags with {index} placeholders
  const placeholderText = html.replace(/<[^>]+>/g, (match) => {
    tags.push(match);
    return ` {${tags.length - 1}} `;
  });

  const translatedText = await translateText(placeholderText, targetLang);
  
  let restoredHtml = translatedText;
  for (let i = 0; i < tags.length; i++) {
    // Replace {i} or { i } with the original HTML tag
    const regex = new RegExp(`\\{\\s*${i}\\s*\\}`, 'g');
    restoredHtml = restoredHtml.replace(regex, tags[i]);
  }
  return restoredHtml;
}

// Translate all fields of a blog post into a target language
async function translatePostUsingGoogle(basePost, targetLangCode) {
  const title = await translateText(basePost.title, targetLangCode);
  const excerpt = await translateText(basePost.excerpt, targetLangCode);
  const content = await translateHtml(basePost.content, targetLangCode);
  const meta_title = await translateText(basePost.meta_title, targetLangCode);
  const meta_description = await translateText(basePost.meta_description, targetLangCode);

  return {
    title: title.trim(),
    excerpt: excerpt.trim(),
    content: content.trim(),
    meta_title: meta_title.trim(),
    meta_description: meta_description.trim()
  };
}

// Base HTTP request to Gemini API (only used for creating the base post)
function makeGeminiRequest(payload) {
  return new Promise((resolve, reject) => {
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
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode !== 200) {
            reject({
              statusCode: res.statusCode,
              message: parsed.error?.message || data,
              raw: data
            });
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

// Resilient wrapper with 429 backoff retry logic for Gemini base post generation
async function callGeminiWithRetry(payload, maxRetries = 3) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await makeGeminiRequest(payload);
    } catch (err) {
      attempt++;
      const isRateLimit = err.statusCode === 429 || (err.message && err.message.includes('429')) || (err.message && err.message.includes('quota'));
      if (isRateLimit && attempt < maxRetries) {
        console.warn(`[429 Quota Exceeded] Gemini API rate limit hit when generating base post. Waiting 45 seconds before retry ${attempt}/${maxRetries}...`);
        await sleep(45000);
      } else {
        if (attempt >= maxRetries) {
          throw new Error(err.message || JSON.stringify(err));
        }
        console.warn(`[API Error] Status: ${err.statusCode || 'unknown'}, Message: ${err.message || JSON.stringify(err)}. Waiting 5 seconds before retry ${attempt}/${maxRetries}...`);
        await sleep(5000);
      }
    }
  }
}

// Call Gemini API to write the base post in English
function generateBasePost(topic) {
  if (!geminiApiKey) {
    return Promise.reject(new Error('GEMINI_API_KEY is not defined'));
  }

  const payload = JSON.stringify({
    contents: [{
      parts: [{
        text: `Write an SEO-optimized logistics blog post in English about the topic: "${topic}".
The post should have:
- title: Captivating blog title in English.
- slug: URL friendly lowercase slug in English (alphanumeric and dashes only, e.g. "safe-truck-driving-tips").
- excerpt: Short, hooky summary in English (about 2 sentences).
- content: Detailed HTML content in English (using h2, h3, p, ul, li, strong tags only - at least 4 paragraphs, do NOT include Markdown wrappers, HTML/Body page tags or raw backticks).
- meta_title: SEO meta title in English (max 60 chars).
- meta_description: SEO meta description in English (max 155 chars).

Provide the output strictly in JSON format matching the schema properties.`
      }]
    }],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          title: { type: 'STRING' },
          slug: { type: 'STRING' },
          excerpt: { type: 'STRING' },
          content: { type: 'STRING' },
          meta_title: { type: 'STRING' },
          meta_description: { type: 'STRING' }
        },
        required: ['title', 'slug', 'excerpt', 'content', 'meta_title', 'meta_description']
      }
    }
  });

  return callGeminiWithRetry(payload);
}

async function runBlogGenerator() {
  console.log('Starting Multilingual Blog Post Generator...');

  // Verify author profile exists
  console.log(`Verifying author profile ID: ${defaultAuthorId}`);
  const { data: profile, error: pError } = await supabase
    .from('public_profiles')
    .select('id')
    .eq('id', defaultAuthorId)
    .maybeSingle();

  let activeAuthorId = defaultAuthorId;
  if (pError || !profile) {
    const { data: fallbackProfile } = await supabase
      .from('public_profiles')
      .select('id')
      .eq('role', 'shipper')
      .limit(1)
      .maybeSingle();

    if (fallbackProfile) {
      activeAuthorId = fallbackProfile.id;
    } else {
      console.error('CRITICAL: No profiles exist in database to assign as author!');
      process.exit(1);
    }
  }

  // 1. Generate/Select Base Article
  let basePost;
  let baseLanguage = 'en'; // default base language for AI generation is English

  if (geminiApiKey) {
    const randomTopic = logisticsTopics[Math.floor(Math.random() * logisticsTopics.length)];
    try {
      console.log(`Generating base English article for topic: "${randomTopic}"`);
      basePost = await generateBasePost(randomTopic);
      baseLanguage = 'en';
    } catch (e) {
      console.error('Failed to generate AI base article. Falling back to local library...', e.message);
      const local = localArticles[Math.floor(Math.random() * localArticles.length)];
      basePost = {
        title: local.title,
        slug: local.slug,
        excerpt: local.excerpt,
        content: local.content,
        meta_title: local.meta_title,
        meta_description: local.meta_description
      };
      baseLanguage = 'tr';
    }
  } else {
    console.log('Library Mode: Selecting article from local library...');
    const local = localArticles[Math.floor(Math.random() * localArticles.length)];
    basePost = {
      title: local.title,
      slug: local.slug,
      excerpt: local.excerpt,
      content: local.content,
      meta_title: local.meta_title,
      meta_description: local.meta_description
    };
    baseLanguage = 'tr';
  }

  // Sanitize base slug
  let baseSlug = basePost.slug.toLowerCase().trim()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  // Verify slug uniqueness in database by checking if baseSlug-en or baseSlug-tr exists
  const checkSlug = `${baseSlug}-${baseLanguage}`;
  const { data: existingPost } = await supabase
    .from('blog_posts')
    .select('id')
    .eq('slug', checkSlug)
    .maybeSingle();

  if (existingPost) {
    const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
    baseSlug = `${baseSlug}-${uniqueSuffix}`;
    console.log(`Base slug "${checkSlug}" already exists. Generated unique base slug core: "${baseSlug}"`);
  }

  // 2. Translate Article into target languages (46 other languages) using Google Translate GTX
  const targetLanguages = Object.entries(blogLanguagesMapping).filter(([name, code]) => code !== baseLanguage);
  
  const translatedPosts = [];

  console.log(`Translating base post from ${baseLanguage} into remaining ${targetLanguages.length} languages using concurrency...`);
  
  const tasks = targetLanguages.map(([langName, langCode]) => async () => {
    try {
      console.log(`Translating to ${langName} (${langCode})...`);
      const translation = await translatePostUsingGoogle(basePost, langCode);
      translatedPosts.push({
        ...translation,
        langCode
      });
      console.log(`✓ Translated successfully to ${langName} (${langCode})`);
    } catch (err) {
      console.error(`❌ Translation failed for ${langName} (${langCode}). Falling back to base content. Error:`, err.message);
      translatedPosts.push({
        title: basePost.title,
        excerpt: basePost.excerpt,
        content: basePost.content,
        meta_title: basePost.meta_title,
        meta_description: basePost.meta_description,
        langCode
      });
    }
  });

  // Run with a concurrency of 5 parallel requests
  await runWithConcurrency(tasks, 5);

  // 3. Pick and validate cover image
  const coverImage = await getValidatedCoverImage();

  // 4. Build bulk insert list
  const postsToInsert = [];

  // Insert the base post
  postsToInsert.push({
    title: basePost.title,
    slug: `${baseSlug}-${baseLanguage}`,
    excerpt: basePost.excerpt,
    content: basePost.content,
    cover_image: coverImage,
    author_id: activeAuthorId,
    published: true,
    language: baseLanguage,
    meta_title: basePost.meta_title,
    meta_description: basePost.meta_description
  });

  // Insert the translations
  for (const trans of translatedPosts) {
    postsToInsert.push({
      title: trans.title,
      slug: `${baseSlug}-${trans.langCode}`,
      excerpt: trans.excerpt,
      content: trans.content,
      cover_image: coverImage,
      author_id: activeAuthorId,
      published: true,
      language: trans.langCode,
      meta_title: trans.meta_title,
      meta_description: trans.meta_description
    });
  }

  // 5. Bulk Insert in a single transaction
  console.log(`Publishing ${postsToInsert.length} posts to the database...`);
  const { data: insertedPosts, error: insertError } = await supabase
    .from('blog_posts')
    .insert(postsToInsert)
    .select('*');

  if (insertError) {
    console.error('Failed to insert multilingual blog posts:', insertError);
    throw new Error(`DB Bulk Insert Error: ${insertError.message}`);
  }

  console.log(`Successfully published all ${insertedPosts.length} blog post translations! Base Slug Core: "${baseSlug}"`);
  return insertedPosts;
}

// Execute if run directly
if (require.main === module) {
  (async () => {
    // If not using service role key, attempt login with environment credentials
    if (!serviceKey && process.env.SCRAPER_USER_EMAIL && process.env.SCRAPER_USER_PASSWORD) {
      console.log('Logging in to Supabase for blog generation...');
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: process.env.SCRAPER_USER_EMAIL,
        password: process.env.SCRAPER_USER_PASSWORD
      });
      if (authError) {
        console.error('Login failed:', authError.message);
      }
    }
    
    await runBlogGenerator();
    process.exit(0);
  })().catch(e => {
    console.error('Fatal Multilingual Blog Generator Error:', e);
    process.exit(1);
  });
}

module.exports = { runBlogGenerator };
