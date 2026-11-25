// App settings. Edit this file only; the rest of the app reads from here.
window.APP_CONFIG = {
  developer: "KBX Studios",

  // ---- Login (Google sign-in, progress saved online) ----------------------
  // Paste the web app config from Firebase console → Project settings → Your apps.
  // Leave as null to keep the app offline-only (progress stays on the phone).
  // Example:
  // firebase: {
  //   apiKey: "AIza...", authDomain: "your-project.firebaseapp.com",
  //   projectId: "your-project", appId: "1:123:web:abc"
  // },
  firebase: null,

  // ---- Google ads (AdSense) ------------------------------------------------
  // Turn on by setting enabled: true and filling your AdSense publisher id and ad slot ids.
  // Ads appear only on the home screen and after a level is finished — never during play.
  ads: {
    enabled: false,
    client: "ca-pub-0000000000000000",
    homeSlot: "0000000000",
    winSlot: "0000000000"
  }
};
