# YükLe — Next.js Migration Rehberi

Bu paket, mevcut Vite + React SPA'nızı Next.js 15 (App Router) ile **sunucu tarafı render edilen (SSR)** bir uygulamaya dönüştürür. Sonuç: Google bot'u artık boş `<div id="root">` değil, **tam HTML içeriği** görür. SEO sorununun temel sebebi buydu.

---

## Hızlı Başlangıç

```bash
# 1) Bağımlılıklar
npm install

# 2) Çevre değişkenleri
cp .env.example .env.local
# .env.local'i kendi Supabase URL/Anon Key'inle doldur

# 3) Lokal geliştirme
npm run dev
# http://localhost:3000

# 4) Production build (deploy öncesi test)
npm run build
npm run start
```

---

## Çevre Değişkenleri

Vite'deki `VITE_*` ön ekleri Next.js'te `NEXT_PUBLIC_*` olarak değişti. `.env.example` dosyasına bakın.

| Eski (Vite) | Yeni (Next.js) |
|---|---|
| `VITE_SUPABASE_URL` | `NEXT_PUBLIC_SUPABASE_URL` |
| `VITE_SUPABASE_ANON_KEY` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `VITE_ADSENSE_CLIENT` | `NEXT_PUBLIC_ADSENSE_CLIENT` |

Yeni eklenen:
- `NEXT_PUBLIC_SITE_URL` — kanonik site adresi (sitemap, OG, vb. için)

---

## Mimari Değişiklikler

### 1. Routing: `react-router-dom` → Next.js App Router

| Eski | Yeni |
|---|---|
| `<Link to="/x">` | `<Link href="/x">` |
| `useNavigate()` | `useRouter()` (`router.push/.replace`) |
| `useLocation()` | `usePathname()` |
| `useParams()` | `useParams()` (artık `next/navigation`'dan) |
| `<Navigate to="/" />` | `useEffect(() => router.replace('/'))` |
| `<Routes>/<Route>` | `app/*/page.tsx` dosya tabanlı |

### 2. SEO: `useSEO` hook → `generateMetadata` / `metadata`

Eski sistem (client-side):
```tsx
useSEO({ title: '...', description: '...' });
```

Bu **çalışmıyordu** çünkü botlar JS çalıştırmadan ilk HTML'i okur. Yeni sistem (server-side):

```tsx
// app/pazar/page.tsx
export const metadata: Metadata = {
  title: 'Nakliye Pazaryeri',
  description: '...',
  alternates: { canonical: '/pazar' },
};
```

Dinamik sayfalarda (ilan, blog):
```tsx
export async function generateMetadata({ params }) {
  const load = await getLoad(params.id);
  return { title: load.title, description: '...' };
}
```

### 3. Supabase: Üç farklı client

| Dosya | Ne zaman kullan |
|---|---|
| `lib/supabase/client.ts` | Client component'lerde (browser) |
| `lib/supabase/server.ts` | Server Component / Server Action (cookie ile auth) |
| `lib/supabase/public.ts` | Public okuma, SSG/ISR için (cookie YOK) |
| `lib/supabase/middleware.ts` | Middleware, cookie senkronize eder |

Eski `import { supabase } from '@/lib/supabase'` çağrıları **otomatik olarak browser client'a** yönlendirilir; mevcut kod kırılmaz.

### 4. Sayfa yapısı: Server + Client ayrımı

Her SEO kritik route için iki dosya:
- **`page.tsx`** — Server Component, metadata burada, ilk veriyi server'da çeker
- **`*Client.tsx`** — Client Component, interaktif (state, hook, vb.)

Örneğin `/pazar`:
- `app/pazar/page.tsx` — başlık ve ilk 50 ilanı server'da render eder
- `app/pazar/MarketClient.tsx` — filtre, search, pagination

### 5. SEO için yeni dosyalar

| Dosya | Ne yapar |
|---|---|
| `app/sitemap.ts` | Dinamik sitemap.xml; tüm ilanları ve blog yazılarını içerir |
| `app/robots.ts` | Dinamik robots.txt; auth-gated sayfaları disallow eder |
| Her `page.tsx`'te `metadata` | Server tarafından üretilen title/description/og/canonical |

---

## Önemli SEO İyileştirmeleri

1. **HTML response artık dolu.** `view-source:loadlyapp.com` artık boş div değil, tam içerik gösterir.
2. **Her sayfanın kendi metası var.** /pazar, /pazar/123, /blog/slug — hepsi unique.
3. **JSON-LD structured data.** WebSite, Organization, FAQPage, BreadcrumbList, ItemList, BlogPosting, Service şemaları eklendi.
4. **Sitemap dinamik.** Yeni ilan eklendiğinde 1 saat içinde sitemap'e düşer.
5. **Robots.txt** — Dashboard, mesajlar, favoriler gibi private sayfalar indekslenmiyor.
6. **Performans.** İlk paint server'dan geliyor, kullanıcı çok daha hızlı içerik görüyor.
7. **OpenGraph + Twitter Card** — Sosyal medya paylaşımları artık önizleme ile gelir.

---

## Deploy: Vercel (Önerilen)

Vercel Next.js'i yapan firmanın platformu; sıfır config çalışır.

```bash
# 1) GitHub'a push et
git init
git add .
git commit -m "Next.js migration"
git remote add origin https://github.com/SENIN/yukle-next.git
git push -u origin main

# 2) vercel.com'a git, "Import Project" -> repo'yu seç
# 3) Environment variables'ı ekle (NEXT_PUBLIC_*)
# 4) Deploy

# Sonra Domain ayarlarından loadlyapp.com'u bağla.
```

### Alternatif: Self-hosted (mevcut sunucunda)

```bash
npm run build
npm run start  # port 3000
# nginx reverse proxy ile bağla
```

`Node 18.18+` gerekli.

---

## Migration Sonrası SEO Aksiyonları (KRİTİK)

Yeni site live olunca **hemen** şunları yap:

### 1. Google Search Console
- Property doğrulaması yenile (varsa)
- Sitemap gönder: `https://loadlyapp.com/sitemap.xml`
- URL Inspection ile anasayfayı **"Request Indexing"** yap
- Coverage raporunu kontrol et (bir kaç gün sonra)

### 2. View-source testi
Tarayıcıda `view-source:https://loadlyapp.com/` aç. Görmen gerekenler:
- `<h1>Yük Bul, Teklif Al, Taşımaya Başla</h1>`
- Bütün buton metinleri
- Üç adet `<script type="application/ld+json">`

Görmüyorsan: deploy başarısız veya cache var.

### 3. Bing Webmaster Tools
Bing'e de eklemek SEO'ya ekstra trafik kazandırır. URL'leri Bing'in IndexNow'una göndermek için Bing Webmaster Tools üzerinden API key alıp `public/<key>.txt` olarak ekleyebilirsin.

### 4. Lighthouse / PageSpeed Insights
`https://pagespeed.web.dev/analysis?url=https://loadlyapp.com`

Beklenenler:
- Performance: 85+
- SEO: 95+ (eskiden muhtemelen 60'lardaydı)
- Accessibility: 85+

### 5. Marka adı kararı (Önemli!)
Domain `loadlyapp.com`, marka "YükLe". Bunlar uyumsuz, Google'da "loadly" sorgusu rakip markalara gidiyor. İki seçenek:

a) **`yukle.com.tr` veya `yuklenakliye.com` al** → 301 yönlendir → marka uyumlu olur  
b) **Markayı "Loadly" olarak konumla** → tüm metinlerde "Loadly" öne çık (zaten kodda alternateName olarak var)

---

## Hâlâ Yapılacaklar

Bu paket size %95 hazır bir Next.js uygulaması veriyor. Geri kalanı:

1. **Lokal test.** `npm run dev` ile her sayfayı dolaş. Beklenmeyen runtime hatası varsa bana ekran görüntüsüyle gönder, düzeltelim.
2. **Auth callback URL.** Supabase Dashboard → Auth → URL Configuration'a `https://loadlyapp.com/auth/callback` ekle.
3. **AdSense.** Eğer onay aldıysan `NEXT_PUBLIC_ADSENSE_CLIENT` env değişkenini ayarla.
4. **Şehir bazlı landing sayfaları (BÜYÜK SEO FIRSATI).** "İstanbul - Ankara yük taşıma", "Konya nakliye ilanları" gibi sayfalar oluşturulabilir. `app/yuk-tasima/[origin]/[destination]/page.tsx` yapısıyla otomatik olarak yüzlerce SEO sayfası üretilebilir.
5. **Blog içeriği ekle.** En az 10-15 yazı olmadan blog kategorisinde sıralama almak zor.
6. **Backlink çalışması.** Lojistik forumlarına, taşımacılık derneklerinin sitelerine, sektörel bloglarına içerik/link.

---

## Sorun Giderme

**Build hatası: "Cannot find module ..."**
→ `npm install` çalıştır

**Login sonrası sürekli login sayfasına atıyor**
→ Supabase Auth → URL Configuration'da Site URL = `https://loadlyapp.com`, Redirect URLs'e `https://loadlyapp.com/**` ekli olmalı

**Sitemap.xml boş geliyor**
→ Supabase RLS policy: `loads` ve `blog_posts` tablolarında anonim okuma izni gerekli (zaten public_profiles gibi)

**Hydration mismatch hatası**
→ `useTheme` localStorage okuyor; root layout'taki inline script bunu yapıyor. Sorun çıkarsa o script'i kontrol et.

---

## Kod Yapısı

```
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout: meta, JSON-LD, providers
│   ├── page.tsx             # Anasayfa (Server Component)
│   ├── providers.tsx        # Theme/Auth/Toast wrapper
│   ├── sitemap.ts           # Dinamik sitemap.xml
│   ├── robots.ts            # Dinamik robots.txt
│   ├── not-found.tsx        # 404
│   ├── globals.css
│   ├── pazar/
│   │   ├── page.tsx         # Server: meta + ilk veri
│   │   ├── MarketClient.tsx # Client: filter, search, list
│   │   └── [id]/
│   │       ├── page.tsx     # Server: ilan meta + JSON-LD
│   │       └── LoadDetailClient.tsx
│   ├── blog/
│   ├── pazar/, kayit/, giris/, panel/, ...
│   └── auth/callback/route.ts  # Supabase OAuth callback
├── components/              # Paylaşılan UI
├── contexts/                # AuthContext, ThemeContext
├── hooks/                   # useT, useSEO (legacy), usePoints
├── lib/
│   ├── supabase/
│   │   ├── client.ts        # Browser
│   │   ├── server.ts        # Server Component (cookie auth)
│   │   ├── public.ts        # Public okuma (cookie YOK, SSG)
│   │   └── middleware.ts
│   ├── supabase.ts          # Eski import path uyumluluğu
│   └── utils.ts
├── types/database.ts
├── utils/loadTags.ts
└── middleware.ts            # Cookie sync
```
