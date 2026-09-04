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

## Correction (2026-09-04): jargon vs. real search terms
The 8 markets above were built around each market's *B2B industry term* ("freight exchange" equivalents - Frachtbörse, bursă de transport, borsa carichi, etc.). That approach is wrong for ASO: a truck driver doesn't search the corporate name of the industry, they search plain everyday words. Confirmed directly for Turkish: nobody searches "yük borsası" - real queries are "tır", "kamyon", "nakliye", "taşımacılık", "tır yükleri", "tır iş bul". The full locale set added below (generated via Gemini, then hand-reviewed for format/char-limits/locale codes) follows the corrected philosophy: for every market, use the words a driver would actually type into Google/Play search - truck/lorry type, the transport trade name, and "find work"/"find load" action phrases - not translated corporate jargon. The original 8 files' keyword rationale still reflects the old (jargon) framing and could be revisited under the same lens later; they were left as-is here since re-verifying real search behavior per market takes market-specific research, not a bulk pass.

## Full Play Console locale set
Beyond the original 8 priority markets, every locale Google Play Console's store listing page supports now has a file here (~70 total), so the whole Play Store footprint can be filled in from Play Console's "Add languages" flow. File names match Play Console's exact language codes (e.g. `ro` not `ro-RO`, `uk` not `uk-UA`, `iw` not `he` for Hebrew, `no-NO` not `nb-NO` for Norwegian) - check the code in Play Console's own language picker before pasting if a file's naming looks unfamiliar. A couple of locales here (e.g. `uz-UZ`) are flagged inside the file itself as not confirmed to be on Play Console's actual supported list - double check those specifically before relying on them.

## Files
One file per locale, named by the Play Console language code, e.g. `en-US.md`, `tr-TR.md`, `de-DE.md`, `ro.md`, `ru-RU.md`, `uk.md`, `it-IT.md`, `ar.md`, plus the full set covering the rest of Play Console's supported languages.
