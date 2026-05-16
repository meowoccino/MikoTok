const CACHE_NAME = 'mikotok-v1';

// Install the service worker immediately
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

// Activate and claim the client
self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim());
});

// Network-first strategy: Always fetch newest code from GitHub, fallback to cache if offline
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
