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
      <p>Özellikle kış aylarında veya dağlık rotalarda kar, yağmur ve gizli buzlanma riskine karşı zincirleriniz hazır olmalıdır. Seyir esnasında ani frenlerden kaçınmalı ve normal araçlara göre takip mesafesini en az 3 katına çıkarmalısınız.</p>
      
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
      <p>Yapay zeka tabanlı algoritmalar, trafik yoğunluğu, hava durumu ve yol çalışmalarını anlık analiz ederek en kısa ve en az yakıt tüketimi sağlayan rotaları belirlemektedir. Bu durum hem çevreye verilen karbon salınımını düşürmekte hem de lojistik firmalarının giderlerini azaltmaktadır.</p>
      
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
  'Uluslararası karayolu taşımacılığında navlun fiyatlarını etkileyen faktörler',
  'Lojistikte soğuk zincir (frigorifik) taşımacılığı kuralları ve kritik dereceler',
  'Yeşil lojistik nedir? Sürdürülebilir taşımacılık için yapılması gerekenler',
  'Tehlikeli madde taşımacılığı (ADR) eğitimi ve güvenlik kuralları',
  'E-ticaret lojistiği ve son kilometre (last-mile) teslimat süreçleri',
  'Tedarik zinciri yönetiminde 3PL ve 4PL lojistik hizmetlerinin farkları',
  'Parsiyel yük taşıma (LTL) ile komple yük taşıma (FTL) karşılaştırması ve maliyet analizi',
  'Lojistik pazaryerlerinde şoför puanlama ve güvenli taşımacılık sistemleri'
];

// Dynamic cover image generators using public transport vectors
const coverImages = [
  'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800', // Truck highway
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800', // Warehouse container
  'https://images.unsplash.com/photo-1516576885502-d4c30954e73b?auto=format&fit=crop&q=80&w=800'  // Logistics cargo ship
];

// Call Gemini API to write a post
function generateAIPost(topic) {
  return new Promise((resolve, reject) => {
    if (!geminiApiKey) {
      reject(new Error('GEMINI_API_KEY is not defined'));
      return;
    }

    const payload = JSON.stringify({
      contents: [{
        parts: [{
          text: `Write an SEO-optimized logistics blog post in Turkish about the topic: "${topic}".
The post should have:
- title: Captivating blog title.
- slug: URL friendly lowercase slug.
- excerpt: Short, hooky summary (about 2 sentences).
- content: Detailed HTML content (using h2, h3, p, ul, li, strong tags only - at least 4 paragraphs, do NOT include Markdown wrappers, HTML/Body page tags or raw backticks).
- meta_title: SEO meta title (max 60 chars).
- meta_description: SEO meta description (max 155 chars).

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

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
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

async function runBlogGenerator() {
  console.log('Starting Blog Post Generator...');

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

  // 1. Determine Mode & Generate Article
  let article;
  if (geminiApiKey) {
    console.log('AI Writing Mode enabled. Selecting topic...');
    const randomTopic = logisticsTopics[Math.floor(Math.random() * logisticsTopics.length)];
    try {
      console.log(`Generating AI article for topic: "${randomTopic}"`);
      article = await generateAIPost(randomTopic);
    } catch (e) {
      console.error('Failed to generate AI article. Falling back to local library...', e.message);
      article = localArticles[Math.floor(Math.random() * localArticles.length)];
    }
  } else {
    console.log('Library Mode: Selecting article from local library...');
    article = localArticles[Math.floor(Math.random() * localArticles.length)];
  }

  // Double check if slug already exists to prevent duplication
  const { data: existingPost } = await supabase
    .from('blog_posts')
    .select('id')
    .eq('slug', article.slug)
    .maybeSingle();

  if (existingPost) {
    console.log(`Article with slug "${article.slug}" already published. Appending timestamp...`);
    article.slug += `-${Date.now().toString().slice(-4)}`;
  }

  // Pick cover image randomly
  const coverImage = coverImages[Math.floor(Math.random() * coverImages.length)];

  // 2. Insert into Supabase
  console.log(`Publishing article: "${article.title}"`);
  const { data: newPost, error: insertError } = await supabase
    .from('blog_posts')
    .insert({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      cover_image: coverImage,
      author_id: activeAuthorId,
      published: true,
      meta_title: article.meta_title,
      meta_description: article.meta_description
    })
    .select('*')
    .single();

  if (insertError) {
    console.error('Failed to insert blog post:', insertError);
    throw new Error(`DB Insert Error: ${insertError.message}`);
  }

  console.log(`Successfully published blog post ID: ${newPost.id}, Title: "${newPost.title}"`);
  return newPost;
}

// Execute if run directly
if (require.main === module) {
  // If running locally, check if we need to sign in
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
    console.error('Fatal Blog Generator Error:', e);
    process.exit(1);
  });
}

module.exports = { runBlogGenerator };
