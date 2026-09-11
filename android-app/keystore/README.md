# Release signing key

The actual keystore file (`yukbul_key.jks`) lives at **`D:/keystores/yukbul_key.jks`**,
not in this repo — matching the same convention already used there for this user's
other apps (history_quiz_pro, ezanvakti, lexio, sanctum, etc.), each as
`{app}_key.jks` alongside a `key aliaslar.txt` template. `D:\keystores\` is outside
any git repo on this machine.

`keystore.properties` in this folder (gitignored, not committed) just points at that
external file + the alias/passwords, so `app/build.gradle.kts` can find it.

## This IS the key already registered with Play Console — do not regenerate it

The app started life as "YukBul" before the Loadly rebrand, and the first Play
Console upload was signed with this key (alias `yukbul`, created 2026-05-04, valid
until 2053). **Play Console has this exact certificate registered as the app's
upload key** (SHA1 `97:87:8A:22:A6:5C:2D:85:24:EF:D3:D5:0D:CC:12:B1:96:7C:71:77`) —
any future release must be signed with it or the upload is rejected with a
"wrong signing key" error.

2026-09-11: a prior session had generated a brand-new `loadly_key.jks` (2026-09-04,
alias `loadly`) without realizing the original `yukbul` key already existed and was
already registered with Play Console. That new key does NOT match what Play Console
expects and cannot be used to publish updates — recovered the real original key from
`C:\Users\erens\Downloads\yukbul.jks` and switched back to it. The now-unused
`loadly_key.jks` is harmless to keep around but must not be used for signing release
builds of this app.

## This is irreplaceable — back up `D:\keystores\yukbul_key.jks` itself

If that file (and its password) is lost, there is **no way to publish an update to
the same app listing** under this signing identity ever again — the only recourse is
Play Console's self-service "upload key reset" (Setup → App integrity → App signing →
request upload key reset), or, failing that, publishing a brand new app with a new
package name/listing, losing all reviews, installs, and ranking. Since it already
lives in this user's usual keystore folder, whatever backup process covers that
folder for the other apps covers this one too — just confirm one actually exists
(D:\ drive alone is not a backup). Also worth keeping a copy of the original
`C:\Users\erens\Downloads\yukbul.jks` around as a second backup location.

## SHA-256 certificate fingerprint

`SHA256_FINGERPRINT.txt` in this folder has the current fingerprint (safe to keep
here unlike the key itself — it's public information, not a secret). It's what's
published in the website's `public/.well-known/assetlinks.json` for Android App Links.

## Important: Play App Signing

Play App Signing (mandatory for new apps) most likely re-signs the app with its
**own** key before distributing it to users — meaning the fingerprint that actually
matters for App Links on Play-installed copies is **Play Console's app signing key**,
not this upload key. Find it at Play Console → Test and release → Setup → App
integrity → App signing key certificate → SHA-256, and add it as a second entry in
`assetlinks.json`'s `sha256_cert_fingerprints` array alongside this one. This upload
keystore's fingerprint still matters for any APK distributed outside Play (direct
sideload, internal testing without Play signing, etc.) signed with it directly.
