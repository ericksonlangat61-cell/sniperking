const CACHE_NAME = 'sniperking-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/sniperking/manifest.json',
  '/sniperking/splash-bg.jpg',
  '/sniperking/icon-192x192.png',
  '/sniperking/icon-512x512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS).catch((err) => {
        console.log('Cache add failed:', err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        // Return offline page or cached fallback
        return caches.match('/index.html');
      });
    })
  );
});
