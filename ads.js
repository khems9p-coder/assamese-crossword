// Google AdSense banners, switched on in config.js. Ads are only placed on the
// home screen and the "level finished" sheet, never while a puzzle is being played.
(function () {
  const a = (window.APP_CONFIG && window.APP_CONFIG.ads) || {};
  let loaded = false;

  function ensureScript() {
    if (loaded) return;
    loaded = true;
    const s = document.createElement("script");
    s.async = true;
    s.crossOrigin = "anonymous";
    s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + encodeURIComponent(a.client);
    document.head.appendChild(s);
  }

  window.Ads = {
    // AdSense is for websites only; the Android app would need AdMob instead
    get enabled() { return !!(a.enabled && a.client && navigator.onLine !== false && location.hostname !== "appassets.androidplatform.net"); },
    // returns the html for an ad box; call Ads.fill() after it is in the page
    slot(name) {
      if (!this.enabled) return "";
      const id = name === "win" ? a.winSlot : a.homeSlot;
      return `<div class="ad-box"><small>Ad</small><ins class="adsbygoogle" style="display:block" data-ad-client="${a.client}" data-ad-slot="${id}" data-ad-format="auto" data-full-width-responsive="true"></ins></div>`;
    },
    fill() {
      if (!this.enabled) return;
      ensureScript();
      document.querySelectorAll("ins.adsbygoogle:not([data-adsbygoogle-status])").forEach(() => {
        try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) { /* ad blocked */ }
      });
    }
  };
})();
