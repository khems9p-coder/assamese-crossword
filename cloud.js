// Optional sign-in with Firebase (email + password everywhere; Google on the website). Progress is stored in Firestore at
// users/{uid} as { progress: { "<lang>:<difficulty>:<level>": {stars, best} }, name, updatedAt }.
// If APP_CONFIG.firebase is null, everything here stays switched off.
(function () {
  const VER = "10.12.2";
  const cfg = window.APP_CONFIG && window.APP_CONFIG.firebase;
  const listeners = [];
  let auth = null, db = null, ready = null;

  function load(src) {
    return new Promise((res, rej) => { const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
  }

  function init() {
    if (!cfg) return Promise.resolve(false);
    if (ready) return ready;
    const base = `https://www.gstatic.com/firebasejs/${VER}/`;
    ready = load(base + "firebase-app-compat.js")
      .then(() => Promise.all([load(base + "firebase-auth-compat.js"), load(base + "firebase-firestore-compat.js")]))
      .then(() => {
        firebase.initializeApp(cfg);
        auth = firebase.auth();
        db = firebase.firestore();
        auth.onAuthStateChanged((u) => listeners.forEach((fn) => fn(u)));
        return true;
      })
      .catch((e) => { console.warn("Cloud login unavailable", e); return false; });
    return ready;
  }

  // keep the best result of each level
  function merge(a, b) {
    const out = Object.assign({}, a);
    for (const k in b || {}) {
      const x = out[k], y = b[k];
      out[k] = !x ? y : { stars: Math.max(x.stars || 0, y.stars || 0), best: Math.min(x.best || 1e9, y.best || 1e9),
        plays: Math.max(x.plays || 0, y.plays || 0), at: Math.max(x.at || 0, y.at || 0) };
    }
    return out;
  }

  window.Cloud = {
    get configured() { return !!cfg; },
    get user() { return auth && auth.currentUser; },
    init,
    onChange(fn) { listeners.push(fn); },
    // Google's sign-in page is not allowed inside an app's own WebView, so the
    // Android app offers email + password only.
    get googleAllowed() { return !!cfg && location.hostname !== "appassets.androidplatform.net"; },
    async signInEmail(email, password) {
      if (!(await init())) throw new Error("not-configured");
      await auth.signInWithEmailAndPassword(email.trim(), password);
    },
    async signUpEmail(name, email, password) {
      if (!(await init())) throw new Error("not-configured");
      const cred = await auth.createUserWithEmailAndPassword(email.trim(), password);
      if (name && cred.user) await cred.user.updateProfile({ displayName: name.trim() });
    },
    async resetPassword(email) {
      if (!(await init())) throw new Error("not-configured");
      await auth.sendPasswordResetEmail(email.trim());
    },
    async signIn() {
      if (!(await init())) throw new Error("not-configured");
      const provider = new firebase.auth.GoogleAuthProvider();
      try { await auth.signInWithPopup(provider); }
      catch (e) {
        if (e && (e.code === "auth/popup-blocked" || e.code === "auth/operation-not-supported-in-this-environment")) await auth.signInWithRedirect(provider);
        else throw e;
      }
    },
    async signOut() { if (auth) await auth.signOut(); },
    // merge local progress with the cloud copy, save both ways, return the merged copy
    async sync(local) {
      const u = this.user;
      if (!u) return local;
      const ref = db.collection("users").doc(u.uid);
      const snap = await ref.get();
      const merged = merge(local, snap.exists ? snap.data().progress : {});
      await ref.set({ progress: merged, name: u.displayName || "", updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
      return merged;
    },
    merge
  };
})();
