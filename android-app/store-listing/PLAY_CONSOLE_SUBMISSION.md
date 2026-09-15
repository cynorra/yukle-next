# Play Console Submission Checklist — Loadly

Everything needed to actually submit the app on Google Play Console, beyond the
per-locale title/description copy already written in `store-listing/*.md` (73
locale files + `en-US.md` as the default/fallback listing).

Status as of 2026-09-15: **app is signed-build-ready AND all graphic assets
are done.** Feature graphic, icon, and phone/tablet screenshots were
generated in CI from the real running app (`.github/workflows/android-build.yml`
`screenshots` job) and committed to `store-listing/graphics/`. The remaining
gaps (Data Safety answers, content rating, category, first upload) are things
only a human can finish in the Play Console UI — this file is the checklist
for that, not something Claude can complete unattended.

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
  points at `D:\keystores\yukbul_key.jks` — the real, Play-Console-registered
  upload key; `loadly_key.jks` was a mistaken duplicate generated before that
  history was known and must NOT be used, see the signing-key saga in
  `keystore/README.md`). Confirm this file exists locally before running
  `bundleRelease` — see `android-app/keystore/README.md` for setup if it's
  missing.
- **Enroll in Play App Signing** on first upload (Play Console will prompt
  for this automatically). After the first successful upload, Google
  generates its own signing certificate — copy that certificate's SHA-256
  fingerprint into `app/src/main/assetlinks.json` (or wherever the deployed
  `.well-known/assetlinks.json` lives on the website) so Android App Links /
  the Custom Tabs OAuth redirect-back continues to verify correctly. This
  fingerprint **cannot be known before the first upload** — it's a hard
  sequencing dependency, not optional cleanup.

## 3. Graphic assets — DONE

All required graphics exist in `store-listing/graphics/`, generated for real
(not mockups) — the CI `screenshots` job installs the just-built APK on a
booted emulator, launches each real screen, and screencaps it:
- App icon: full mipmap set (`mipmap-*dpi/ic_launcher*.png` + adaptive icon
  + monochrome) — Play Console pulls it from the AAB automatically, no
  separate upload needed. A standalone `icon_512x512.png` also exists for
  the Play Console listing's dedicated icon upload field.
- Feature graphic: `graphics/feature_graphic_1024x500.png` — done.
- Phone screenshots: `graphics/screenshots/phone/01_main_webview.png`,
  `02_marketplace_list.png`, `03_load_detail.png` (3, min 2 required) — done.
- Tablet screenshots: `graphics/screenshots/tablet/` — same 3 screens,
  captured too even though not strictly required for a phone-only app —
  done.
- Promo video (optional, YouTube URL): none — optional, skip unless wanted.

Upload these directly to Play Console → Store presence → Main store listing
→ Graphics. Nothing left to design here.

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
| Device/other IDs | Yes | Advertising | Yes (Google/AdMob) | Advertising ID, used by AdMob for banner ad units on the main WebView, Marketplace, and Load Detail screens (dedicated ad unit IDs per screen). GDPR/UK consent gate (Google UMP SDK) added 2026-09-15 before any ad request. |
| App activity / crash logs | Likely (Firebase default telemetry) | Analytics | No | Standard Firebase SDK behavior — confirm against actual Firebase project config in Play Console, don't guess further than this |
| Messages | No | — | — | Contact-shipper flow hands off to the website via Custom Tabs; the app itself doesn't store or transmit message content |

Declare **data is encrypted in transit** (all API calls are HTTPS to
Supabase/loadlyapp.com). Declare a **data deletion request path** — use
`https://loadlyapp.com/en/delete-account` (dedicated page added
2026-09-11: signed-in users get an instant delete button reusing the same
`delete_user_account` RPC as `/profile`; signed-out visitors see an email
fallback to kvkk@loadlyapp.com). Update the Data Safety form's declared URL
to this exact page if it currently points anywhere else.

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

**Done, verified 2026-09-11 session:**
- Signed release AAB builds successfully
- Store listing copy for 73 locales + en-US default (all "55→54" language-count
  fixed to match reality after Telugu was dropped)
- App icon assets (full mipmap set)
- Privacy Policy page includes CCPA + mobile-app-specific data disclosure
- Currency and truck-type display bugs fixed (would have shown wrong info to
  real Play Store users)
- Contact Shipper flow wired end-to-end (Custom Tabs → website)
- Native debug symbols enabled in the release build type (though the app's
  only native lib ships pre-stripped upstream, so Play's warning about it
  may persist regardless)
- Data deletion request path — `/[locale]/delete-account` page added,
  7-language content (en/tr/es/pt/fr/it/ja, others fall back to English)

**Done, verified 2026-09-15 session:**
- GitHub Actions CI (`android-build.yml`) builds + signs the release AAB/APK
  on every push, since the local machine's C: drive is too low on space to
  build safely — verified signing cert matches the Play-Console-registered
  fingerprint on every run.
- Feature graphic (1024×500) — designed and committed.
- Phone + tablet screenshots (3 each) — captured for real from a booted CI
  emulator running the actual app, not mockups.
- 512×512 store icon — committed.
- Fixed a real live bug found in this pass: two push-notification paths sent
  users to a dead `/marketplace` URL (404) instead of the native
  `MarketplaceActivity`.
- Added GDPR/UK AdMob consent gate (Google UMP SDK) — was completely missing
  before.
- Added banner ads (dedicated ad unit IDs) to Marketplace and Load Detail
  screens.

**Still open, needs a human (not code):**
- Content rating questionnaire — not filled out (Play Console UI)
- Data Safety form — not filled out (Play Console UI, use §5 above as the answer key)
- Category selection — not chosen in Play Console yet
- First AAB upload + Play App Signing enrollment → then update
  `assetlinks.json` with the resulting fingerprint

---
*Generated 2026-09-11, updated 2026-09-15. Cross-reference: [[android-app-build]],
[[play-store-listing-2026-09-05]], [[android-app-graphify-audit-2026-09-15]]
in project memory.*
