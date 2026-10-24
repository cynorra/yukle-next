# Project Context & Preferences

## User Permissions & Autonomy
- **Full Autonomy**: The user has granted full authority to run commands directly without asking confirmation or interactive prompts ("TÜM KOMUTLARI ÇALIŞTIRABİLİRSİN SORU SORMA").
- Execute needed diagnostic, build, test, and audit commands directly.

## Google AdSense & Monetization Setup
- **Domain**: https://loadlyapp.com
- **Publisher ID**: `pub-4674211063760769` (client: `ca-pub-4674211063760769`)
- **ads.txt**: Located at `public/ads.txt`, served at `https://loadlyapp.com/ads.txt`
  - Record: `google.com, pub-4674211063760769, DIRECT, f08c47fec0942fa0`
- **AdSense Integration**:
  - Script included via `AdSenseScript.tsx` (`pagead2.googlesyndication.com`)
  - Verification tag in head: `<meta name="google-adsense-account" content="ca-pub-4674211063760769"/>`
  - CMP / Funding Choices enabled: `fundingchoices.google.com/i/pub-4674211063760769`
  - CSP allows all necessary Google ad, analytics, and CMP domains.
- **Mandatory Policy Pages**:
  - Privacy: `/en/privacy`
  - Terms: `/en/terms`
  - About: `/en/about`
  - Contact: `/en/contact`

## Site Vision & Publishing Architecture
- **Blog & Editorial Media Focus Only**: The website is purely an editorial logistics/freight publication (no live load board or marketplace search UI on the public indexed surface).
- **No AI-Slop / Aesthetic Rules**:
  - Never use pulsing dots (`animate-ping`), sparkles (`Sparkles` icons), or generic neon badges that scream automated/AI generation.
  - Keep an editorial, authoritative, Financial Times / FreightWaves aesthetic.
  - Every article must feature: **Key Regulatory Takeaways box**, auto-generated **Table of Contents**, verified **Author & Operations Editor Bio** (`Eren Şimşir`), and **The Weekly Freight Dispatch** newsletter box.
- **Article Covers & Imagery**:
  - 100% of published articles use high-resolution, topic-relevant, commercially licensed Pexels photography (no dark text-only PNG cards or generic placeholders).
  - All topic cluster badges on cards and detail pages are clickable and sync with the URL parameter (`?topic=...`).
- **Cadence Logic (blog-generator.js)**:
  - Natural rhythm: 70% publish chance / 30% rest day.
  - If a rest day occurred (>=36h since last post), 100% guaranteed run next day. Manual trigger (`FORCE_RUN=true`) bypasses rest day.
- **Live Deployment (Oracle VM)**:
  - Host: `129.80.191.21` (Ubuntu 24.04, Ampere A1).
  - Key: `oracle/private/ssh-key-2026-09-10.key` (Requires single-user ACL on Windows before SSH).
  - Remote path: `/opt/loadly/app/deploy/deploy.sh` (git pull, npm ci, npm run build, pm2 startOrReload).

