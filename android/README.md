# শব্দজাল – Android app (Play Store)

The Android app is a **Trusted Web Activity (TWA)**: a small Android wrapper that opens the game
(`https://khems9p-coder.github.io/assamese-crossword/`) full screen in Chrome. Game updates you push to
GitHub reach players straight away; you only rebuild the app to change its name, icon or version.

| | |
|---|---|
| Package name | `com.kbxstudios.shabdajal` |
| App name on the phone | শব্দজাল |
| Developer | KBX Studios |
| Version | 1.0.0 (version code = GitHub build number) |
| Min / target Android | 5.0 (API 21) / Android 16 (API 36) |

## How the APK and AAB are built

Every push that changes `android/` runs **GitHub Actions → "Build Android app (APK + AAB)"**. It makes:

- `shabdajal-1.0.0-buildN.apk` – install on a phone to test
- `shabdajal-1.0.0-buildN.aab` – upload to Google Play Console
- `assetlinks.json` – proves to Android that you own the website (see below)

Download them from the repo's **Releases** page (or the run's *Artifacts*).
To build again without changing files: **Actions → Build Android app → Run workflow**.

## 1. Add your signing key to GitHub (once)

Play needs every update signed with the **same upload key**. The key was created for you as
`shabdajal-upload.jks`. **Keep it and its password safe and private – never put them in this public repo.**
If you lose it you must ask Google support to reset the upload key.

Repo **Settings → Secrets and variables → Actions → New repository secret**, add these four:

| Name | Value |
|---|---|
| `KEYSTORE_BASE64` | the whole contents of `KEYSTORE_BASE64.txt` |
| `KEYSTORE_PASSWORD` | the password in `signing-info.txt` |
| `KEY_ALIAS` | `shabdajal` |
| `KEY_PASSWORD` | the same password |

Then **Actions → Build Android app → Run workflow**. The release notes will say
*"Signed with: upload key (from secrets)"*. Until the secrets are added, builds use a temporary
**test** key – fine for trying the APK, but don't upload that AAB to Play.

## 2. Publish assetlinks.json (removes the browser address bar)

Android only shows the game full screen (no address bar) if the website says it trusts the app.
The file must be at the **root** of the site:
`https://khems9p-coder.github.io/.well-known/assetlinks.json`

1. Create a new public repo named exactly **`khems9p-coder.github.io`** and turn on Pages for it
   (Settings → Pages → `main` / root). If you already have it (e.g. for another app), use it.
2. Add the file `.well-known/assetlinks.json` (content below or from the release).
3. Add an empty file named `.nojekyll` at the top of that repo so GitHub serves the `.well-known` folder.

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.kbxstudios.shabdajal",
    "sha256_cert_fingerprints": [
      "E5:EC:DA:57:89:76:F2:59:17:6C:A2:27:60:C7:1A:65:BF:21:92:A0:52:25:0F:99:8C:D8:8E:8D:8D:5D:30:E2"
    ]
  }
}]
```

That fingerprint is your **upload key**. Google Play re-signs apps with its own **app signing key**, so after your
first upload go to Play Console → your app → **Test and release → App integrity → App signing**, copy the
*App signing key certificate* SHA-256, and add it as a second item in `sha256_cert_fingerprints`. Without it, the
copy installed from Play shows an address bar. If you already host an `assetlinks.json` for another app, add this
app as another `{ ... }` object inside the same `[ ... ]` list.

## 3. Upload to Google Play

1. Play Console → **Create app** → name, default language, *Game*, *Free*.
2. **Test and release → Production** (or *Internal testing* first) → **Create new release** → upload the `.aab`.
3. Store listing: app icon `android/store/play-icon-512.png` (512×512), a 1024×500 feature graphic and at
   least 2 phone screenshots.
4. Privacy policy URL: `https://khems9p-coder.github.io/assamese-crossword/privacy.html`
   (add your contact email to `privacy.html` first).
5. Fill in *App content*: ads (yes/no to match `config.js`), content rating questionnaire, target audience,
   data safety (Google sign-in collects name, email and photo only when the player signs in).

## Changing the app later

- Name / icon / colours: `app/src/main/res/` · Version name: `appVersionName` in `app/build.gradle`.
- New Play release: bump `appVersionName`, push, and upload the new `.aab` (the version code goes up by itself).
