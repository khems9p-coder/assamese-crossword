// Offline cache. Bump VERSION whenever you change any file so phones get the update.
const VERSION = "axw-v12";
const FILES = ["./", "index.html", "style.css", "app.js", "puzzles.js", "levels.js", "icons.js", "manifest.json", "config.js", "cloud.js", "ads.js", "privacy.html",
  "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request)));
});
