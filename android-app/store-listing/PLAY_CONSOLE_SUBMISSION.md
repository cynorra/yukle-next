# Play Console Submission Checklist — Loadly

Everything needed to actually submit the app on Google Play Console, beyond the
per-locale title/description copy already written in `store-listing/*.md` (73
locale files + `en-US.md` as the default/fallback listing).

Status as of 2026-09-11: **app is signed-build-ready, submission assets are
NOT yet ready.** The gaps below (graphics, Data Safety answers, content
rating) are things only a human can finish in the Play Console UI — this file
is the checklist for that, not something Claude can complete unattended.

---

## 1. App identity (already fixed, just for reference)

| Field | Value |
|---|---|
| Package name (applicationId) | `app.yukbul.android` (original YukBul package, kept for Play Console upload identity — Java source packages/namespace stay `com.cynorra.loadly`, unrelated to this) |
| App name | Loadly |
| Version code / name | 3 / "1.1" |
| compileSdk / targetSdk / minSdk | 36 / 36 / 24 |
| Default listing language | English (US) — `store-listing/en-US.md` |
| Category | **Business** (closest fit — it's a B2B load board/marketplace, not
Maps & Navigation or Travel & Local). Pick this in Play Console → Store
presence → Main store listing → Category. Not yet selected anywhere — pick it
during submission. |
| Contact email | info@loadlyapp.com |
| Website | https://loadlyapp.com |
| Privacy Policy URL | https://loadlyapp.com/en/privacy (now includes the
CCPA section and the `dataL6` mobile-app data disclosure added 2026-09-10/11) |

## 2. Build artifact

- Use the **signed release AAB**, not an APK: `app/build/outputs/bundle/release/app-release.aab`
  (produced by `./gradlew bundleRelease`, confirmed building successfully as
  of this session — `BUILD SUCCESSFUL in 2m 41s`).
- Signing config reads `android-app/keystore/keystore.properties` (gitignored,
  points at `D:\keystores\loadly_key.jks`, outside the repo). Confirm this
  file exists locally before running `bundleRelease` — see
  `android-app/keystore/README.md` for setup if it's missing.
- **Enroll in Play App Signing** on first upload (Play Console will prompt
  for this automatically). After the first successful upload, Google
  generates its own signing certificate — copy that certificate's SHA-256
  fingerprint into `app/src/main/assetlinks.json` (or wherever the deployed
  `.well-known/assetlinks.json` lives on the website) so Android App Links /
  the Custom Tabs OAuth redirect-back continues to verify correctly. This
  fingerprint **cannot be known before the first upload** — it's a hard
  sequencing dependency, not optional cleanup.

## 3. Graphic assets — NOT YET CREATED

Searched the whole repo (`android-app/` and `public/`) for existing Play
Store graphics. Found:
- App icon: exists, full mipmap set (`mipmap-*dpi/ic_launcher*.png` +
  adaptive icon `ic_launcher_foreground`/`ic_launcher_background` +
  monochrome) — **this one is done**, Play Console pulls it from the AAB
  automatically, no separate upload needed.
- Feature graphic (1024×500 PNG/JPG, required): **does not exist anywhere in
  the repo.**
- Phone screenshots (min 2, recommend 4-8, PNG/JPG, 16:9 or 9:16, min
  320px/max 3840px on the long edge): **do not exist.**
- 7" / 10" tablet screenshots: not required (app is phone-only per manifest,
  no tablet layout), skip.
- Promo video (optional, YouTube URL): none, optional — skip unless wanted.

`public/logo.png` / `public/logobgli.png` exist on the website and can be
reused as a starting point for the feature graphic's branding, but the
feature graphic itself (1024×500 canvas with app name + a visual, not just a
logo) still needs to be designed — this wasn't in scope for the code session
and needs actual design work (Canva/Figma or similar), not something to
generate from code. Screenshots need to be taken from the running app on a
device/emulator, e.g. the marketplace list, load detail with the Contact
Shipper button, and the sign-in screen.

**This is the actual blocker to submitting** — Play Console will not accept
the listing without a feature graphic and at least 2 screenshots.

## 4. Content rating questionnaire

Not yet filled out (done inside Play Console, not a file). Answer based on
what the app actually is:
- No user-generated content moderation risk beyond what's already public on
  loadlyapp.com (load postings, contact between shippers/carriers).
- No violence, sexual content, gambling, or drugs.
- Has user-to-user messaging (via the Contact Shipper → website Custom Tabs
  flow) — flag this honestly, it affects the rating in most questionnaires.
- Expected result: rating equivalent to "Everyone" / "PEGI 3", but let the
  questionnaire's own logic decide — don't hand-pick the rating.

## 5. Data Safety form

Fill in Play Console → App content → Data safety based on what the app
**actually does** (verified from code, not assumed):

| Data type | Collected? | Purpose | Shared? | Notes |
|---|---|---|---|---|
| Account info (email) | Yes | App functionality (sign-in) | No | Via Supabase Auth, same backend as the website |
| Approximate/precise location | Yes | App functionality | No | `ACCESS_FINE_LOCATION` + `ACCESS_COARSE_LOCATION`; used on-device via Android `Geocoder` (`LoadlyApplication.java`, `MainActivity.java`) to resolve the device's country for FCM topic subscription — **not sent to any server as raw coordinates**, only the resolved country code is used to subscribe to an FCM topic |
| Device/other IDs | Yes | Advertising | Yes (Google/AdMob) | Advertising ID, used by AdMob for the one banner ad unit (`ca-app-pub-4674211063760769/8775943135` in `activity_main.xml`) |
| App activity / crash logs | Likely (Firebase default telemetry) | Analytics | No | Standard Firebase SDK behavior — confirm against actual Firebase project config in Play Console, don't guess further than this |
| Messages | No | — | — | Contact-shipper flow hands off to the website via Custom Tabs; the app itself doesn't store or transmit message content |

Declare **data is encrypted in transit** (all API calls are HTTPS to
Supabase/loadlyapp.com). Declare a **data deletion request path** — point to
the account-deletion flow on the website (same Supabase Auth account as
web), or add one if it doesn't exist yet; check before submitting since
recent Play policy requires this even for account data collected only
in-app.

## 6. Permissions declared (from `AndroidManifest.xml`)

```
INTERNET
ACCESS_NETWORK_STATE
ACCESS_FINE_LOCATION
ACCESS_COARSE_LOCATION
POST_NOTIFICATIONS
```

No camera, contacts, storage, or SMS permissions — keeps the Data Safety
form and permissions justification simple. If Play Console asks for a
"prominent disclosure" for location (it will, since it's FINE location on a
non-maps app), the honest justification is: *"used to determine the
device's country so it can subscribe to the correct region's push
notification topic for new freight postings — resolved on-device, never
transmitted as raw coordinates."*

## 7. Pricing & distribution

- Free app, no in-app purchases anywhere in the code — mark accordingly.
- Contains ads: **Yes** (one AdMob banner unit).
- Target countries: same as the live marketplace's real geography — the
  website's load data is US/TR-heavy per [[marketplace-liquidity-2026-08-11]];
  no reason to geo-restrict the Play listing, distribute worldwide unless
  there's a business reason to limit it.
- Target audience / age: general audience app (freight/logistics B2B tool),
  not designed for children — answer the target-age questionnaire as
  18+/general, not "appeals to children."

## 8. What's genuinely done vs. still open

**Done, verified this session:**
- Signed release AAB builds successfully
- Store listing copy for 73 locales + en-US default (all "55→54" language-count
  fixed to match reality after Telugu was dropped)
- App icon assets (full mipmap set)
- Privacy Policy page includes CCPA + mobile-app-specific data disclosure
- Currency and truck-type display bugs fixed (would have shown wrong info to
  real Play Store users)
- Contact Shipper flow wired end-to-end (Custom Tabs → website)

**Still open, needs a human (not code):**
- Feature graphic (1024×500) — not designed
- Phone screenshots (min 2) — not captured
- Content rating questionnaire — not filled out (Play Console UI)
- Data Safety form — not filled out (Play Console UI, use §5 above as the answer key)
- Category selection — not chosen in Play Console yet
- First AAB upload + Play App Signing enrollment → then update
  `assetlinks.json` with the resulting fingerprint
- Data deletion request path — confirm one exists or add it before the Data
  Safety form is submitted

---
*Generated 2026-09-11. Cross-reference: [[android-app-build]],
[[play-store-listing-2026-09-05]] in project memory.*
