/* ==========================================================
   ARPEU PWA SERVICE WORKER - LIVE NETWORK-FIRST ENGINE
   Version: 1.0 (Official Build)
   ========================================================== */

const CACHE_NAME = 'arpeu-portal-v28.0';

/* Install & Activate Immediately without Waiting */
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.map(key => caches.delete(key)));
    })
  );
  self.clients.claim();
});

/* Fetch Strategy: Cache local assets, bypass external Google Apps Script API calls */
self.addEventListener('fetch', event => {
  const url = event.request.url;

  // Do NOT intercept Google Apps Script or external API calls
  if (url.includes('script.google.com') || url.includes('googleusercontent.com') || url.includes('api.qrserver.com')) {
    return; // Directly fetch from network without service worker caching
  }

  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});