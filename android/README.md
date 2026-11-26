# শব্দজাল – Android app (Play Store)

The Android app is a **standalone app**: the whole game (the web files at the top of this repo) is packed
inside the APK and runs in the app's own window – no browser, no address bar, and it works offline.
Each build copies the current game files into the app, so after changing the game, upload the new `.aab` to Play.

| | |
|---|---|
| Package name | `com.kbxstudios.shabdajal` |
| App name on the phone | শব্দজাল |
| Developer | KBX Studios |
| Version | 1.0.0 (version code = GitHub build number) |
| Min / target Android | 5.0 (API 21) / Android 16 (API 36) |
| Permissions | Internet (fonts, optional sign-in), Vibrate |

## How the APK and AAB are built

Every push that changes `android/` or the game files runs **GitHub Actions → "Build Android app (APK + AAB)"**. It makes:

- `shabdajal-1.0.0-buildN.apk` – install on a phone to test
- `shabdajal-1.0.0-buildN.aab` – upload to Google Play Console

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
*"Signed with: upload key (from secrets)"*. Until the secrets are added, builds use the fixed **test** key in
`android/test-signing.jks` – fine for installing the APK on your phone, but don't upload that AAB to Play.

Android only lets an app update itself with the same key. If an APK won't install over an older one, uninstall
the old one first (this happens once when switching from the test key to your upload key).

## 2. Upload to Google Play

1. Play Console → **Create app** → name, default language, *Game*, *Free*.
2. **Test and release → Production** (or *Internal testing* first) → **Create new release** → upload the `.aab`.
3. Store listing: app icon `android/store/play-icon-512.png` (512×512), a 1024×500 feature graphic and at
   least 2 phone screenshots.
4. Privacy policy URL: `https://khems9p-coder.github.io/assamese-crossword/privacy.html`
   (add your contact email to `privacy.html` first).
5. Fill in *App content*: ads (yes/no to match `config.js`), content rating questionnaire, target audience,
   data safety (progress is stored on the phone only).

Note: Google does not allow its sign-in page inside an app's own WebView, and AdSense ads are for websites only.
The app therefore keeps progress on the phone and shows no ads; online sign-in and AdSense still work on the
website. Ads inside the app would need AdMob (a small native addition).

## Changing the app later

- Name / icon / colours: `app/src/main/res/` · Version name: `appVersionName` in `app/build.gradle`.
- App code: `app/src/main/java/com/kbxstudios/shabdajal/MainActivity.java` (WebView, back button, safe areas).
- New Play release: bump `appVersionName`, push, and upload the new `.aab` (the version code goes up by itself).
