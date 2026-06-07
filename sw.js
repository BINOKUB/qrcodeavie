const CACHE_NAME = 'qrcode-v2';
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

// Ton nouveau bloc de gestion des requêtes
self.addEventListener('fetch', (e) => {
  // 1. Priorité au réseau pour la page d'accueil (index)
  if (e.request.url.endsWith('index.html') || e.request.url.endsWith('/')) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
  } else {
    // 2. Priorité au cache pour les ressources statiques (rapide)
    e.respondWith(
      caches.match(e.request).then((res) => res || fetch(e.request))
    );
  }
});
