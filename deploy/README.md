# Oracle Always Free deployment

Self-hosting setup for `loadlyapp.com` on an Oracle Cloud Always Free Ampere A1
VM (Ubuntu 24.04, arm64), replacing Vercel. See the migration plan for full
context on *why* (cost/fair-use risk on Vercel Hobby).

## Architecture

- **Node**: `next build` with `output: 'standalone'` (set in `next.config.mjs`), run via `.next/standalone/server.js`.
- **Process manager**: PM2, single fork instance (`deploy/ecosystem.config.js`) — do not switch to cluster mode, see the comment in that file.
- **Reverse proxy / TLS**: Caddy (`deploy/Caddyfile`), automatic Let's Encrypt certs.
- **Build**: done directly on the VM (it's ARM — building on an x64 CI runner and copying artifacts over risks a `sharp` native-binary architecture mismatch).

## One-time setup

1. Provision the VM in the Oracle Cloud console: Ampere A1, Ubuntu 24.04, 2 OCPU / 12GB RAM, a public IP, SSH key auth. (Free-tier capacity errors are common — retry or try a different availability domain.)
2. SSH in and run: `bash deploy/setup.sh` after cloning the repo, or `curl`/copy this script over first if the repo isn't cloned yet. It installs Node 20, Caddy, PM2, configures `ufw` (22/80/443 only), and clones the repo to `/opt/loadly/app`.
3. Create `/opt/loadly/app/.env.production.local` with the server-required vars below (edit directly on the VM over SSH — never paste secrets into chat).
4. Run `bash deploy/deploy.sh` — builds and starts the app under PM2 on `127.0.0.1:3000`.
5. Verify locally on the VM before touching Caddy/DNS at all:
   ```
   curl -H "Host: loadlyapp.com" http://localhost:3000/en
   pm2 logs loadly
   ```

## Server-required env vars (`/opt/loadly/app/.env.production.local`)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=https://loadlyapp.com
NEXT_PUBLIC_ADSENSE_CLIENT=
NEXT_PUBLIC_ADSENSE_SLOT_BLOG_BOTTOM=
NEXT_PUBLIC_ADSENSE_SLOT_BLOG_TOP=
NEXT_PUBLIC_ADSENSE_SLOT_LISTING=
NEXT_PUBLIC_ADSENSE_SLOT_MARKETPLACE=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
FIREBASE_SERVICE_ACCOUNT=
SCRAPER_WEBHOOK_SECRET=
REVALIDATE_SECRET=
CRON_TRIGGER_SECRET=
SCRAPER_DISPATCH_PAT=
GOOGLE_CLIENT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_VERIFICATION_CODE=
BING_VERIFICATION_CODE=
YANDEX_VERIFICATION_CODE=
NAVER_VERIFICATION_CODE=
BAIDU_VERIFICATION_CODE=
BAIDU_PUSH_TOKEN=
```

Copy the actual values from the current Vercel project's environment variables
dashboard. `NEXT_PUBLIC_*` vars are inlined at build time — this file must
exist and be correct *before* running `deploy/deploy.sh`, not just at runtime.

**Not needed on the VM** (GitHub Actions secrets only — scrapers/blog-generator
run entirely in CI): `GEMINI_API_KEY`, `PEXELS_API_KEY`, `CF_WORKERS_AI_TOKEN`,
`CF_WORKERS_AI_ACCOUNT_ID`, `GROQ_API_KEY`, `SCRAPER_SHIPPER_ID`,
`SCRAPER_USER_EMAIL`, `SCRAPER_USER_PASSWORD`, `ARTICLES_PER_RUN`.

## Test-subdomain dry run (before touching real DNS)

1. In Hostinger DNS, add a temporary A record: `oracle-test.loadlyapp.com` → the VM's public IP.
2. Install a temporary Caddy config (do NOT use `deploy/Caddyfile` yet):
   ```
   sudo tee /etc/caddy/Caddyfile <<'EOF'
   oracle-test.loadlyapp.com {
       reverse_proxy 127.0.0.1:3000
   }
   EOF
   sudo systemctl reload caddy
   ```
3. Browse `https://oracle-test.loadlyapp.com` — verify home page, a marketplace listing, a blog post, language switching, and image loading (confirms Caddy TLS + Next standalone + in-process `sharp` image optimization all work).
4. Test the three live-dependency endpoints with their real secrets against this subdomain:
   - `GET https://oracle-test.loadlyapp.com/api/cron/trigger-scraper` (needs `CRON_TRIGGER_SECRET`)
   - `POST https://oracle-test.loadlyapp.com/api/revalidate` (needs `REVALIDATE_SECRET`)
   - `POST https://oracle-test.loadlyapp.com/api/webhooks/fcm-batch` (needs `SCRAPER_WEBHOOK_SECRET`) — note the real scraper scripts hardcode the apex domain, so this only validates the route logic itself, not the final URL.
5. Remove the temporary A record once satisfied.

## DNS cutover

1. In Hostinger DNS, point `loadlyapp.com` (apex, A record) and `www.loadlyapp.com` (A or CNAME) at the VM's public IP.
2. Install the real config: `sudo ln -sf /opt/loadly/app/deploy/Caddyfile /etc/caddy/Caddyfile && sudo systemctl reload caddy`.
3. Wait for propagation, then run the checklist below.

### Post-cutover checklist

- `curl -I https://loadlyapp.com` → 200, `Server` header is Caddy (not Vercel).
- `curl -I https://www.loadlyapp.com` → 308 redirect to `https://loadlyapp.com`.
- `/en`, `/tr`, `/fr`, `/de` all render.
- `/sitemap.xml` and `/robots.txt` are correct.
- Canonical `<link>` tags point to the apex domain (this direction has regressed twice in past migrations — always double check it).
- Within 5 minutes: confirm the cron-job.org ping to `/api/cron/trigger-scraper` is succeeding (check its dashboard).
- Next scraper run (GitHub Actions): confirm the `fcm-batch` webhook succeeds.
- Next `blog-generator.yml` run (09:00 UTC): confirm its `/api/revalidate` POST succeeds.

## Rollback

Vercel stays live and untouched for at least 5-7 days after cutover. To roll
back, just re-point the Hostinger A records back to Vercel's anycast IPs
(`76.76.21.21` for apex, `216.198.79.1` for `www`, per the last known-good
Vercel migration — verify these haven't changed in the Vercel dashboard
before using them). Do not delete the Vercel project until the VM has proven
stable for the full window.

## Ongoing deploys

After the initial setup, ship changes with:
```
ssh <vm> 'bash /opt/loadly/app/deploy/deploy.sh'
```
