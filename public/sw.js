const CACHE_NAME = 'rudu-farm-pwa-v1';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/offline.html',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/apple-touch-icon.png',
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[PWA SW] Pre-caching offline assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[PWA SW] Clearing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Network First with Offline Fallback
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Exclude API calls and hot-reloading from offline cache override
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/_next/webpack-hmr')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache valid static responses
        if (response.status === 200 && event.request.url.startsWith(self.location.origin)) {
          const resCopy = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, resCopy);
          });
        }
        return response;
      })
      .catch(async () => {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // Return offline page for HTML navigation
        if (event.request.mode === 'navigate' || event.request.headers.get('accept')?.includes('text/html')) {
          return (await caches.match('/offline.html')) || Response.error();
        }

        return Response.error();
      })
  );
});
