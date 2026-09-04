# Play Store Listing Content

Per-market copy for the Play Console "Store listing" page (Main store listing + translations).
Not app code — copy/paste these into Play Console per language.

## Play Console field limits
- **App name (title):** 30 characters max — the single strongest ASO lever
- **Short description:** 80 characters max — shown before "Read more"
- **Full description:** 4000 characters max — the files here use a few hundred, well under budget; that's a floor, not a target, quality over stuffing

## Why these 8 languages
Pulled from the real `loads` table country distribution (queried live via the app's own public Supabase endpoint, 2026-09-05), not a guess:
US ~69%, Turkey ~21%, then Ukraine/Romania/Russia/Germany/Canada/Italy/Iraq in the low single digits. Mapped to markets:
`en-US` (default), `tr-TR`, `de-DE`, `ro`, `ru-RU`, `uk`, `it-IT`, `ar` (Iraq/MENA). Skipped `zh` (China) — Google Play isn't available in mainland China, so store-listing copy there is dead weight.

## Why not literal translation
Every freight-matching market has its own established search term for "load board" that a literal translation of the English/Turkish copy would miss entirely:
- **US:** "load board" (DAT, Truckstop.com use this exact term) — not "freight marketplace"
- **Turkey:** "nakliye borsası" / "yük borsası" (freight exchange) — the term Turkish carriers actually search
- **Germany:** "Frachtbörse" (TimoCom, Trans.eu Germany) — a literal "Fracht-Marktplatz" would read as amateur/wrong to the target audience
- **Romania:** "bursă de transport"
- **Russia:** "биржа грузоперевозок" (the term ATI.SU and similar use)
- **Ukraine:** "біржа вантажоперевезень" / "вантажів" — kept separate from Russian, distinct search behavior
- **Italy:** "borsa carichi" (Teleroute, Trans.eu Italia)
- **Iraq/MENA:** "بورصة الشحن" (freight exchange)

Title pattern used everywhere: `Loadly - <local industry term>`, keeping the brand first and the real search term second, each under the 30-char cap.

## Files
One file per locale, named by the Play Console language code: `en-US.md`, `tr-TR.md`, `de-DE.md`, `ro.md`, `ru-RU.md`, `uk.md`, `it-IT.md`, `ar.md`.
