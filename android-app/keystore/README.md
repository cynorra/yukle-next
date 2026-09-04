# Release signing key

The actual keystore file (`loadly_key.jks`) lives at **`D:/keystores/loadly_key.jks`**,
not in this repo — matching the same convention already used there for this user's
other apps (history_quiz_pro, ezanvakti, lexio, sanctum, etc.), each as
`{app}_key.jks` alongside a `key aliaslar.txt` template. `D:\keystores\` is outside
any git repo on this machine.

`keystore.properties` in this folder (gitignored, not committed) just points at that
external file + the alias/passwords, so `app/build.gradle.kts` can find it. Generated
2026-09-04, alias `loadly`, valid 10000 days (~27 years).

## This is irreplaceable — back up `D:\keystores\loadly_key.jks` itself

If that file (and its password) is lost, there is **no way to publish an update to
the same app listing** under this signing identity ever again — the only recourse is
publishing a brand new app with a new package name/listing, losing all reviews,
installs, and ranking. Since it already lives in this user's usual keystore folder,
whatever backup process covers that folder for the other apps covers this one too —
just confirm one actually exists (D:\ drive alone is not a backup).

## SHA-256 certificate fingerprint

`SHA256_FINGERPRINT.txt` in this folder has the current fingerprint (safe to keep
here unlike the key itself — it's public information, not a secret). It's what's
published in the website's `public/.well-known/assetlinks.json` for Android App Links.

## Important: Play App Signing

If/when this app is uploaded to Google Play Console, Play App Signing (mandatory for
new apps) will most likely re-sign the app with its **own** key before distributing it
to users — meaning the fingerprint that actually matters for App Links on
Play-installed copies is **Play Console's app signing key**, not this upload key.
Find it at Play Console → Test and release → Setup → App integrity → App signing key
certificate → SHA-256, **after the first upload**, and add it as a second entry in
`assetlinks.json`'s `sha256_cert_fingerprints` array alongside this one. This upload
keystore's fingerprint still matters for any APK distributed outside Play (direct
sideload, internal testing without Play signing, etc.) signed with it directly.
