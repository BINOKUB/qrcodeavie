/* Révision v1.1 - sw.js */
const CACHE_NAME = 'qrcode-v2'; // Passé de v1 à v2 pour forcer la mise à jour du cache
const ASSETS = [
  './index.html',
  './style.css',
  './app.js',
  './lang.js',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/qr-code-styling@1.5.0/lib/qr-code-styling.js',
  'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
