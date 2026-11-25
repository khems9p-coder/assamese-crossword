# শব্দজাল · Assamese Picture Crossword

An Assamese and English crossword game for Android, built as a web app (PWA) that is hosted on
GitHub Pages and wrapped for the Play Store. Developed by **KBX Studios**.

## What's in the game

- **Two languages** – অসমীয়া (one syllable per square, e.g. কা | জি | ৰ | ঙা) and English (one letter per square).
- **Picture clues** – every clue is a hand-drawn 2D doodle of the object instead of a written clue.
- **3 difficulty levels** – সহজ / Easy, মধ্যম / Medium, কঠিন / Hard, each with **Levels 1–20**.
  Level 1 is open; finishing a level unlocks the next.
- **3 hints per level** – each hint either reveals one square or shows the word's name in the other language.
  Stars: ★★★ with no hints, ★★ with 1–2 hints, ★ with all 3.
- **Syllable/letter tile keyboard**, plus a "Type" box for anyone with an Assamese keyboard.
- Progress, stars and unfinished puzzles saved on the phone; works offline after the first visit.
- **Optional Google sign-in** to keep progress online (Firebase).
- **Optional Google ads** (AdSense) on the home screen and after a level is finished — never during play.

## Files

| File | What it does |
|---|---|
| `index.html`, `style.css` | Page and look |
| `app.js` | Game engine: syllable splitter, grid builder, levels, hints, screens |
| `puzzles.js` | Word list: `[doodle, Assamese word, English word]` |
| `icons.js` | The doodle pictures (SVG) |
| `config.js` | **Your settings** – developer name, Firebase login, ads |
| `cloud.js`, `ads.js` | Sign-in/sync and ads (both stay off until set up in `config.js`) |
| `manifest.json`, `sw.js`, `icons/` | Installable app + offline support |
| `privacy.html` | Privacy policy (Play Store needs its link) |
| `firestore.rules` | Security rules for the online progress database |

## Adding words

Add a line to any group in `puzzles.js`, e.g. `["mango", "আম", "MANGO"]`. The first item must be a
doodle name from `icons.js` (add a new doodle there if needed). Levels are generated from the whole
word list automatically, so no grids need drawing by hand. **Adding or removing words changes the
generated levels**, so do it before release, not after players have progress.

## Publish on GitHub Pages

1. Repo **Settings → Pages → Source: Deploy from a branch → `main` / root**.
2. The app will be at `https://khems9p-coder.github.io/assamese-crossword/`.
3. After changing any file, bump `VERSION` in `sw.js` so phones pick up the update.

## Turn on Google sign-in

1. In the [Firebase console](https://console.firebase.google.com) create (or reuse) a project and add a **Web app**.
2. **Authentication → Sign-in method → Google → Enable.**
3. **Authentication → Settings → Authorized domains → add `khems9p-coder.github.io`.**
4. **Firestore Database → Create database**, then paste `firestore.rules` into the **Rules** tab and publish.
5. Copy the web app config into `firebase:` in `config.js`.

## Turn on Google ads

1. Get an AdSense account approved for `khems9p-coder.github.io` and create two display ad units.
2. In `config.js` set `ads.enabled: true` and fill `client` (ca-pub-…), `homeSlot` and `winSlot`.

Note: AdSense is made for websites. Whether AdSense may run inside a Play Store app (a Trusted Web
Activity) is not clearly settled, so check Google's current AdSense and Play policies before enabling it
in the store version. Showing AdMob ads would need a native Android wrapper instead.

## Make the Play Store app

Use [PWABuilder](https://www.pwabuilder.com) with the GitHub Pages URL → **Android** package, then
upload the `.aab` to Play Console. The `assetlinks.json` it gives you must be served from the domain
root, `https://khems9p-coder.github.io/.well-known/assetlinks.json`, which lives in a repo named
`khems9p-coder.github.io`. If you already set one up for another app, add this app's entry to the same file.
Use `…/assamese-crossword/privacy.html` as the privacy policy URL (add your contact email to it first).
