const CACHE_NAME = 'qrcode-v1';
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
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
