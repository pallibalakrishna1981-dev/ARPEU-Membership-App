/* ==========================================================
   ARPEU PWA SERVICE WORKER ENGINE
   ========================================================== */

const CACHE_NAME = 'arpeu-portal-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/style.css',
  './js/script.js',
  './images/arpeu-logo.png',
  './images/bms-logo.png',
  './manifest.json'
];

/* Install Service Worker & Cache Core Assets */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

/* Activate Service Worker & Clean Old Caches */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

/* Network First Strategy for Live Dynamic Data */
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});