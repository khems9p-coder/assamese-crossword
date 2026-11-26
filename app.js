/* Assamese & English picture crossword. Plain JS, no build step. */
(function () {
  "use strict";

  // ---------------------------------------------------------------- text ---
  const T = {
    as: {
      appTitle: "শব্দজাল", appSub: "ছবি চাই শব্দ ভৰাওক", modeAs: "অসমীয়া", modeEn: "English",
      across: "আঁৰে", down: "তললৈ", squares: "টা ঘৰ", hints: "সহায়", check: "পৰীক্ষা",
      revealCell: "এটা ঘৰ দেখুৱাওক", showMeaning: "ইংৰাজী নাম চাওক", noHints: "সহায় শেষ হ'ল",
      hintLeft: (n) => `${toAsNum(n)}টা সহায় বাকী`, cancel: "বাতিল", type: "টাইপ কৰক",
      typePh: "অসমীয়াত লিখক…", fill: "ভৰাওক", done: "বঢ়িয়া!", solvedIn: "সময়",
      hintsUsed: "সহায় লোৱা হ'ল", next: "পৰৱৰ্তী", again: "পুনৰ খেলক", home: "মূল পৃষ্ঠা",
      allWrongOk: "সকলো শুদ্ধ!", someWrong: (n) => `${toAsNum(n)}টা ঘৰ ভুল`, reset: "নতুনকৈ আৰম্ভ",
      levelWord: "স্তৰ", meaning: "অৰ্থ", credit: "বিকাশক", account: "একাউণ্ট", guest: "অতিথি", signIn: "Google-ৰে লগ ইন কৰক", signOut: "লগ আউট",
      loginInfo: "লগ ইন কৰিলে আপোনাৰ অগ্ৰগতি অনলাইনত সুৰক্ষিত থাকিব আৰু আন ফোনতো পাব।", synced: "অগ্ৰগতি অনলাইনত ছেভ হ'ল",
      notSetup: "লগ ইন সুবিধা সোনকালে আহিছে। এতিয়া অগ্ৰগতি এই ফোনতে ছেভ হৈ থাকে।", signedAs: "লগ ইন কৰা হৈছে", loginFail: "লগ ইন হ'ব নোৱাৰিলে", words: "টা শব্দ", clues: "ছবি সূত্ৰ", settings: "ছেটিংছ", close: "বন্ধ কৰক", newBest: "নতুন শ্ৰেষ্ঠ সময়!", previous: "আগৰ", bestTime: "শ্ৰেষ্ঠ সময়", firstClear: "প্ৰথম জয়", sound: "ধ্বনি", vibration: "কম্পন", on: "অন", off: "অফ"
    },
    en: {
      appTitle: "Picture Crossword", appSub: "Look at the picture, fill the word", modeAs: "অসমীয়া", modeEn: "English",
      across: "Across", down: "Down", squares: " squares", hints: "Hints", check: "Check",
      revealCell: "Reveal a square", showMeaning: "Show Assamese name", noHints: "No hints left",
      hintLeft: (n) => `${n} hint${n === 1 ? "" : "s"} left`, cancel: "Cancel", type: "Type",
      typePh: "Type the word…", fill: "Fill", done: "Well done!", solvedIn: "Time",
      hintsUsed: "Hints used", next: "Next", again: "Play again", home: "Home",
      allWrongOk: "All correct so far!", someWrong: (n) => `${n} square${n === 1 ? "" : "s"} wrong`, reset: "Start over",
      levelWord: "Level", meaning: "Meaning", credit: "Developed by", account: "Account", guest: "Guest", signIn: "Sign in with Google", signOut: "Sign out",
      loginInfo: "Sign in to keep your progress safe online and get it on any phone.", synced: "Progress saved online",
      notSetup: "Sign-in is coming soon. For now your progress is saved on this phone.", signedAs: "Signed in as", loginFail: "Could not sign in", words: " words", clues: "Picture clues", settings: "Settings", close: "Close", newBest: "New best time!", previous: "Before", bestTime: "Best time", firstClear: "First win", sound: "Sound", vibration: "Vibration", on: "On", off: "Off"
    }
  };
  const AS_DIGITS = "০১২৩৪৫৬৭৮৯";
  function toAsNum(n) { return String(n).replace(/\d/g, (d) => AS_DIGITS[d]); }
  const MAX_HINTS = 3;

  // ------------------------------------------------- Assamese syllables ---
  // Splits a word into aksharas: consonant clusters joined by hasanta (্),
  // plus their vowel signs and ঁ ং ঃ. Each akshara fills one square.
  const cp = (s, i) => s.charCodeAt(i);
  const isCons = (c) => (c >= 0x0995 && c <= 0x09B9) || c === 0x09DC || c === 0x09DD || c === 0x09DF || c === 0x09F0 || c === 0x09F1;
  const isSign = (c) => (c >= 0x09BE && c <= 0x09CC && c !== 0x09CD) || c === 0x09D7 || c === 0x09E2 || c === 0x09E3;
  const isMod = (c) => c >= 0x0981 && c <= 0x0983;
  const NUKTA = 0x09BC, HASANTA = 0x09CD, ZWJ = 0x200D, ZWNJ = 0x200C;

  function splitUnits(word, lang) {
    word = word.normalize("NFC");
    if (lang !== "as") return Array.from(word.toUpperCase());
    const out = [];
    let i = 0;
    while (i < word.length) {
      let j = i + 1;
      const c = cp(word, i);
      if (isCons(c)) {
        if (cp(word, j) === NUKTA) j++;
        // conjuncts: C ্ (ZWJ) C ...
        while (cp(word, j) === HASANTA) {
          let k = j + 1;
          if (cp(word, k) === ZWJ || cp(word, k) === ZWNJ) k++;
          if (k < word.length && isCons(cp(word, k))) {
            j = k + 1;
            if (cp(word, j) === NUKTA) j++;
          } else { j = k; break; } // final hasanta
        }
      }
      while (j < word.length && (isSign(cp(word, j)) || cp(word, j) === NUKTA)) j++;
      while (j < word.length && isMod(cp(word, j))) j++;
      out.push(word.slice(i, j));
      i = j;
    }
    return out;
  }

  // ------------------------------------------------------ seeded random ---
  function rng(seed) {
    let s = 0;
    for (const ch of String(seed)) s = (s * 31 + ch.charCodeAt(0)) >>> 0;
    s = s || 1;
    return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
  }
  function shuffle(a, r) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  // ------------------------------------------------------ grid builder ---
  // Arrow-word layout on a fixed board: every word has a picture-clue square
  // right before it (to the left for across, above for down). One clue square
  // can hold two clues: across (top half, arrow →) and down (bottom half, arrow ↓).
  const GRID_W = 8, GRID_H = 10;

  function arrowLayout(order, r, W, H, cap, preferLong) {
    const g = Array.from({ length: H }, () => Array(W).fill(null));
    const inB = (y, x) => y >= 0 && x >= 0 && y < H && x < W;
    const at = (y, x) => (inB(y, x) ? g[y][x] : null);
    const isL = (y, x) => { const c = at(y, x); return !!c && c.t === "L"; };
    const placed = [];
    let crossings = 0;

    function canPlace(units, y, x, d) {
      const dy = d === "down" ? 1 : 0, dx = 1 - dy, n = units.length;
      const cy = y - dy, cx = x - dx;
      if (!inB(cy, cx) || !inB(y + dy * (n - 1), x + dx * (n - 1))) return -1;
      const clue = g[cy][cx];
      if (clue && (clue.t !== "C" || clue[d])) return -1;
      if (y === 0 || x === 0) return -1; // top row and left column hold clues only
      if (isL(y + dy * n, x + dx * n)) return -1;
      let cross = 0;
      for (let i = 0; i < n; i++) {
        const yy = y + dy * i, xx = x + dx * i, c = g[yy][xx];
        if (!c) {
          if (isL(yy + dx, xx + dy) || isL(yy - dx, xx - dy)) return -1; // side neighbours free
        } else if (c.t === "L") {
          if (c.u !== units[i] || c.dirs.has(d)) return -1;
          cross++;
        } else return -1;
      }
      return cross;
    }
    function touch(units, y, x, d) {
      const dy = d === "down" ? 1 : 0, dx = 1 - dy;
      let t = 0;
      for (let i = -1; i <= units.length; i++) {
        const yy = y + dy * i, xx = x + dx * i;
        if (at(yy + dx, xx + dy)) t++;
        if (at(yy - dx, xx - dy)) t++;
      }
      // clues in the top row / left column, like a classic arrow-word
      if (y - dy === 0 || x - dx === 0) t += 14;
      return t;
    }
    function put(it, y, x, d, cross) {
      const dy = d === "down" ? 1 : 0, dx = 1 - dy;
      const cy = y - dy, cx = x - dx;
      if (!g[cy][cx]) g[cy][cx] = { t: "C" };
      g[cy][cx][d] = it;
      it.units.forEach((u, i) => {
        const yy = y + dy * i, xx = x + dx * i;
        if (!g[yy][xx]) g[yy][xx] = { t: "L", u, dirs: new Set() };
        g[yy][xx].dirs.add(d);
      });
      crossings += cross;
      placed.push({ ...it, y, x, dir: d });
    }

    let pending = order.slice();
    for (let pass = 0; pass < 4 && pending.length && placed.length < cap; pass++) {
      const left = [];
      for (const it of pending) {
        if (placed.length >= cap) { left.push(it); continue; }
        let best = null;
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) for (const d of ["across", "down"]) {
          const c = canPlace(it.units, y, x, d);
          if (c < 0) continue;
          // first word anywhere; then crossings first, lone words only from pass 2
          if (placed.length && c === 0 && pass < 1) continue;
          const sc = c * 30 + touch(it.units, y, x, d) * 3 + (preferLong ? it.units.length * 2 : 0) + r() * 4 - (c === 0 ? 12 : 0);
          if (!best || sc > best.sc) best = { y, x, d, c, sc };
        }
        if (best) put(it, best.y, best.x, best.d, best.c); else left.push(it);
      }
      pending = left;
    }
    let letters = 0;
    for (const row of g) for (const c of row) if (c && c.t === "L") letters++;
    return { g, placed, crossings, letters };
  }

  // Three difficulty levels, 20 levels each. Every level picks its words from
  // the whole picture-word pool, limited by word length.
  // share of clues shown as a picture instead of a hint word
  const ICON_SHARE = [0.55, 0.4, 0.3];
  // like classic arrow-word apps: only a few picture clues per board
  const ICON_CAP = [3, 2, 2];
  // some clues show the answer with gaps (শ_প_হু, B_N_NA), mostly on easier levels
  const PATTERN_SHARE = [0.25, 0.18, 0.1];
  // letters already filled in when a level starts
  const GIVEN_SHARE = [0.24, 0.17, 0.11];
  const DIFFS = [
    { id: "easy", as: "সহজ", en: "Easy", cap: 16, minLen: { as: 2, en: 2 }, maxLen: { as: 3, en: 5 }, decoys: 1, color: "#7cc576" },
    { id: "medium", as: "মধ্যম", en: "Medium", cap: 19, minLen: { as: 2, en: 2 }, maxLen: { as: 4, en: 7 }, decoys: 2, color: "#f7a541" },
    { id: "hard", as: "কঠিন", en: "Hard", cap: 22, minLen: { as: 2, en: 2 }, maxLen: { as: 9, en: 9 }, decoys: 3, color: "#ef5b5b" }
  ];
  const LEVELS = 20;

  function wordPool(lang) {
    const seen = new Set(), out = [];
    for (const th of window.THEMES) for (const [icon, as, en, asHint, enHint, asClue, enClue] of th.words) {
      const id = icon || as;
      if (seen.has(id)) continue;
      seen.add(id);
      // a crossword answer has no spaces or punctuation: প্ৰাচীন অসম → প্ৰাচীনঅসম, Ahom kingdom → AHOMKINGDOM
      const word = lang === "as" ? as.replace(/[\s\-'’.]+/g, "") : en.replace(/[^A-Za-z]/g, "").toUpperCase();
      out.push({ key: id, icon, word, alt: lang === "as" ? en : as, hint: lang === "as" ? asHint : enHint,
        clueText: (lang === "as" ? asClue : enClue) || null, group: lang === "as" ? th.as : th.en, units: splitUnits(word, lang) });
    }
    return out;
  }

  const levelCap = (D, level) => D.cap - 3 + Math.round((3 * (level - 1)) / (LEVELS - 1));
  const eligible = (D, lang) => wordPool(lang).filter((it) => it.units.length >= D.minLen[lang] && it.units.length <= D.maxLen[lang]);

  // Turn placed words into the grid the game plays on.
  function finishGrid(placed, diffIndex, r) {
    // reading order: top to bottom, left to right; across before down
    const words = placed.slice().sort((a, b) => a.y - b.y || a.x - b.x || (a.dir === "across" ? -1 : 1));
    words.forEach((wd, i) => {
      wd.id = i;
      wd.cells = wd.units.map((_, j) => [wd.y + (wd.dir === "down" ? j : 0), wd.x + (wd.dir === "across" ? j : 0)]);
      wd.clue = wd.dir === "down" ? [wd.y - 1, wd.x] : [wd.y, wd.x - 1];
      wd.showIcon = false;
      wd.pattern = null;
    });
    // a few pictures, spread over the board
    let icons = 0;
    for (const wd of shuffle(words, r)) {
      if (wd.icon && icons < ICON_CAP[diffIndex] && r() < ICON_SHARE[diffIndex] + 0.15) { wd.showIcon = true; icons++; }
    }
    // fill-in-the-blank clues: show about half of the answer, the rest as gaps
    for (const wd of words) {
      if (wd.showIcon || wd.units.length < 3 || r() >= PATTERN_SHARE[diffIndex]) continue;
      const keep = new Set(shuffle(wd.units.map((_, j) => j), r).slice(0, Math.floor(wd.units.length / 2)));
      wd.pattern = wd.units.map((u, j) => (keep.has(j) ? u : "_")).join("");
    }
    const sol = Array.from({ length: GRID_H }, () => Array(GRID_W).fill(null));
    const clues = Array.from({ length: GRID_H }, () => Array(GRID_W).fill(null));
    for (const wd of words) {
      const [cy, cx] = wd.clue;
      if (cy < 0 || cx < 0 || sol[cy][cx] != null) return null;
      for (let j = 0; j < wd.cells.length; j++) {
        const [y, x] = wd.cells[j];
        if (y >= GRID_H || x >= GRID_W || clues[y][x] || (sol[y][x] != null && sol[y][x] !== wd.units[j])) return null;
        sol[y][x] = wd.units[j];
      }
      clues[cy][cx] = clues[cy][cx] || {};
      if (clues[cy][cx][wd.dir] != null) return null;
      clues[cy][cx][wd.dir] = wd.id;
    }
    return { w: GRID_W, h: GRID_H, sol, clues, words };
  }

  // Levels come from levels.js, planned all together so that words repeat as little as
  // possible (tools/build-levels.js). A level whose words have since changed is built here.
  function buildLevel(diffIndex, level, lang) {
    const D = DIFFS[diffIndex];
    const planned = window.LEVEL_PLAN && window.LEVEL_PLAN.levels && window.LEVEL_PLAN.levels[`${lang}-${D.id}-${level}`];
    if (planned) {
      const byKey = new Map(wordPool(lang).map((w) => [w.key, w]));
      const placed = [];
      let ok = true;
      for (const [k, word, y, x, d] of planned) {
        const it = byKey.get(k);
        if (!it || it.word !== word) { ok = false; break; }
        placed.push({ ...it, y, x, dir: d ? "down" : "across" });
      }
      const grid = ok && finishGrid(placed, diffIndex, rng(`${lang}-${D.id}-${level}-icons`));
      if (grid) return grid;
    }
    return buildLevelLive(diffIndex, level, lang);
  }

  function buildLevelLive(diffIndex, level, lang) {
    const D = DIFFS[diffIndex];
    const r = rng(`${lang}-${D.id}-${level}-arrow`);
    const pool = eligible(D, lang);
    const cap = levelCap(D, level);
    let best = null;
    for (let attempt = 0; attempt < 70; attempt++) {
      const L = arrowLayout(shuffle(pool, r), r, GRID_W, GRID_H, cap, diffIndex === 2);
      const score = L.placed.length * 40 + L.letters * 3 + L.crossings * 12;
      if (!best || score > best.score) best = { score, L };
    }
    return finishGrid(best.L.placed, diffIndex, rng(`${lang}-${D.id}-${level}-icons`));
  }

  // Plan every level of one language together: each level takes the least-used words
  // first and none from the level just before it, so words repeat as little as possible.
  const REUSE_COST = 9;
  function planAll(lang, attempts = 80) {
    const usage = new Map();
    const levels = {};
    DIFFS.forEach((D, d) => {
      const pool = eligible(D, lang);
      let prev = new Set();
      for (let l = 1; l <= LEVELS; l++) {
        const r = rng(`${lang}-${D.id}-${l}-plan`);
        const cap = levelCap(D, l);
        let best = null;
        for (let attempt = 0; attempt < attempts; attempt++) {
          const order = shuffle(pool, r).filter((w) => !prev.has(w.key))
            .sort((a, b) => (usage.get(a.key) || 0) - (usage.get(b.key) || 0));
          const L = arrowLayout(order, r, GRID_W, GRID_H, cap, d === 2);
          // a word already used costs a little; one used often costs more
          const reuse = L.placed.reduce((s, w) => s + (usage.get(w.key) || 0), 0);
          const score = L.placed.length * 40 + L.letters * 3 + L.crossings * 12 - reuse * REUSE_COST;
          if (!best || score > best.score) best = { score, L };
        }
        const placed = best.L.placed;
        placed.forEach((w) => usage.set(w.key, (usage.get(w.key) || 0) + 1));
        prev = new Set(placed.map((w) => w.key));
        levels[`${lang}-${D.id}-${l}`] = placed.map((w) => [w.key, w.word, w.y, w.x, w.dir === "down" ? 1 : 0]);
      }
    });
    return levels;
  }

  // ---------------------------------------------------------- storage ---
  // Progress, unfinished games and the player's name belong to whoever is logged in;
  // a guest uses the plain keys. Everything else (language, sound…) is per phone.
  const raw = {
    get(k, d) { try { const v = localStorage.getItem("axw:" + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { if (v === null) localStorage.removeItem("axw:" + k); else localStorage.setItem("axw:" + k, JSON.stringify(v)); } catch (e) { /* storage off */ } }
  };
  const PER_PLAYER = /^(progress|save:|nickname)/;
  let currentUser = raw.get("currentUser", null);
  const scoped = (k) => (currentUser && PER_PLAYER.test(k) ? `u:${currentUser}:` : "") + k;
  const store = {
    get(k, d) { return raw.get(scoped(k), d); },
    set(k, v) { raw.set(scoped(k), v); }
  };

  // ------------------------------------------------------------- doodles ---
  function doodle(key, cls = "") {
    const inner = (key && window.ICONS && window.ICONS[key]) || "";
    return `<svg class="doodle ${cls}" viewBox="0 0 64 64" aria-hidden="true"><g filter="url(#gloss)" fill="none" stroke="#2c3e50" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${inner}</g></svg>`;
  }

  // -------------------------------------------------------------- state ---
  const $ = (s, el = document) => el.querySelector(s);
  const app = $("#app");
  let lang = store.get("lang", "as");
  let game = null;
  let timer = null;

  const t = () => T[lang];
  const fmtNum = (n) => (lang === "as" ? toAsNum(n) : String(n));
  const fmtTime = (s) => { const m = Math.floor(s / 60), ss = String(s % 60).padStart(2, "0"); return fmtNum(m + ":" + ss); };
  const progressAll = () => store.get("progress", {});

  // --------------------------------------------------------------- home ---
  let diff = store.get("diff", 0);
  const levelCache = new Map();
  function getLevel(d, l) {
    const k = lang + d + "-" + l;
    if (!levelCache.has(k)) levelCache.set(k, buildLevel(d, l, lang));
    return levelCache.get(k);
  }
  function cardIcon(d, l) {
    const pool = wordPool(lang).filter((w) => w.icon);
    return pool[Math.floor(rng(`${lang}-${d}-${l}-card`)() * pool.length)].icon;
  }
  const levelKey = (d, l) => `${lang}:${DIFFS[d].id}:${l}`;
  const isUnlocked = (d, l, prog) => l === 1 || !!prog[levelKey(d, l - 1)];

  const DEV = (window.APP_CONFIG && window.APP_CONFIG.developer) || "KBX Studios";
  const esc = (v) => String(v || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const cloudUser = () => (window.Cloud && Cloud.user) || null;
  // ------------------------------------------------------------ menu ---
  const CFG = window.APP_CONFIG || {};
  const M = {
    as: { menu: "মেনু", profile: "মোৰ প্ৰ'ফাইল", share: "শ্বেয়াৰ কৰক", rate: "ৰেটিং দিয়ক", about: "এপটোৰ বিষয়ে", developer: "নিৰ্মাতা",
      contact: "যোগাযোগ", privacy: "গোপনীয়তা নীতি", version: "সংস্কৰণ", back: "উভতি যাওক",
      aboutText: "শব্দজাল এটা অসমীয়া আৰু ইংৰাজী শব্দজাল খেল। সূত্ৰ আৰু ছবি চাই শব্দ ভৰাওক। সহজ, মধ্যম আৰু কঠিন — তিনিটা পৰ্যায়ত ২০টাকৈ স্তৰ, প্ৰতিটো স্তৰত ৩টা সহায়।",
      wordsCount: (n) => `${toAsNum(n)}টা শব্দ: পশু-পক্ষী, খাদ্য, প্ৰকৃতি, অসমৰ ইতিহাস, পৰম্পৰা, খেল, শিল্পী, চলচ্চিত্ৰ, বঁটা, সাধাৰণ জ্ঞান আৰু বহুতো।`,
      devText: "অসমীয়া ভাষা আৰু শিক্ষাৰ বাবে সৰল, সুন্দৰ এপ নিৰ্মাণ কৰা দল।", moreApps: "আমাৰ আন এপসমূহ",
      contactText: "পৰামৰ্শ, ভুল শব্দ বা নতুন শব্দৰ বাবে আমাক লিখক।", emailUs: "ইমেইল পঠিয়াওক", noEmail: "যোগাযোগৰ ইমেইল সোনকালে যোগ কৰা হ'ব।",
      shareText: "শব্দজাল — অসমীয়া আৰু ইংৰাজী শব্দজাল খেল খেলক!", copied: "লিংক কপি কৰা হ'ল",
      rateText: "খেলটো ভাল লাগিলে Play Store ত ৰেটিং দিয়ক। আপোনাৰ ৰেটিঙে আমাক সহায় কৰে।", rateNow: "এতিয়াই ৰেটিং দিয়ক",
      nickname: "আপোনাৰ নাম", save: "ছেভ কৰক", nameSaved: "নাম ছেভ হ'ল", hello: "নমস্কাৰ",
      username: "ব্যৱহাৰকাৰীৰ নাম (ইংৰাজীত)", confirmPw: "পাছৱৰ্ড পুনৰ লিখক", loggedInAs: "লগ ইন কৰা হৈছে:", loggedOut: "লগ আউট হ'ল",
      changePw: "পাছৱৰ্ড সলনি", oldPw: "পুৰণি পাছৱৰ্ড", newPw: "নতুন পাছৱৰ্ড", pwChanged: "পাছৱৰ্ড সলনি হ'ল", welcome: "স্বাগতম",
      localNote: "একাউণ্ট আৰু অগ্ৰগতি এই ফোনত সুৰক্ষিত থাকে। প্ৰতিজন খেলুৱৈৰ নিজা অগ্ৰগতি।",
      badUser: "নাম ৩–২৪টা ইংৰাজী আখৰ বা সংখ্যাৰ হ'ব লাগে", pwShort: "পাছৱৰ্ড অন্ততঃ ৪টা আখৰৰ হ'ব লাগে",
      userExists: "এই নামটো আগতে লোৱা হৈছে", badLogin: "নাম বা পাছৱৰ্ড ভুল", pwMismatch: "দুয়োটা পাছৱৰ্ড মিলা নাই", stats: "অগ্ৰগতি", solved: "সমাধান", stars: "তৰা", plays: "খেল",
      email: "ইমেইল", password: "পাছৱৰ্ড", signInBtn: "লগ ইন", signUpBtn: "নতুন একাউণ্ট", forgot: "পাছৱৰ্ড পাহৰিলে?",
      resetSent: "পাছৱৰ্ড সলনিৰ ইমেইল পঠিওৱা হ'ল", syncNow: "এতিয়া ছিংক কৰক", savedOnline: "অগ্ৰগতি অনলাইনত সুৰক্ষিত",
      needEmail: "ইমেইল আৰু পাছৱৰ্ড (অন্ততঃ ৬টা আখৰ) লিখক", orWord: "নাইবা" },
    en: { menu: "Menu", profile: "My profile", share: "Share", rate: "Rate us", about: "About", developer: "Developer",
      contact: "Contact", privacy: "Privacy policy", version: "Version", back: "Back",
      aboutText: "Shabdajal is an Assamese and English crossword game. Read the clue or look at the picture and fill in the word. Easy, Medium and Hard, with 20 levels each and 3 hints per level.",
      wordsCount: (n) => `${n} words: animals, food, nature, Assam history, traditions, sports, singers, films, awards, general knowledge and more.`,
      devText: "A small team making simple, friendly apps for the Assamese language and learning.", moreApps: "More apps from us",
      contactText: "Write to us with ideas, a wrong word, or words you would like added.", emailUs: "Send an email", noEmail: "A contact email will be added soon.",
      shareText: "Play Shabdajal — the Assamese & English crossword game!", copied: "Link copied",
      rateText: "Enjoying the game? Please rate it on the Play Store — it really helps.", rateNow: "Rate now",
      nickname: "Your name", save: "Save", nameSaved: "Name saved", hello: "Hello",
      username: "Username", confirmPw: "Confirm password", loggedInAs: "Logged in as", loggedOut: "Logged out",
      changePw: "Change password", oldPw: "Old password", newPw: "New password", pwChanged: "Password changed", welcome: "Welcome",
      localNote: "Accounts and progress are kept safely on this phone. Each player has their own progress.",
      badUser: "Username: 3–24 letters or numbers", pwShort: "Password must be at least 4 characters",
      userExists: "That username is taken", badLogin: "Wrong username or password", pwMismatch: "Passwords do not match", stats: "Progress", solved: "Solved", stars: "Stars", plays: "Plays",
      email: "Email", password: "Password", signInBtn: "Sign in", signUpBtn: "Create account", forgot: "Forgot password?",
      resetSent: "Password reset email sent", syncNow: "Sync now", savedOnline: "Progress saved online",
      needEmail: "Enter an email and a password of at least 6 characters", orWord: "or" }
  };
  const m = () => M[lang];
  const IS_APP = location.hostname === "appassets.androidplatform.net";
  const native = () => (window.AndroidApp || null);
  function openExternal(url) {
    if (!url) return;
    const n = native();
    if (n && n.openUrl) { n.openUrl(url); return; }
    const a = document.createElement("a"); a.href = url; a.target = "_blank"; a.rel = "noopener"; document.body.appendChild(a); a.click(); a.remove();
  }
  function showSheet(html, wire) {
    const sheet = $("#sheet");
    sheet.hidden = false;
    sheet.innerHTML = `<div class="sheet page">${html}</div>`;
    const close = () => {
      const nm = sheet.querySelector("#pName");
      if (nm) store.set("nickname", nm.value.trim());          // never lose a typed name
      sheet.hidden = true; sheet.innerHTML = "";
      if (!game) renderHome();
    };
    sheet.onclick = (e) => { if (e.target === sheet) close(); };
    sheet.querySelectorAll("[data-close]").forEach((b) => (b.onclick = close));
    sheet.querySelectorAll("[data-back]").forEach((b) => (b.onclick = openMenu));
    if (wire) wire(close);
  }
  const pageHead = (icon, title) => `<div class="page-head"><button class="icon-btn" data-back aria-label="${m().back}">‹</button><span class="page-icon">${icon}</span><b>${title}</b></div>`;

  function openMenu() {
    const items = [
      ["profile", "👤", m().profile], ["settings", "⚙️", t().settings], ["share", "📤", m().share], ["rate", "⭐", m().rate],
      ["about", "ℹ️", m().about], ["developer", "🧑‍💻", m().developer], ["contact", "✉️", m().contact], ["privacy", "🔒", m().privacy]
    ];
    showSheet(`<div class="sheet-head"><span class="gear-big">☰</span><div><b>${m().menu}</b><small>${t().appTitle} · ${m().version} ${CFG.version || "1.0.0"}</small></div></div>
      <div class="menu-grid">${items.map(([id, ic, label]) => `<button class="menu-item" data-go="${id}"><span>${ic}</span>${label}</button>`).join("")}</div>
      <button class="link" data-close>${t().close}</button>`, () => {
      document.querySelectorAll("[data-go]").forEach((b) => (b.onclick = () => {
        const go = b.dataset.go;
        if (go === "profile") openProfile();
        else if (go === "settings") openSettings();
        else if (go === "share") shareApp();
        else if (go === "rate") openRate();
        else if (go === "about") openAbout();
        else if (go === "developer") openDeveloper();
        else if (go === "contact") openContact();
        else if (go === "privacy") openExternal(IS_APP ? CFG.websiteUrl + "privacy.html" : "privacy.html");
      }));
    });
  }

  function openAbout() {
    const total = wordPool(lang).length;
    showSheet(`${pageHead("ℹ️", m().about)}
      <div class="about-art">${["tiger", "rhino", "japi", "tea"].map((i) => doodle(i, "about-ic")).join("")}</div>
      <h3 class="about-title">${t().appTitle}</h3>
      <p class="sheet-note">${m().aboutText}</p>
      <p class="sheet-note">${m().wordsCount(total)}</p>
      <p class="sheet-note small">${m().version} ${CFG.version || "1.0.0"} · © ${new Date().getFullYear()} ${esc(DEV)}</p>
      <button class="link" data-close>${t().close}</button>`);
  }
  function openDeveloper() {
    showSheet(`${pageHead("🧑‍💻", m().developer)}
      <div class="dev-card"><div class="dev-logo">KBX</div><div><b>${esc(DEV)}</b><small>${m().devText}</small></div></div>
      ${CFG.moreAppsUrl ? `<button class="big ghost" id="moreApps">📱 ${m().moreApps}</button>` : ""}
      <button class="big ghost" id="devContact">✉️ ${m().contact}</button>
      <button class="link" data-close>${t().close}</button>`, () => {
      if ($("#moreApps")) $("#moreApps").onclick = () => openExternal(CFG.moreAppsUrl);
      $("#devContact").onclick = openContact;
    });
  }
  function openContact() {
    const mail = CFG.contactEmail;
    showSheet(`${pageHead("✉️", m().contact)}
      <p class="sheet-note">${m().contactText}</p>
      ${mail ? `<p class="contact-mail">${esc(mail)}</p><button class="big" id="mailBtn">✉️ ${m().emailUs}</button>` : `<p class="sheet-note">${m().noEmail}</p>`}
      <button class="link" data-close>${t().close}</button>`, () => {
      if ($("#mailBtn")) $("#mailBtn").onclick = () =>
        openExternal(`mailto:${mail}?subject=${encodeURIComponent(t().appTitle + " " + (CFG.version || ""))}`);
    });
  }
  async function shareApp() {
    const url = IS_APP ? CFG.playStoreUrl : (CFG.websiteUrl || location.href);
    const text = `${m().shareText} ${url}`;
    const n = native();
    if (n && n.share) { n.share(text); return; }
    try { if (navigator.share) { await navigator.share({ title: t().appTitle, text: m().shareText, url }); return; } } catch (e) { return; }
    try { await navigator.clipboard.writeText(text); toast(m().copied); } catch (e) { toast(url); }
  }
  function openRate() {
    showSheet(`${pageHead("⭐", m().rate)}
      <div class="rate-stars">★★★★★</div>
      <p class="sheet-note">${m().rateText}</p>
      <button class="big" id="rateBtn">⭐ ${m().rateNow}</button>
      <button class="link" data-close>${t().close}</button>`, () => {
      $("#rateBtn").onclick = () => {
        const n = native();
        if (n && n.rate) n.rate(); else openExternal(CFG.playStoreUrl);
      };
    });
  }

  // ---------------------------------------------------- local accounts ---
  // Accounts kept on this phone: a username and a password (stored only as a salted
  // PBKDF2 hash). Each account has its own progress; logging out returns to the guest.
  const accountsAll = () => raw.get("accounts", {});
  const cleanUser = (u) => (u || "").trim().toLowerCase();
  const toHex = (buf) => Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  async function hashPassword(user, pw, saltHex) {
    const enc = new TextEncoder();
    try {
      const key = await crypto.subtle.importKey("raw", enc.encode(pw), "PBKDF2", false, ["deriveBits"]);
      const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: enc.encode(saltHex + user), iterations: 60000 }, key, 256);
      return "p2:" + toHex(bits);
    } catch (e) {
      // very old WebViews without Web Crypto: a simple salted hash
      let h = 2166136261;
      for (const ch of saltHex + user + pw + saltHex) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; }
      return "f1:" + h.toString(16);
    }
  }
  function randomSalt() {
    const b = new Uint8Array(16);
    try { crypto.getRandomValues(b); } catch (e) { for (let i = 0; i < 16; i++) b[i] = Math.floor(Math.random() * 256); }
    return toHex(b);
  }
  const Local = {
    get user() { return currentUser; },
    async create(username, name, pw) {
      const u = cleanUser(username);
      if (!/^[a-z0-9_.@-]{3,24}$/.test(u)) throw new Error("badUser");
      if (pw.length < 4) throw new Error("pwShort");
      const all = accountsAll();
      if (all[u]) throw new Error("userExists");
      const salt = randomSalt();
      all[u] = { salt, hash: await hashPassword(u, pw, salt), name: (name || "").trim() || u, created: Date.now() };
      raw.set("accounts", all);
      // a new account starts with the guest's progress, so nothing is lost
      for (const k of ["progress", "nickname"]) { const v = raw.get(k, null); if (v != null) raw.set(`u:${u}:${k}`, v); }
      raw.set(`u:${u}:nickname`, all[u].name);
      this.use(u);
    },
    async login(username, pw) {
      const u = cleanUser(username);
      const acc = accountsAll()[u];
      if (!acc || (await hashPassword(u, pw, acc.salt)) !== acc.hash) throw new Error("badLogin");
      this.use(u);
    },
    async changePassword(oldPw, newPw) {
      const u = currentUser, all = accountsAll(), acc = all[u];
      if (!acc || (await hashPassword(u, oldPw, acc.salt)) !== acc.hash) throw new Error("badLogin");
      if (newPw.length < 4) throw new Error("pwShort");
      acc.salt = randomSalt();
      acc.hash = await hashPassword(u, newPw, acc.salt);
      raw.set("accounts", all);
    },
    logout() { this.use(null); },
    use(u) {
      currentUser = u;
      raw.set("currentUser", u);
      levelCache.clear();
    }
  };

  // ---------------------------------------------------------- profile ---
  function accountBadge() {
    const u = cloudUser();
    if (u && u.photoURL) return `<img src="${esc(u.photoURL)}" alt="" referrerpolicy="no-referrer">`;
    const name = store.get("nickname", "") || (u && u.displayName) || "";
    if (name) return `<span class="initial">${esc(Array.from(name)[0])}</span>`;
    return `<span class="initial guest">👤</span>`;
  }
  function progressSummary() {
    const prog = progressAll();
    return ["as", "en"].map((L) => {
      const row = DIFFS.map((D) => {
        let solved = 0, stars = 0, plays = 0;
        for (let l = 1; l <= LEVELS; l++) { const p = prog[`${L}:${D.id}:${l}`]; if (p) { solved++; stars += p.stars || 0; plays += p.plays || 1; } }
        return { D, solved, stars, plays };
      });
      return { L, row };
    });
  }
  function openProfile() {
    const u = cloudUser();
    const configured = window.Cloud && Cloud.configured;
    const name = store.get("nickname", "") || (u && u.displayName) || "";
    const summary = progressSummary();
    const statRows = summary.map(({ L, row }) => `<div class="stat-block"><b>${L === "as" ? T.as.modeAs : T.en.modeEn}</b>
        ${row.map(({ D, solved, stars }) => `<div class="stat-row"><i class="dot" style="background:${D.color}"></i><span>${lang === "as" ? D.as : D.en}</span>
          <span class="bar"><span style="width:${Math.round((solved / LEVELS) * 100)}%;background:${D.color}"></span></span>
          <small>${fmtNum(solved)}/${fmtNum(LEVELS)} · ★${fmtNum(stars)}</small></div>`).join("")}</div>`).join("");
    let account;
    if (!configured && currentUser) account = `<p class="sheet-note ok-note">🔐 ${m().loggedInAs} <b>${esc(currentUser)}</b><br><small>${m().localNote}</small></p>
        <div class="row-btns"><button class="big ghost" id="lPw">🔑 ${m().changePw}</button><button class="big ghost" id="lOut">${t().signOut}</button></div>
        <form id="lPwForm" class="login-form" hidden>
          <input id="lOld" type="password" autocomplete="current-password" placeholder="${m().oldPw}">
          <input id="lNew" type="password" autocomplete="new-password" placeholder="${m().newPw}">
          <button class="big" type="submit">${m().save}</button>
        </form>`;
    else if (!configured) account = `<div class="seg" role="tablist"><button class="on" id="tabIn" type="button">${m().signInBtn}</button><button id="tabUp" type="button">${m().signUpBtn}</button></div>
        <form id="lForm" class="login-form" data-mode="in">
          <input id="lUser" autocomplete="username" autocapitalize="off" placeholder="${m().username}" required>
          <input id="lName" class="up-only" autocomplete="name" placeholder="${m().nickname}" hidden>
          <input id="lPass" type="password" autocomplete="current-password" placeholder="${m().password}" required>
          <input id="lPass2" class="up-only" type="password" autocomplete="new-password" placeholder="${m().confirmPw}" hidden>
          <button class="big" type="submit" id="lSubmit">${m().signInBtn}</button>
        </form>
        <p class="sheet-note small">${m().localNote}</p>`;
    else if (u) account = `<p class="sheet-note ok-note">☁️ ${m().savedOnline}<br><small>${esc(u.email || "")}</small></p>
        <div class="row-btns"><button class="big ghost" id="pSync">🔄 ${m().syncNow}</button><button class="big ghost" id="pOut">${t().signOut}</button></div>`;
    else account = `<p class="sheet-note">${t().loginInfo}</p>
        <form id="pForm" class="login-form">
          <input id="pEmail" type="email" autocomplete="email" placeholder="${m().email}" required>
          <input id="pPass" type="password" autocomplete="current-password" placeholder="${m().password}" minlength="6" required>
          <div class="row-btns"><button class="big" type="submit">${m().signInBtn}</button><button class="big ghost" type="button" id="pUp">${m().signUpBtn}</button></div>
          <button class="link" type="button" id="pForgot">${m().forgot}</button>
        </form>
        ${Cloud.googleAllowed ? `<div class="or">${m().orWord}</div><button class="big google" id="pGoogle"><span class="g">G</span> ${t().signIn}</button>` : ""}`;
    showSheet(`${pageHead("👤", m().profile)}
      <div class="profile-top"><span class="account-btn big-avatar">${accountBadge()}</span>
        <form class="name-edit" id="pNameForm"><input id="pName" value="${esc(name)}" placeholder="${m().nickname}" maxlength="24" enterkeyhint="done" autocomplete="nickname">
        <button class="link" type="submit" id="pNameSave">${m().save}</button></form></div>
      <h4>${m().stats}</h4>${statRows}
      <h4>${t().account}</h4>${account}
      <button class="link" data-close>${t().close}</button>`, () => {
      // the name is kept as you type, on Done/Enter, and when the page closes
      const saveName = (announce) => {
        const v = $("#pName") ? $("#pName").value.trim() : null;
        if (v === null || v === store.get("nickname", "")) return;
        store.set("nickname", v);
        const badge = document.querySelector(".profile-top .big-avatar"); if (badge) badge.innerHTML = accountBadge();
        if (cloudUser() && Cloud.updateName) Cloud.updateName(v).catch(() => {});
        if (announce) { feedback("ok"); toast(m().nameSaved); }
      };
      $("#pName").addEventListener("input", () => saveName(false));
      $("#pName").addEventListener("blur", () => saveName(false));
      $("#pNameForm").onsubmit = (e) => { e.preventDefault(); saveName(false); feedback("ok"); toast(m().nameSaved); $("#pName").blur(); };
      if ($("#pSync")) $("#pSync").onclick = () => syncCloud(true);
      if ($("#pOut")) $("#pOut").onclick = async () => { await Cloud.signOut(); openProfile(); };
      const creds = () => {
        const em = $("#pEmail").value, pw = $("#pPass").value;
        if (!em || pw.length < 6) { toast(m().needEmail); return null; }
        return [em, pw];
      };
      const fail = (e) => toast((e && e.code ? e.code.replace("auth/", "") + " · " : "") + t().loginFail);
      if ($("#pForm")) $("#pForm").onsubmit = async (e) => {
        e.preventDefault(); const c = creds(); if (!c) return;
        try { await Cloud.signInEmail(c[0], c[1]); openProfile(); } catch (err) { fail(err); }
      };
      if ($("#pUp")) $("#pUp").onclick = async () => {
        const c = creds(); if (!c) return;
        try { await Cloud.signUpEmail($("#pName").value || store.get("nickname", ""), c[0], c[1]); openProfile(); } catch (err) { fail(err); }
      };
      if ($("#pForgot")) $("#pForgot").onclick = async () => {
        const em = $("#pEmail").value; if (!em) { toast(m().needEmail); return; }
        try { await Cloud.resetPassword(em); toast(m().resetSent); } catch (err) { fail(err); }
      };
      if ($("#pGoogle")) $("#pGoogle").onclick = async () => { try { await Cloud.signIn(); openProfile(); } catch (err) { fail(err); } };
      // ---- accounts on this phone ----
      const lerr = (e) => { feedback("wrong"); toast(m()[e && e.message] || t().loginFail); };
      const setMode = (mode) => {
        $("#lForm").dataset.mode = mode;
        $("#tabIn").classList.toggle("on", mode === "in"); $("#tabUp").classList.toggle("on", mode === "up");
        document.querySelectorAll("#lForm .up-only").forEach((el) => (el.hidden = mode !== "up"));
        $("#lPass").autocomplete = mode === "up" ? "new-password" : "current-password";
        $("#lSubmit").textContent = mode === "up" ? m().signUpBtn : m().signInBtn;
      };
      if ($("#lForm")) {
        $("#tabIn").onclick = () => setMode("in");
        $("#tabUp").onclick = () => setMode("up");
        $("#lForm").onsubmit = async (e) => {
          e.preventDefault();
          const user = $("#lUser").value, pw = $("#lPass").value;
          try {
            if ($("#lForm").dataset.mode === "up") {
              if (pw !== $("#lPass2").value) throw new Error("pwMismatch");
              await Local.create(user, $("#lName").value || $("#pName").value, pw);
            } else await Local.login(user, pw);
            feedback("word"); toast(`${m().welcome}, ${store.get("nickname", "") || currentUser}!`);
            openProfile();
          } catch (err) { lerr(err); }
        };
      }
      if ($("#lOut")) $("#lOut").onclick = () => { Local.logout(); feedback("ok"); toast(m().loggedOut); openProfile(); };
      if ($("#lPw")) $("#lPw").onclick = () => { $("#lPwForm").hidden = !$("#lPwForm").hidden; };
      if ($("#lPwForm")) $("#lPwForm").onsubmit = async (e) => {
        e.preventDefault();
        try { await Local.changePassword($("#lOld").value, $("#lNew").value); feedback("ok"); toast(m().pwChanged); openProfile(); } catch (err) { lerr(err); }
      };
    });
  }
  async function syncCloud(showToast) {
    if (!cloudUser()) return;
    try {
      const merged = await Cloud.sync(progressAll());
      store.set("progress", merged);
      if (showToast) toast(t().synced);
      if (!game) renderHome();
    } catch (e) { console.warn("sync failed", e); }
  }

  function renderHome() {
    stopTimer();
    game = null;
    document.documentElement.lang = lang;
    const prog = progressAll();
    const D = DIFFS[diff];
    let solvedCount = 0, starCount = 0;
    const cards = [];
    for (let l = 1; l <= LEVELS; l++) {
      const p = prog[levelKey(diff, l)];
      if (p) { solvedCount++; starCount += p.stars; }
      const open = isUnlocked(diff, l, prog);
      const inProg = !p && open && store.get("save:" + levelKey(diff, l), null);
      const art = open ? doodle(cardIcon(diff, l), "card-art") : `<span class="lock">🔒</span>`;
      cards.push(`<button class="level-card${p ? " solved" : ""}${open ? "" : " locked"}" data-l="${l}" ${open ? "" : "disabled"}>
        <span class="num">${fmtNum(l)}</span>${art}
        <span class="stars">${[1, 2, 3].map((s) => `<i class="${p && s <= p.stars ? "on" : ""}">★</i>`).join("")}</span>
        ${p && p.best != null ? `<span class="card-best">⏱ ${fmtTime(p.best)}</span>` : ""}
        ${inProg ? `<span class="badge">…</span>` : ""}
      </button>`);
    }
    app.innerHTML = `
      <header class="home-head">
        <button class="gear-btn" id="menuBtn" aria-label="${M[lang].menu}">☰</button>
        <button class="account-btn" id="acct" aria-label="${t().account}">${accountBadge()}</button>
        <div class="logo">${["tiger", "rhino", "japi"].map((i) => doodle(i, "logo-art")).join("")}</div>
        <h1>${t().appTitle}</h1>
        <p class="sub">${store.get("nickname", "") ? `${m().hello}, <b>${esc(store.get("nickname", ""))}</b>!` : t().appSub}</p>
        <div class="mode" role="tablist">
          <button class="${lang === "as" ? "on" : ""}" data-lang="as" lang="as">${T.as.modeAs}</button>
          <button class="${lang === "en" ? "on" : ""}" data-lang="en">${T.en.modeEn}</button>
        </div>
      </header>
      <nav class="diffs">${DIFFS.map((d, i) => `<button class="${i === diff ? "on" : ""}" data-d="${i}" style="--dc:${d.color}">${lang === "as" ? d.as : d.en}</button>`).join("")}</nav>
      <p class="diff-stats" style="--dc:${D.color}">${t().levelWord} ${fmtNum(solvedCount)}/${fmtNum(LEVELS)} · ★ ${fmtNum(starCount)}/${fmtNum(LEVELS * 3)}</p>
      <main class="levels">${cards.join("")}</main>
      ${window.Ads ? Ads.slot("home") : ""}
      <footer class="credit">${t().credit} <b>${DEV}</b></footer>
      <div class="toast" id="toast"></div>
      <div class="sheet-back" id="sheet" hidden></div>`;
    $("#acct").onclick = openProfile;
    $("#menuBtn").onclick = openMenu;
    if (window.Ads) Ads.fill();
    app.querySelectorAll("[data-lang]").forEach((b) => b.addEventListener("click", () => { lang = b.dataset.lang; store.set("lang", lang); renderHome(); }));
    app.querySelectorAll("[data-d]").forEach((b) => b.addEventListener("click", () => { diff = +b.dataset.d; store.set("diff", diff); renderHome(); }));
    app.querySelectorAll(".level-card:not(.locked)").forEach((b) => b.addEventListener("click", () => startGame(diff, +b.dataset.l)));
  }

  // --------------------------------------------------------------- game ---
  function startGame(d, level, fresh) {
    const grid = getLevel(d, level);
    const saveKey = "save:" + levelKey(d, level);
    const sig = grid.words.map((w) => w.word + w.y + w.x + w.dir[0]).join("|");
    let saved = fresh ? null : store.get(saveKey, null);
    if (saved && saved.sig !== sig) saved = null; // the level's words have changed since

    const fill = grid.sol.map((row, y) => row.map((u, x) => (u == null ? null : (saved && saved.fill && saved.fill[y] && saved.fill[y][x]) || "")));
    game = {
      diff: d, level, grid, fill, saveKey, sig, seed: levelKey(d, level),
      revealed: new Set(saved ? saved.revealed || [] : []),
      given: new Set(saved ? saved.given || [] : []),
      hintsUsed: saved ? saved.hintsUsed || 0 : 0,
      seconds: saved ? saved.seconds || 0 : 0,
      shownMeaning: new Set(saved ? saved.shownMeaning || [] : []),
      active: 0, cursor: 0, wrong: new Set(), finished: false
    };
    if (!saved) placeGivenLetters();
    // start on the first unsolved word
    const firstOpen = grid.words.findIndex((w) => !wordSolved(w));
    game.active = firstOpen < 0 ? 0 : firstOpen;
    game.cursor = nextEmpty(grid.words[game.active], 0);
    renderGame();
    startTimer();
  }

  // Fill some letters in at the start, as classic arrow-word apps do. Every word keeps
  // at least half of its squares empty, so nothing is solved for the player.
  function placeGivenLetters() {
    const { grid } = game;
    const r = rng(game.seed + "-given");
    const cells = [];
    grid.sol.forEach((row, y) => row.forEach((u, x) => { if (u != null) cells.push([y, x]); }));
    const target = Math.round(cells.length * GIVEN_SHARE[game.diff]);
    const givenIn = (w) => w.cells.filter(([y, x]) => game.given.has(y + "," + x)).length;
    for (const [y, x] of shuffle(cells, r)) {
      if (game.given.size >= target) break;
      const k = y + "," + x;
      const ws = grid.words.filter((w) => w.cells.some(([a, b]) => a === y && b === x));
      if (ws.some((w) => givenIn(w) + 1 > Math.floor(w.cells.length / 2))) continue;
      game.given.add(k);
      game.revealed.add(k);
      game.fill[y][x] = grid.sol[y][x];
    }
  }

  function save() {
    if (!game || game.finished) return;
    store.set(game.saveKey, { sig: game.sig, given: [...game.given], fill: game.fill, revealed: [...game.revealed], hintsUsed: game.hintsUsed, seconds: game.seconds, shownMeaning: [...game.shownMeaning] });
  }

  function startTimer() {
    stopTimer();
    timer = setInterval(() => {
      if (!game || game.finished || document.hidden) return;
      game.seconds++;
      const el = $("#timer"); if (el) el.textContent = fmtTime(game.seconds);
      if (game.seconds % 5 === 0) save();
    }, 1000);
  }
  function stopTimer() { if (timer) clearInterval(timer); timer = null; }

  const wordSolved = (w) => w.cells.every(([y, x], j) => game.fill[y][x] === w.units[j]);
  const wordFull = (w) => w.cells.every(([y, x]) => game.fill[y][x]);
  function nextEmpty(w, from) {
    for (let j = from; j < w.cells.length; j++) { const [y, x] = w.cells[j]; if (!game.fill[y][x]) return j; }
    for (let j = 0; j < from; j++) { const [y, x] = w.cells[j]; if (!game.fill[y][x]) return j; }
    return Math.min(from, w.cells.length - 1);
  }

  function renderGame() {
    const { grid } = game;
    const n = grid.words.length;
    const D = DIFFS[game.diff];
    app.innerHTML = `
      <header class="bar">
        <button class="icon-btn" id="back" aria-label="${t().home}">‹</button>
        <div class="bar-title"><b>${t().levelWord} ${fmtNum(game.level)}</b><small><i class="dot" style="background:${D.color}"></i>${lang === "as" ? D.as : D.en} · ${fmtNum(n)}${t().words}</small></div>
        <span class="timer" id="timer">${fmtTime(game.seconds)}</span>
        <button class="icon-btn sound-btn" id="soundBtn" aria-label="${t().sound}">${fx.sound ? "🔊" : "🔇"}</button>
        <button class="hint-btn" id="hint">💡 <span id="hintCount">${fmtNum(MAX_HINTS - game.hintsUsed)}</span></button>
      </header>
      <section class="board-wrap"><div class="board" id="board"></div></section>
      <section class="clue-bar" id="clueBar"></section>
      <section class="tiles" id="tiles"></section>
      <div class="tools">
        <button id="checkBtn">✓ ${t().check}</button>
        <button id="typeBtn">⌨ ${t().type}</button>
        <button id="resetBtn">↺ ${t().reset}</button>
      </div>
      <div class="toast" id="toast"></div>
      <div class="sheet-back" id="sheet" hidden></div>`;
    $("#back").onclick = () => { save(); renderHome(); };
    $("#hint").onclick = openHintSheet;
    $("#soundBtn").onclick = () => { fx.sound = !fx.sound; store.set("sound", fx.sound); syncSoundBtn(); feedback("ok"); };
    $("#checkBtn").onclick = checkAll;
    $("#typeBtn").onclick = openTypeSheet;
    $("#resetBtn").onclick = () => { store.set(game.saveKey, null); startGame(game.diff, game.level, true); };
    drawBoard(); drawClue(); drawTiles();
  }

  function drawBoard() {
    const { grid } = game;
    const board = $("#board");
    const maxW = Math.min(window.innerWidth, 560) - 24 - 8;
    const size = Math.max(30, Math.min(56, Math.floor((maxW - (grid.w - 1) * 2) / grid.w)));
    board.style.setProperty("--cell", size + "px");
    board.style.gridTemplateColumns = `repeat(${grid.w}, var(--cell))`;
    const act = grid.words[game.active];
    const actSet = new Set(act.cells.map(([y, x]) => y + "," + x));
    const [cy, cx] = act.cells[game.cursor];
    const solvedSet = new Set();
    grid.words.forEach((w) => { if (wordSolved(w)) w.cells.forEach(([y, x]) => solvedSet.add(y + "," + x)); });
    const clueHalf = (id, d, half) => {
      const w = grid.words[id];
      const cls = ["clue-half", half, id === game.active ? "on" : "", wordSolved(w) ? "done" : ""].join(" ");
      const body = w.showIcon ? doodle(w.icon, "cell-art")
        : w.pattern ? `<span class="hint-word pattern" lang="${lang}">${esc(w.pattern)}</span>`
        : `<span class="hint-word" lang="${lang}">${esc(w.hint)}</span>`;
      return `<button class="${cls}" data-id="${id}" aria-label="${esc(w.hint)}">${body}<i class="arrow ${d}"></i></button>`;
    };
    let html = "";
    for (let y = 0; y < grid.h; y++) for (let x = 0; x < grid.w; x++) {
      const u = grid.sol[y][x], c = grid.clues[y][x];
      if (u != null) {
        const k = y + "," + x, v = game.fill[y][x];
        const cls = ["cell", actSet.has(k) ? "in-word" : "", y === cy && x === cx ? "cursor" : "", game.wrong.has(k) ? "wrong" : "",
          game.given.has(k) ? "given" : game.revealed.has(k) ? "revealed" : "", solvedSet.has(k) ? "ok" : "", v && v.length > 2 ? "long" : ""].join(" ");
        html += `<button class="${cls}" data-y="${y}" data-x="${x}"><span class="v">${v || ""}</span></button>`;
      } else if (c) {
        const both = c.across != null && c.down != null;
        html += `<div class="cell clue${both ? " two" : ""}">${c.across != null ? clueHalf(c.across, "across", both ? "top" : "full") : ""}${c.down != null ? clueHalf(c.down, "down", both ? "bottom" : "full") : ""}</div>`;
      } else html += `<div class="cell ${y === 0 || x === 0 ? "clue head" : "blank"}"></div>`;
    }
    board.innerHTML = html;
    board.querySelectorAll("button.cell").forEach((b) => {
      const y = +b.dataset.y, x = +b.dataset.x, v = game.fill[y][x];
      const tap = () => tapCell(y, x);
      if (v && !game.revealed.has(y + "," + x)) { b.classList.add("filled"); makeDrag(b, { u: v, from: [y, x] }, tap); }
      else b.addEventListener("click", tap);
    });
    board.querySelectorAll(".clue-half").forEach((b) => b.addEventListener("click", () => selectWord(+b.dataset.id)));
  }

  function tapCell(y, x) {
    const { words } = game.grid;
    const here = words.filter((w) => w.cells.some(([a, b]) => a === y && b === x));
    let w = here.find((wd) => wd.id === game.active);
    const cur = words[game.active].cells[game.cursor];
    if (w && here.length > 1 && cur[0] === y && cur[1] === x) w = here.find((wd) => wd.id !== game.active); // tap again to switch direction
    if (!w) w = here[0];
    game.active = w.id;
    game.cursor = w.cells.findIndex(([a, b]) => a === y && b === x);
    game.wrong.clear();
    refresh();
  }

  function selectWord(id) {
    if (fx.sound) try { SOUNDS.tap(); } catch (e) { /* audio blocked */ }
    game.active = id;
    game.cursor = nextEmpty(game.grid.words[id], 0);
    refresh();
  }

  function refresh() { drawBoard(); drawClue(); drawTiles(); }

  function drawClue() {
    const w = game.grid.words[game.active];
    const meaning = game.shownMeaning.has(w.id) ? `<span class="meaning">${t().meaning}: <b lang="${lang === "as" ? "en" : "as"}">${w.alt}</b></span>` : "";
    $("#clueBar").innerHTML = `
      <button class="nav" id="prevW" aria-label="previous">‹</button>
      <div class="clue-art ${wordSolved(w) ? "solved" : ""}${w.showIcon ? "" : " text"}">${w.showIcon ? doodle(w.icon, "big-art") : `<span class="big-hint" lang="${lang}">${esc(w.pattern || w.hint)}</span>`}</div>
      <div class="clue-info">
        <span class="clue-num">${w.dir === "across" ? t().across + " →" : t().down + " ↓"}</span>
        <span class="clue-len">${fmtNum(w.units.length)}${t().squares}</span>
        ${w.pattern ? `<span class="full-clue" lang="${lang}">${esc(w.hint)}</span>` : ""}
        ${w.clueText ? `<span class="full-clue" lang="${lang}">${esc(w.clueText)}</span>` : ""}
        ${meaning}
      </div>
      <button class="nav" id="nextW" aria-label="next">›</button>`;
    const n = game.grid.words.length;
    $("#prevW").onclick = () => selectWord((game.active - 1 + n) % n);
    $("#nextW").onclick = () => selectWord((game.active + 1) % n);
  }

  // Letter suggestions: the letters (or syllables) still missing from the
  // selected word, mixed with a few decoys, in a fixed shuffled order.
  // Letter suggestions: the letters (or syllables) still missing from the selected
  // word, well mixed with decoys. In Assamese the decoys are mostly look-alikes of the
  // answer's own syllables (কা → কি, কু, কো …), so short words are not easy to guess.
  const TILE_TOTAL = [6, 8, 9]; // tiles shown for a fresh word, by difficulty
  const AS_SIGNS = ["", "া", "ি", "ী", "ু", "ূ", "ে", "ৈ", "ো", "ৌ"];
  const AS_FILL = ["ক", "খ", "গ", "চ", "জ", "ত", "দ", "ন", "প", "ব", "ম", "ৰ", "ল", "স", "হ", "কা", "মি", "লু", "নে", "ৰো"];
  function lookAlikes(u) {
    const sign = AS_SIGNS.find((s) => s && u.endsWith(s)) || "";
    let base = sign ? u.slice(0, -sign.length) : u;
    base = base.replace(/[ঁ-ঃ]$/, ""); // drop ঁ ং ঃ
    const c = base.charCodeAt(0);
    if (!base || !((c >= 0x0995 && c <= 0x09B9) || c === 0x09DC || c === 0x09DD || c === 0x09DF || c === 0x09F0 || c === 0x09F1)) return [];
    return AS_SIGNS.map((s) => base + s).filter((v) => v !== u);
  }
  function makeDecoys(w, count, r) {
    const answer = new Set(w.units);
    const out = [];
    const add = (u) => { if (u && !answer.has(u) && !out.includes(u) && out.length < count) out.push(u); };
    if (lang === "as") {
      shuffle(w.units.flatMap(lookAlikes), r).slice(0, Math.ceil(count * 0.6)).forEach(add);
      shuffle([...new Set(game.grid.words.flatMap((x) => x.units))], r).forEach(add);
      shuffle(AS_FILL, r).forEach(add);
    } else {
      // English: letters that are easy to mix up with the answer's, then any letters
      const near = { A: "EO", E: "AI", I: "EY", O: "AU", U: "OI", B: "DP", D: "BT", M: "NW", N: "MH", R: "LP", S: "CZ", T: "LF", L: "IT", C: "GK", G: "CJ", P: "BR", H: "NK" };
      shuffle(w.units.flatMap((u) => (near[u] || "").split("")), r).forEach(add);
      shuffle("ABCDEFGHIJKLMNOPRSTUWY".split(""), r).forEach(add);
    }
    return out;
  }
  function drawTiles() {
    const w = game.grid.words[game.active];
    const r = rng(game.seed + "-" + w.id);
    const decoys = makeDecoys(w, Math.max(2, TILE_TOTAL[game.diff] - w.units.length), r);
    // shuffle until the answer's own tiles are not left in reading order
    let items = [];
    for (let tries = 0; tries < 12; tries++) {
      items = shuffle([...w.units.map((u, j) => ({ u, j })), ...decoys.map((u) => ({ u, j: -1 }))], r);
      const order = items.filter((it) => it.j >= 0).map((it) => it.j);
      if (order.length < 2 || order.some((v, i) => v !== i)) break;
    }
    const need = (j) => { const [y, x] = w.cells[j]; return game.fill[y][x] !== w.units[j]; };
    const show = wordSolved(w) ? [] : items.filter((it) => it.j < 0 || need(it.j));
    $("#tiles").innerHTML = (show.length
      ? show.map((it) => `<button class="tile" data-u="${it.u}">${it.u}</button>`).join("")
      : `<span class="tiles-done">✓</span>`) + `<button class="tile back" id="bk" aria-label="delete">⌫</button>`;
    $("#tiles").querySelectorAll(".tile[data-u]").forEach((b) => makeDrag(b, { u: b.dataset.u }, () => enter(b.dataset.u)));
    $("#bk").onclick = backspace;
  }

  // ---------------------------------------------------------- dragging ---
  // Drag a tile onto any square, or drag a placed letter to another square
  // (drop it off the board to remove it). A short tap still works as before.
  function makeDrag(el, info, onTap) {
    el.addEventListener("click", (e) => { if (e.detail === 0) onTap(); }); // keyboard
    el.addEventListener("pointerdown", (e) => {
      if (e.button > 0 || !game || game.finished) return;
      const sx = e.clientX, sy = e.clientY;
      let ghost = null, over = null;
      try { el.setPointerCapture(e.pointerId); } catch (err) { /* older browsers */ }
      const move = (ev) => {
        if (!ghost) {
          if (Math.hypot(ev.clientX - sx, ev.clientY - sy) < 8) return;
          ghost = document.createElement("div");
          ghost.className = "drag-ghost";
          ghost.textContent = info.u;
          document.body.appendChild(ghost);
          el.classList.add("dragging");
          feedback("pick");
        }
        ghost.style.left = ev.clientX + "px";
        ghost.style.top = ev.clientY + "px";
        const t = document.elementFromPoint(ev.clientX, ev.clientY);
        const c = t && t.closest ? t.closest("#board .cell[data-y]") : null;
        if (over && over !== c) over.classList.remove("drop");
        over = c;
        if (c) c.classList.add("drop");
      };
      const up = (ev) => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerup", up);
        el.removeEventListener("pointercancel", up);
        if (over) over.classList.remove("drop");
        if (!ghost) { if (ev.type === "pointerup") onTap(); return; }
        ghost.remove();
        el.classList.remove("dragging");
        if (ev.type === "pointercancel") return;
        dropUnit(info, over ? [+over.dataset.y, +over.dataset.x] : null);
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerup", up);
      el.addEventListener("pointercancel", up);
    });
  }

  function dropUnit(info, target) {
    const same = info.from && target && info.from[0] === target[0] && info.from[1] === target[1];
    if (same) return;
    if (target && game.revealed.has(target[0] + "," + target[1])) return; // hint squares are fixed
    if (info.from) { const [fy, fx] = info.from; game.fill[fy][fx] = ""; game.wrong.delete(fy + "," + fx); }
    if (!target) { feedback("clear"); refresh(); save(); return; }
    const [y, x] = target;
    feedback("place");
    game.fill[y][x] = info.u;
    game.wrong.delete(y + "," + x);
    const here = game.grid.words.filter((w) => w.cells.some(([a, b]) => a === y && b === x));
    const w = here.find((wd) => wd.id === game.active) || here[0];
    game.active = w.id;
    const j = w.cells.findIndex(([a, b]) => a === y && b === x);
    let nx = -1;
    for (let k = j + 1; k < w.cells.length; k++) { const [yy, xx] = w.cells[k]; if (!game.fill[yy][xx]) { nx = k; break; } }
    game.cursor = nx >= 0 ? nx : j;
    afterChange(w);
  }

  function enter(u) {
    if (!game || game.finished) return;
    const w = game.grid.words[game.active];
    let [y, x] = w.cells[game.cursor];
    // skip squares revealed by a hint
    let guard = 0;
    while (game.revealed.has(y + "," + x) && guard++ < w.cells.length) { game.cursor = (game.cursor + 1) % w.cells.length; [y, x] = w.cells[game.cursor]; }
    if (game.revealed.has(y + "," + x)) return;
    game.fill[y][x] = u;
    game.wrong.delete(y + "," + x);
    feedback("place");
    // move on to the next empty square of this word
    let nx = -1;
    for (let j = game.cursor + 1; j < w.cells.length; j++) { const [yy, xx] = w.cells[j]; if (!game.fill[yy][xx]) { nx = j; break; } }
    game.cursor = nx >= 0 ? nx : Math.min(game.cursor + 1, w.cells.length - 1);
    afterChange(w);
  }

  function backspace() {
    const w = game.grid.words[game.active];
    let [y, x] = w.cells[game.cursor];
    if (!game.fill[y][x] || game.revealed.has(y + "," + x)) {
      if (game.cursor > 0) game.cursor--;
      [y, x] = w.cells[game.cursor];
    }
    if (!game.revealed.has(y + "," + x) && game.fill[y][x]) { game.fill[y][x] = ""; feedback("clear"); }
    refresh(); save();
  }

  function afterChange(w) {
    save();
    if (game.grid.words.every(wordSolved)) return finish();
    if (wordSolved(w)) {
      feedback("word");
      if (game.grid.words.every(wordSolved)) return finish();
      // jump to the next unsolved word
      const ws = game.grid.words;
      for (let i = 1; i <= ws.length; i++) { const c = ws[(w.id + i) % ws.length]; if (!wordSolved(c)) { game.active = c.id; game.cursor = nextEmpty(c, 0); break; } }
    } else if (wordFull(w)) {
      feedback("wrong");
      toast(t().someWrong(w.cells.filter(([y, x], j) => game.fill[y][x] !== w.units[j]).length));
    }
    refresh();
  }

  function fillWord(text) {
    const w = game.grid.words[game.active];
    const units = splitUnits(text.trim(), lang);
    units.slice(0, w.cells.length).forEach((u, j) => { const [y, x] = w.cells[j]; if (!game.revealed.has(y + "," + x)) game.fill[y][x] = u; });
    game.cursor = Math.min(units.length, w.cells.length - 1);
    afterChange(w);
  }

  function checkAll() {
    game.wrong.clear();
    game.grid.sol.forEach((row, y) => row.forEach((u, x) => { const v = game.fill[y] && game.fill[y][x]; if (u != null && v && v !== u) game.wrong.add(y + "," + x); }));
    feedback(game.wrong.size ? "wrong" : "ok");
    toast(game.wrong.size ? t().someWrong(game.wrong.size) : t().allWrongOk);
    drawBoard();
  }

  // -------------------------------------------------------------- hints ---
  function openHintSheet() {
    const left = MAX_HINTS - game.hintsUsed;
    const w = game.grid.words[game.active];
    const sheet = $("#sheet");
    sheet.hidden = false;
    sheet.innerHTML = `<div class="sheet">
      <div class="sheet-head">${w.icon ? doodle(w.icon, "sheet-art") : `<span class="sheet-art text" lang="${lang}">${esc(w.hint)}</span>`}<div><b>${t().hints}</b><small>${left > 0 ? t().hintLeft(left) : t().noHints}</small></div></div>
      <div class="hint-dots">${[0, 1, 2].map((i) => `<i class="${i < left ? "on" : ""}">💡</i>`).join("")}</div>
      <button class="big" id="hCell" ${left <= 0 || wordSolved(w) ? "disabled" : ""}>🔍 ${t().revealCell}</button>
      <button class="big" id="hMean" ${left <= 0 || game.shownMeaning.has(w.id) ? "disabled" : ""}>🌐 ${t().showMeaning}</button>
      <button class="link" id="hClose">${t().cancel}</button></div>`;
    const close = () => { sheet.hidden = true; sheet.innerHTML = ""; };
    sheet.onclick = (e) => { if (e.target === sheet) close(); };
    $("#hClose").onclick = close;
    $("#hCell").onclick = () => { close(); revealCell(); };
    $("#hMean").onclick = () => { close(); game.shownMeaning.add(w.id); useHint(); refresh(); };
  }
  function useHint() { feedback("hint"); game.hintsUsed = Math.min(MAX_HINTS, game.hintsUsed + 1); $("#hintCount").textContent = fmtNum(MAX_HINTS - game.hintsUsed); save(); }
  function revealCell() {
    const w = game.grid.words[game.active];
    let j = w.cells.findIndex(([y, x], i) => i >= game.cursor && game.fill[y][x] !== w.units[i]);
    if (j < 0) j = w.cells.findIndex(([y, x], i) => game.fill[y][x] !== w.units[i]);
    if (j < 0) return;
    const [y, x] = w.cells[j];
    game.fill[y][x] = w.units[j];
    game.revealed.add(y + "," + x);
    game.wrong.delete(y + "," + x);
    game.cursor = nextEmpty(w, j);
    useHint();
    afterChange(w);
  }

  // ------------------------------------------------------- type sheet ---
  function openTypeSheet() {
    const w = game.grid.words[game.active];
    const sheet = $("#sheet");
    sheet.hidden = false;
    sheet.innerHTML = `<form class="sheet" id="typeForm">
      <div class="sheet-head">${w.icon ? doodle(w.icon, "sheet-art") : `<span class="sheet-art text" lang="${lang}">${esc(w.hint)}</span>`}<div><b>${w.dir === "across" ? t().across + " →" : t().down + " ↓"}</b><small>${fmtNum(w.units.length)}${t().squares}</small></div></div>
      <input id="typeIn" autocomplete="off" autocapitalize="${lang === "en" ? "characters" : "off"}" placeholder="${t().typePh}" lang="${lang}">
      <button class="big" type="submit">${t().fill}</button>
      <button class="link" type="button" id="tClose">${t().cancel}</button></form>`;
    const close = () => { sheet.hidden = true; sheet.innerHTML = ""; };
    sheet.onclick = (e) => { if (e.target === sheet) close(); };
    $("#tClose").onclick = close;
    $("#typeForm").onsubmit = (e) => { e.preventDefault(); const v = $("#typeIn").value; close(); if (v.trim()) fillWord(v); };
    setTimeout(() => $("#typeIn") && $("#typeIn").focus(), 50);
  }

  // ------------------------------------------------------------- finish ---
  function finish() {
    game.finished = true;
    stopTimer();
    const stars = game.hintsUsed === 0 ? 3 : game.hintsUsed < MAX_HINTS ? 2 : 1;
    const k = levelKey(game.diff, game.level);
    const prog = progressAll();
    const prev = prog[k];
    const newBest = !!prev && game.seconds < prev.best;           // beat their own record
    prog[k] = { stars: Math.max(stars, prev ? prev.stars : 0), best: prev ? Math.min(prev.best, game.seconds) : game.seconds,
      plays: ((prev && prev.plays) || 0) + 1, at: Date.now() };
    store.set("progress", prog);
    store.set(game.saveKey, null);
    syncCloud(false);
    refresh();
    feedback(newBest ? "record" : "win");
    confetti(newBest ? 140 : 80);
    const sheet = $("#sheet");
    sheet.hidden = false;
    const hasNext = game.level < LEVELS;
    sheet.innerHTML = `<div class="sheet win">
      <div class="confetti">${["star", "flower", "butterfly", "sun", "star"].map((i) => doodle(i, "conf-art")).join("")}</div>
      ${newBest ? `<div class="record"><span class="trophy">🏆</span><b>${t().newBest}</b><small>${t().previous}: <s>${fmtTime(prev.best)}</s> → ${fmtTime(game.seconds)}</small></div>` : ""}
      <h2>${t().done}</h2>
      <div class="stars big-stars">${[1, 2, 3].map((s) => `<i class="${s <= stars ? "on" : ""}">★</i>`).join("")}</div>
      <p>${t().solvedIn}: <b>${fmtTime(game.seconds)}</b> · ${t().hintsUsed}: <b>${fmtNum(game.hintsUsed)}</b></p>
      <p class="best-line">⏱ ${t().bestTime}: <b>${fmtTime(prog[k].best)}</b>${!prev ? ` · ${t().firstClear}` : ""}</p>
      ${hasNext ? `<button class="big" id="wNext">${t().next} ›</button>` : ""}
      <button class="big ghost" id="wAgain">${t().again}</button>
      <button class="link" id="wHome">${t().home}</button>
      ${window.Ads ? Ads.slot("win") : ""}</div>`;
    if (window.Ads) Ads.fill();
    if (hasNext) $("#wNext").onclick = () => startGame(game.diff, game.level + 1, true);
    else if (game.diff < DIFFS.length - 1) { diff = game.diff + 1; store.set("diff", diff); }
    $("#wAgain").onclick = () => startGame(game.diff, game.level, true);
    $("#wHome").onclick = renderHome;
  }

  // ------------------------------------------------------------- misc ---
  let toastT = null;
  function toast(msg) { const el = $("#toast"); if (!el) return; el.textContent = msg; el.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove("show"), 1800); }
  // ------------------------------------------------- sound & vibration ---
  // Short effects synthesised with Web Audio (no sound files, works offline).
  const fx = { ctx: null, sound: store.get("sound", true), vib: store.get("vib", true) };
  function audio() {
    if (!fx.ctx) { const A = window.AudioContext || window.webkitAudioContext; if (!A) return null; fx.ctx = new A(); }
    if (fx.ctx.state === "suspended") fx.ctx.resume();
    return fx.ctx;
  }
  function tone(freq, dur, { type = "sine", vol = 0.12, at = 0, to = null } = {}) {
    const c = audio(); if (!c) return;
    const t0 = c.currentTime + at, o = c.createOscillator(), g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    if (to) o.frequency.exponentialRampToValueAtTime(to, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(c.destination);
    o.start(t0); o.stop(t0 + dur + 0.02);
  }
  const SOUNDS = {
    tap: () => tone(520, 0.05, { type: "triangle", vol: 0.06 }),
    pick: () => tone(440, 0.06, { type: "triangle", vol: 0.08, to: 620 }),
    place: () => { tone(700, 0.06, { type: "triangle", vol: 0.1 }); tone(1050, 0.05, { vol: 0.05, at: 0.03 }); },
    clear: () => tone(380, 0.08, { type: "triangle", vol: 0.07, to: 240 }),
    word: () => [1047, 1319, 1568].forEach((f, i) => tone(f, 0.28, { vol: 0.11, at: i * 0.08 })),
    wrong: () => { tone(200, 0.16, { type: "square", vol: 0.045, to: 140 }); tone(150, 0.2, { type: "square", vol: 0.04, at: 0.12, to: 110 }); },
    hint: () => [1568, 2093, 2637].forEach((f, i) => tone(f, 0.18, { vol: 0.07, at: i * 0.06 })),
    // level finished: a short brass-like fanfare, a final chord and a little applause
    win: () => {
      [[523, 0], [523, 0.12], [523, 0.24], [659, 0.36], [784, 0.6], [659, 0.78], [784, 0.9]].forEach(([f, at]) =>
        tone(f, 0.2, { type: "square", vol: 0.05, at }));
      [523, 659, 784, 1047].forEach((f) => tone(f, 1.2, { type: "triangle", vol: 0.08, at: 1.05 }));
      sparkle(1.1, 8);
      applause(1.0, 1.6);
    },
    // new best time: the fanfare, then a rising run and bells
    record: () => {
      SOUNDS.win();
      [784, 988, 1175, 1568, 1976, 2349].forEach((f, i) => tone(f, 0.25, { vol: 0.08, at: 2.2 + i * 0.07 }));
      [2093, 2637, 3136].forEach((f) => tone(f, 1.0, { vol: 0.05, at: 2.65 }));
      sparkle(2.6, 14);
    },
    ok: () => tone(880, 0.12, { vol: 0.08 })
  };
  const VIBES = { place: 8, pick: 5, clear: 12, word: 35, wrong: [40, 50, 40], hint: 18, win: [40, 60, 40, 60, 90], ok: 15,
    record: [60, 60, 60, 60, 60, 60, 200] };
  function sparkle(at, n) { for (let i = 0; i < n; i++) tone(1800 + Math.random() * 1600, 0.12, { vol: 0.035, at: at + i * 0.07 }); }
  // soft clapping: short bursts of filtered noise
  function applause(at, dur) {
    const c = audio(); if (!c) return;
    const len = Math.floor(c.sampleRate * dur), buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    let env = 0;
    for (let i = 0; i < len; i++) {
      if (Math.random() < 0.0016) env = 1;                    // a clap
      env *= 0.9965;
      const fade = Math.min(1, i / (len * 0.15)) * Math.min(1, (len - i) / (len * 0.4));
      d[i] = (Math.random() * 2 - 1) * (0.15 + env) * fade;
    }
    const src = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    src.buffer = buf; f.type = "bandpass"; f.frequency.value = 1600; f.Q.value = 0.7; g.gain.value = 0.09;
    src.connect(f).connect(g).connect(c.destination);
    src.start(c.currentTime + at);
  }
  // falling confetti over the page
  function confetti(n) {
    const box = document.createElement("div");
    box.className = "confetti-rain";
    const colors = ["#3d7be0", "#ffb400", "#34c06a", "#ef5b5b", "#a77bd4", "#f7a541"];
    for (let i = 0; i < n; i++) {
      const p = document.createElement("i");
      p.style.left = Math.random() * 100 + "%";
      p.style.background = colors[i % colors.length];
      p.style.animationDelay = Math.random() * 0.8 + "s";
      p.style.animationDuration = 2.2 + Math.random() * 1.8 + "s";
      p.style.transform = `rotate(${Math.random() * 360}deg)`;
      box.appendChild(p);
    }
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 5000);
  }
  function feedback(name) {
    if (fx.sound && SOUNDS[name]) { try { SOUNDS[name](); } catch (e) { /* audio blocked */ } }
    if (fx.vib && VIBES[name]) { try { if (navigator.vibrate) navigator.vibrate(VIBES[name]); } catch (e) { /* no vibration */ } }
  }
  function openSettings() {
    const sheet = $("#sheet");
    sheet.hidden = false;
    const row = (id, icon, label, on) => `<button class="toggle-row" id="${id}" role="switch" aria-checked="${on}">
        <span class="t-icon">${icon}</span><span class="t-label">${label}</span><span class="switch ${on ? "on" : ""}"><i></i></span></button>`;
    const draw = () => {
      sheet.innerHTML = `<div class="sheet"><div class="sheet-head"><span class="gear-big">⚙️</span><div><b>${t().settings}</b></div></div>
        ${row("sSound", fx.sound ? "🔊" : "🔇", t().sound, fx.sound)}
        ${row("sVib", "📳", t().vibration, fx.vib)}
        <button class="link" id="sClose">${t().close}</button></div>`;
      $("#sSound").onclick = () => { fx.sound = !fx.sound; store.set("sound", fx.sound); feedback("ok"); draw(); syncSoundBtn(); };
      $("#sVib").onclick = () => { fx.vib = !fx.vib; store.set("vib", fx.vib); feedback("ok"); draw(); };
      $("#sClose").onclick = close;
    };
    const close = () => { sheet.hidden = true; sheet.innerHTML = ""; };
    sheet.onclick = (e) => { if (e.target === sheet) close(); };
    draw();
  }
  function syncSoundBtn() { const b = $("#soundBtn"); if (b) b.textContent = fx.sound ? "🔊" : "🔇"; }

  document.addEventListener("keydown", (e) => {
    if (!game || game.finished || !$("#sheet") || !$("#sheet").hidden) return;
    if (e.key === "Backspace") { e.preventDefault(); backspace(); }
    else if (e.key === "ArrowRight" || e.key === "ArrowDown") { const w = game.grid.words[game.active]; game.cursor = Math.min(game.cursor + 1, w.cells.length - 1); refresh(); }
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { game.cursor = Math.max(game.cursor - 1, 0); refresh(); }
    else if (e.key === "Enter") { const n = game.grid.words.length; selectWord((game.active + 1) % n); }
    else if (lang === "en" && /^[a-zA-Z]$/.test(e.key)) enter(e.key.toUpperCase());
  });
  window.addEventListener("resize", () => { if (game) drawBoard(); });
  document.addEventListener("visibilitychange", () => { if (document.hidden) save(); });

  // expose for tests
  // Running inside the Android app (files packed in the APK)?
  const IN_APP = location.hostname === "appassets.androidplatform.net";
  // Android back button: close an open sheet, else leave the game; false = let the app close
  function goBack() {
    const sh = $("#sheet");
    if (sh && !sh.hidden) {
      const nm = sh.querySelector("#pName");
      if (nm) store.set("nickname", nm.value.trim());
      sh.hidden = true; sh.innerHTML = "";
      if (!game) renderHome();
      return true;
    }
    if (game) { save(); renderHome(); return true; }
    return false;
  }
  window.AXW = { splitUnits, buildLevel, buildLevelLive, planAll, DIFFS, LEVELS, back: goBack, inApp: IN_APP };

  if (app) renderHome();
  if (window.Cloud && Cloud.configured) {
    Cloud.onChange((u) => {
      if (u) syncCloud(true); else if (!game) renderHome();
      const sh = $("#sheet"); if (sh && !sh.hidden && sh.querySelector("#pName")) openProfile();
    });
    Cloud.init();
  }
  // offline cache for the website only; the Android app already has every file inside it
  if (!IN_APP && "serviceWorker" in navigator && location.protocol === "https:") {
    try { navigator.serviceWorker.register("sw.js").catch(() => {}); } catch (e) { /* not available */ }
  }
})();
