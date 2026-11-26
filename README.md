# শব্দজাল · Assamese Picture Crossword

An Assamese and English crossword game for Android, built as a web app (PWA) that is hosted on
GitHub Pages and wrapped for the Play Store. Developed by **KBX Studios**.

## What's in the game

- **Two languages** – অসমীয়া (one syllable per square, e.g. কা | জি | ৰ | ঙা) and English (one letter per square).
- **Arrow-word grid** – every level uses the same 8 × 10 board in a clean blue & white style. The top row and left
  column are clue squares, and more clue squares sit inside the grid. Each has an arrow to its word (→ across, ↓ down);
  one square can hold two clues.
- **Hint words and pictures** – most clues are a short hint word (e.g. TRUNK → ELEPHANT, ফলৰ ৰজা → আম); some are
  shown as a glossy clip-art picture instead (about 55% on Easy, 40% on Medium, 30% on Hard).
- **3 difficulty levels** – সহজ / Easy, মধ্যম / Medium, কঠিন / Hard, each with **Levels 1–20**.
  Level 1 is open; finishing a level unlocks the next.
- **Menu (☰)** – My profile, Settings, Share, Rate us, About, Developer, Contact and Privacy policy. Set your contact
  email and Play Store links in `config.js`.
- **My profile** – name and progress per language and difficulty.
- **Accounts** – *Create account* with a username and password, *Log in*, *Log out* and *Change password*. Accounts
  live on the phone (password stored only as a salted PBKDF2 hash) and each player has their own progress; a guest's
  progress carries into a new account. Once Firebase is set up in `config.js`, sign-in switches to online accounts
  (email + password; Google too on the website) that sync progress across phones.
- **Win and best-time celebrations** – fanfare, applause and confetti when a level is solved; a 🏆 *New best time!*
  banner with its own sound when a level is solved faster than before. Level cards show the best time.
- **3 hints per level** – each hint either reveals one square or shows the word's name in the other language.
  Stars: ★★★ with no hints, ★★ with 1–2 hints, ★ with all 3.
- **Letter suggestions** – tiles below the board show the missing letters (or syllables) of the selected word
  mixed with decoys, in a jumbled order (6 tiles on Easy, 8 on Medium, 9 on Hard for a fresh word). In Assamese most
  decoys are look-alikes of the answer's own syllables (কা → কি, কু, কো), so short words are not easy to guess. Tap a tile to fill the selected square, or **drag it onto
  any square**. Placed letters can be dragged to another square, or off the board to remove them. A "Type" box is there for anyone with an Assamese keyboard.
- **Sound and vibration** – effects for placing, picking up and removing letters, a chime for each finished word,
  a buzz for a wrong word, a sparkle for hints and a tune when the level is done. Switch either off in ⚙️ Settings
  on the home screen; 🔊 in the game bar mutes sound quickly.
- Progress, stars and unfinished puzzles saved on the phone; works offline after the first visit.
- **Optional Google sign-in** to keep progress online (Firebase).
- **Optional Google ads** (AdSense) on the home screen and after a level is finished — never during play.

## Files

| File | What it does |
|---|---|
| `index.html`, `style.css` | Page and look |
| `app.js` | Game engine: syllable splitter, grid builder, levels, hints, screens |
| `puzzles.js` | Word list: `[picture, Assamese word, English word, Assamese hint, English hint]` |
| `icons.js` | The doodle pictures (SVG) |
| `config.js` | **Your settings** – developer name, Firebase login, ads |
| `cloud.js`, `ads.js` | Sign-in/sync and ads (both stay off until set up in `config.js`) |
| `manifest.json`, `sw.js`, `icons/` | Installable app + offline support |
| `privacy.html` | Privacy policy (Play Store needs its link) |
| `firestore.rules` | Security rules for the online progress database |

## Adding words

Add a line to any group in `puzzles.js`, e.g. `["mango", "আম", "MANGO", "ফলৰ ৰজা", "KING OF FRUITS"]`. The first item must be a
doodle name from `icons.js` (add a new doodle there if needed). Then run `node tools/build-levels.js`: it plans all 120 levels together so each word is used as
few times as possible and never in two levels in a row, and writes `levels.js`. (GitHub Actions runs it too before
building the Android app.) **Adding or removing words changes the
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
