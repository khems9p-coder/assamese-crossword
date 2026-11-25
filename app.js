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
      notSetup: "লগ ইন সুবিধা সোনকালে আহিছে। এতিয়া অগ্ৰগতি এই ফোনতে ছেভ হৈ থাকে।", signedAs: "লগ ইন কৰা হৈছে", loginFail: "লগ ইন হ'ব নোৱাৰিলে", words: "টা শব্দ", clues: "ছবি সূত্ৰ"
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
      notSetup: "Sign-in is coming soon. For now your progress is saved on this phone.", signedAs: "Signed in as", loginFail: "Could not sign in", words: " words", clues: "Picture clues"
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
      // hugging the board edge keeps the board tidy
      if (y - dy === 0 || x - dx === 0) t += 1;
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
  const DIFFS = [
    { id: "easy", as: "সহজ", en: "Easy", cap: 12, minLen: { as: 2, en: 3 }, maxLen: { as: 3, en: 5 }, decoys: 1, color: "#7cc576" },
    { id: "medium", as: "মধ্যম", en: "Medium", cap: 15, minLen: { as: 2, en: 3 }, maxLen: { as: 4, en: 7 }, decoys: 2, color: "#f7a541" },
    { id: "hard", as: "কঠিন", en: "Hard", cap: 19, minLen: { as: 2, en: 3 }, maxLen: { as: 7, en: 9 }, decoys: 3, color: "#ef5b5b" }
  ];
  const LEVELS = 20;

  function wordPool(lang) {
    const seen = new Set(), out = [];
    for (const th of window.THEMES) for (const [icon, as, en] of th.words) {
      if (seen.has(icon)) continue;
      seen.add(icon);
      const word = lang === "as" ? as : en;
      out.push({ icon, word, alt: lang === "as" ? en : as, units: splitUnits(word, lang) });
    }
    return out;
  }

  function buildLevel(diffIndex, level, lang) {
    const D = DIFFS[diffIndex];
    const r = rng(`${lang}-${D.id}-${level}-arrow`);
    const pool = wordPool(lang).filter((it) => it.units.length >= D.minLen[lang] && it.units.length <= D.maxLen[lang]);
    // later levels in a difficulty get a few more words
    const cap = D.cap - 3 + Math.round((3 * (level - 1)) / (LEVELS - 1));
    let best = null;
    for (let attempt = 0; attempt < 70; attempt++) {
      const order = shuffle(pool, r);
      const L = arrowLayout(order, r, GRID_W, GRID_H, cap, diffIndex === 2);
      const score = L.placed.length * 40 + L.letters * 3 + L.crossings * 12;
      if (!best || score > best.score) best = { score, L };
    }
    const { L } = best;
    // reading order: top to bottom, left to right; across before down
    const words = L.placed.slice().sort((a, b) => a.y - b.y || a.x - b.x || (a.dir === "across" ? -1 : 1));
    words.forEach((wd, i) => {
      wd.id = i;
      wd.cells = wd.units.map((_, j) => [wd.y + (wd.dir === "down" ? j : 0), wd.x + (wd.dir === "across" ? j : 0)]);
      wd.clue = wd.dir === "down" ? [wd.y - 1, wd.x] : [wd.y, wd.x - 1];
    });
    const sol = Array.from({ length: GRID_H }, () => Array(GRID_W).fill(null));
    const clues = Array.from({ length: GRID_H }, () => Array(GRID_W).fill(null));
    words.forEach((wd) => {
      wd.cells.forEach(([y, x], j) => (sol[y][x] = wd.units[j]));
      const [cy, cx] = wd.clue;
      clues[cy][cx] = clues[cy][cx] || {};
      clues[cy][cx][wd.dir] = wd.id;
    });
    return { w: GRID_W, h: GRID_H, sol, clues, words };
  }

  // ---------------------------------------------------------- storage ---
  const store = {
    get(k, d) { try { const v = localStorage.getItem("axw:" + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("axw:" + k, JSON.stringify(v)); } catch (e) { /* storage off */ } }
  };

  // ------------------------------------------------------------- doodles ---
  function doodle(key, cls = "") {
    const inner = (window.ICONS && window.ICONS[key]) || "";
    return `<svg class="doodle ${cls}" viewBox="0 0 64 64" aria-hidden="true"><g filter="url(#wobble)" fill="none" stroke="#33302e" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${inner}</g></svg>`;
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
    const pool = wordPool(lang);
    return pool[Math.floor(rng(`${lang}-${d}-${l}-card`)() * pool.length)].icon;
  }
  const levelKey = (d, l) => `${lang}:${DIFFS[d].id}:${l}`;
  const isUnlocked = (d, l, prog) => l === 1 || !!prog[levelKey(d, l - 1)];

  const DEV = (window.APP_CONFIG && window.APP_CONFIG.developer) || "KBX Studios";
  const esc = (v) => String(v || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const cloudUser = () => (window.Cloud && Cloud.user) || null;
  function accountBadge() {
    const u = cloudUser();
    if (u && u.photoURL) return `<img src="${esc(u.photoURL)}" alt="" referrerpolicy="no-referrer">`;
    if (u) return `<span class="initial">${esc((u.displayName || "?")[0])}</span>`;
    return `<span class="initial guest">👤</span>`;
  }
  function openAccountSheet() {
    const u = cloudUser();
    const sheet = $("#sheet");
    sheet.hidden = false;
    const configured = window.Cloud && Cloud.configured;
    sheet.innerHTML = `<div class="sheet">
      <div class="sheet-head"><span class="account-btn big-avatar">${accountBadge()}</span><div><b>${u ? esc(u.displayName || u.email) : t().guest}</b><small>${u ? t().signedAs + " · " + esc(u.email || "") : t().account}</small></div></div>
      <p class="sheet-note">${configured ? t().loginInfo : t().notSetup}</p>
      ${u ? `<button class="big ghost" id="aOut">${t().signOut}</button>`
          : `<button class="big google" id="aIn" ${configured ? "" : "disabled"}><span class="g">G</span> ${t().signIn}</button>`}
      <button class="link" id="aClose">${t().cancel}</button></div>`;
    const close = () => { sheet.hidden = true; sheet.innerHTML = ""; };
    sheet.onclick = (e) => { if (e.target === sheet) close(); };
    $("#aClose").onclick = close;
    if ($("#aIn")) $("#aIn").onclick = async () => { try { await Cloud.signIn(); close(); } catch (e) { toast(t().loginFail); } };
    if ($("#aOut")) $("#aOut").onclick = async () => { await Cloud.signOut(); close(); renderHome(); };
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
        ${inProg ? `<span class="badge">…</span>` : ""}
      </button>`);
    }
    app.innerHTML = `
      <header class="home-head">
        <button class="account-btn" id="acct" aria-label="${t().account}">${accountBadge()}</button>
        <div class="logo">${["tiger", "rhino", "japi"].map((i) => doodle(i, "logo-art")).join("")}</div>
        <h1>${t().appTitle}</h1>
        <p class="sub">${t().appSub}</p>
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
    $("#acct").onclick = openAccountSheet;
    if (window.Ads) Ads.fill();
    app.querySelectorAll("[data-lang]").forEach((b) => b.addEventListener("click", () => { lang = b.dataset.lang; store.set("lang", lang); renderHome(); }));
    app.querySelectorAll("[data-d]").forEach((b) => b.addEventListener("click", () => { diff = +b.dataset.d; store.set("diff", diff); renderHome(); }));
    app.querySelectorAll(".level-card:not(.locked)").forEach((b) => b.addEventListener("click", () => startGame(diff, +b.dataset.l)));
  }

  // --------------------------------------------------------------- game ---
  function startGame(d, level, fresh) {
    const grid = getLevel(d, level);
    const saveKey = "save:" + levelKey(d, level);
    const saved = fresh ? null : store.get(saveKey, null);
    const fill = grid.sol.map((row, y) => row.map((u, x) => (u == null ? null : (saved && saved.fill && saved.fill[y] && saved.fill[y][x]) || "")));
    game = {
      diff: d, level, grid, fill, saveKey, seed: levelKey(d, level),
      revealed: new Set(saved ? saved.revealed || [] : []),
      hintsUsed: saved ? saved.hintsUsed || 0 : 0,
      seconds: saved ? saved.seconds || 0 : 0,
      shownMeaning: new Set(saved ? saved.shownMeaning || [] : []),
      active: 0, cursor: 0, wrong: new Set(), finished: false
    };
    // start on the first unsolved word
    const firstOpen = grid.words.findIndex((w) => !wordSolved(w));
    game.active = firstOpen < 0 ? 0 : firstOpen;
    game.cursor = nextEmpty(grid.words[game.active], 0);
    renderGame();
    startTimer();
  }

  function save() {
    if (!game || game.finished) return;
    store.set(game.saveKey, { fill: game.fill, revealed: [...game.revealed], hintsUsed: game.hintsUsed, seconds: game.seconds, shownMeaning: [...game.shownMeaning] });
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
    $("#checkBtn").onclick = checkAll;
    $("#typeBtn").onclick = openTypeSheet;
    $("#resetBtn").onclick = () => { store.set(game.saveKey, null); startGame(game.diff, game.level, true); };
    drawBoard(); drawClue(); drawTiles();
  }

  function drawBoard() {
    const { grid } = game;
    const board = $("#board");
    const maxW = Math.min(window.innerWidth, 560) - 24 - 4;
    const size = Math.max(30, Math.min(58, Math.floor((maxW - (grid.w - 1) * 2) / grid.w)));
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
      return `<button class="${cls}" data-id="${id}" aria-label="${d === "across" ? t().across : t().down}">${doodle(w.icon, "cell-art")}<i class="arrow ${d}"></i></button>`;
    };
    let html = "";
    for (let y = 0; y < grid.h; y++) for (let x = 0; x < grid.w; x++) {
      const u = grid.sol[y][x], c = grid.clues[y][x];
      if (u != null) {
        const k = y + "," + x, v = game.fill[y][x];
        const cls = ["cell", actSet.has(k) ? "in-word" : "", y === cy && x === cx ? "cursor" : "", game.wrong.has(k) ? "wrong" : "",
          game.revealed.has(k) ? "revealed" : "", solvedSet.has(k) ? "ok" : "", v && v.length > 2 ? "long" : ""].join(" ");
        html += `<button class="${cls}" data-y="${y}" data-x="${x}"><span class="v">${v || ""}</span></button>`;
      } else if (c) {
        const both = c.across != null && c.down != null;
        html += `<div class="cell clue${both ? " two" : ""}">${c.across != null ? clueHalf(c.across, "across", both ? "top" : "full") : ""}${c.down != null ? clueHalf(c.down, "down", both ? "bottom" : "full") : ""}</div>`;
      } else html += `<div class="cell blank"></div>`;
    }
    board.innerHTML = html;
    board.querySelectorAll("button.cell").forEach((b) => b.addEventListener("click", () => tapCell(+b.dataset.y, +b.dataset.x)));
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
      <div class="clue-art ${wordSolved(w) ? "solved" : ""}">${doodle(w.icon, "big-art")}</div>
      <div class="clue-info">
        <span class="clue-num">${w.dir === "across" ? t().across + " →" : t().down + " ↓"}</span>
        <span class="clue-len">${fmtNum(w.units.length)}${t().squares}</span>
        ${meaning}
      </div>
      <button class="nav" id="nextW" aria-label="next">›</button>`;
    const n = game.grid.words.length;
    $("#prevW").onclick = () => selectWord((game.active - 1 + n) % n);
    $("#nextW").onclick = () => selectWord((game.active + 1) % n);
  }

  // Letter suggestions: the letters (or syllables) still missing from the
  // selected word, mixed with a few decoys, in a fixed shuffled order.
  function drawTiles() {
    const w = game.grid.words[game.active];
    const D = DIFFS[game.diff];
    const r = rng(game.seed + "-" + w.id);
    const pool = [...new Set(game.grid.words.flatMap((x) => x.units))].filter((u) => !w.units.includes(u));
    let decoys = shuffle(pool, r).slice(0, D.decoys);
    if (lang === "en") while (decoys.length < D.decoys) { const c = String.fromCharCode(65 + Math.floor(r() * 26)); if (!w.units.includes(c) && !decoys.includes(c)) decoys.push(c); }
    const items = shuffle([...w.units.map((u, j) => ({ u, j })), ...decoys.map((u) => ({ u, j: -1 }))], r);
    const need = (j) => { const [y, x] = w.cells[j]; return game.fill[y][x] !== w.units[j]; };
    const show = wordSolved(w) ? [] : items.filter((it) => it.j < 0 || need(it.j));
    $("#tiles").innerHTML = (show.length
      ? show.map((it) => `<button class="tile" data-u="${it.u}">${it.u}</button>`).join("")
      : `<span class="tiles-done">✓</span>`) + `<button class="tile back" id="bk" aria-label="delete">⌫</button>`;
    $("#tiles").querySelectorAll(".tile[data-u]").forEach((b) => b.addEventListener("click", () => enter(b.dataset.u)));
    $("#bk").onclick = backspace;
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
    if (!game.revealed.has(y + "," + x)) game.fill[y][x] = "";
    refresh(); save();
  }

  function afterChange(w) {
    save();
    if (wordSolved(w)) {
      buzz(30);
      if (game.grid.words.every(wordSolved)) return finish();
      // jump to the next unsolved word
      const ws = game.grid.words;
      for (let i = 1; i <= ws.length; i++) { const c = ws[(w.id + i) % ws.length]; if (!wordSolved(c)) { game.active = c.id; game.cursor = nextEmpty(c, 0); break; } }
    } else if (wordFull(w)) {
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
      <div class="sheet-head">${doodle(w.icon, "sheet-art")}<div><b>${t().hints}</b><small>${left > 0 ? t().hintLeft(left) : t().noHints}</small></div></div>
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
  function useHint() { game.hintsUsed = Math.min(MAX_HINTS, game.hintsUsed + 1); $("#hintCount").textContent = fmtNum(MAX_HINTS - game.hintsUsed); save(); }
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
      <div class="sheet-head">${doodle(w.icon, "sheet-art")}<div><b>${w.dir === "across" ? t().across + " →" : t().down + " ↓"}</b><small>${fmtNum(w.units.length)}${t().squares}</small></div></div>
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
    prog[k] = { stars: Math.max(stars, prev ? prev.stars : 0), best: prev ? Math.min(prev.best, game.seconds) : game.seconds };
    store.set("progress", prog);
    store.set(game.saveKey, null);
    syncCloud(false);
    refresh();
    buzz([40, 60, 40]);
    const sheet = $("#sheet");
    sheet.hidden = false;
    const hasNext = game.level < LEVELS;
    sheet.innerHTML = `<div class="sheet win">
      <div class="confetti">${["star", "flower", "butterfly", "sun", "star"].map((i) => doodle(i, "conf-art")).join("")}</div>
      <h2>${t().done}</h2>
      <div class="stars big-stars">${[1, 2, 3].map((s) => `<i class="${s <= stars ? "on" : ""}">★</i>`).join("")}</div>
      <p>${t().solvedIn}: <b>${fmtTime(game.seconds)}</b> · ${t().hintsUsed}: <b>${fmtNum(game.hintsUsed)}</b></p>
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
  function buzz(p) { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) { /* no vibration */ } }

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
  window.AXW = { splitUnits, buildLevel, DIFFS, LEVELS };

  if (app) renderHome();
  if (window.Cloud && Cloud.configured) {
    Cloud.onChange((u) => { if (u) syncCloud(true); else if (!game) renderHome(); });
    Cloud.init();
  }
  if ("serviceWorker" in navigator && location.protocol === "https:") {
    try { navigator.serviceWorker.register("sw.js").catch(() => {}); } catch (e) { /* not available */ }
  }
})();
