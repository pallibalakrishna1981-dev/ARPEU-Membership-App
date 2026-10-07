/* ==========================================================
   ARPEU PWA SERVICE WORKER - LIVE NETWORK-FIRST ENGINE
   Version: 1.0 (Official Build)
   ========================================================== */

const CACHE_NAME = 'arpeu-portal-v74.0';

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

  // Only handle local website files, completely ignore external Google APIs
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
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

/* ==========================================================
   ARPEU PWA BACKGROUND INCOMING CALL & NOTIFICATION ENGINE
   (Wakes up device, sounds ringtone & vibrates on Lock Screen)
   ========================================================== */

/* 1. Receive Background Call Signal while Phone is Locked */
self.addEventListener('push', event => {
    const data = event.data ? event.data.json() : {};
    const callerName = data.callerName || "ARPEU Leader";
    const roomCode = data.roomCode || "ARPEU-CONF";

    const options = {
        body: `🔔 Incoming Executive Video Call from ${callerName}\nTap to Join immediately.`,
        icon: 'images/arpeu-logo.png',
        badge: 'images/arpeu-logo.png',
        vibrate: [1200, 400, 1200, 400, 1200, 400, 1200],
        requireInteraction: true, // Keeps notification active until answered
        tag: 'arpeu-incoming-call',
        renotify: true,
        data: {
            roomCode: roomCode,
            url: self.location.origin + '/index.html?room=' + roomCode
        },
        actions: [
            { action: 'join', title: '🟢 Join Call' },
            { action: 'decline', title: '🔴 Decline' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(`📞 ${callerName} Calling...`, options)
    );
});

/* 2. User Taps [Join Call] on Lock Screen -> Wakes up and Opens Room Directly */
self.addEventListener('notificationclick', event => {
    event.notification.close();
    const action = event.action;

    if (action === 'decline') {
        return;
    }

    const targetUrl = event.notification.data.url;

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
            // If app is already open in background, bring to front
            for (let client of windowClients) {
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    client.navigate(targetUrl);
                    return client.focus();
                }
            }
            // If app is completely closed, open fresh window into room
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});