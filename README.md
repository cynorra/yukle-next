# YükLe — Next.js

Türkiye'nin nakliye ilan platformu. Server-side rendered (SSR) Next.js 15 uygulaması.

## Kurulum

```bash
npm install
cp .env.example .env.local
# .env.local'i doldur
npm run dev
```

## Komutlar

```bash
npm run dev        # Lokal geliştirme (port 3000)
npm run build      # Production build
npm run start      # Production sunucu
npm run typecheck  # TypeScript kontrolü
npm run lint       # ESLint
```

## Migration Detayları

`MIGRATION.md` dosyasına bakın — Vite'den Next.js'e geçişin tüm detayları, deploy adımları ve SEO aksiyon listesi orada.

## Stack

- Next.js 15 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Supabase (auth + database + realtime)
- Framer Motion
- Lucide icons
