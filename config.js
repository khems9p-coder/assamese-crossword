// App settings. Edit this file only; the rest of the app reads from here.
window.APP_CONFIG = {
  developer: "KBX Studios",
  version: "1.0.0",

  // ---- About / Contact / Share / Rate ---------------------------------------
  contactEmail: "",            // e.g. "kbxstudios@gmail.com" – shown in Contact and used for feedback mails
  playStoreUrl: "https://play.google.com/store/apps/details?id=com.kbxstudios.shabdajal",
  websiteUrl: "https://khems9p-coder.github.io/assamese-crossword/",
  moreAppsUrl: "",             // your Play Store developer page, once you have one

  // ---- Login (email + password in the app, also Google on the website) -----
  // In Firebase console: Authentication → Sign-in method → enable Email/Password (and Google).
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
