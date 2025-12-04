const CACHE_NAME = 'nursevault-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip API calls, external resources, and browser extension URLs
  if (event.request.url.includes('/api/') || 
      event.request.url.startsWith('chrome-extension://') ||
      event.request.url.startsWith('moz-extension://') ||
      event.request.url.startsWith('safari-extension://') ||
      (event.request.url.startsWith('http') && !event.request.url.includes(self.location.origin))) {
    return fetch(event.request);
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // For navigation requests (SPA routing), always return index.html
        const acceptHeader = event.request.headers.get('accept');
        if (event.request.mode === 'navigate' || 
            (event.request.method === 'GET' && acceptHeader && acceptHeader.includes('text/html'))) {
          return caches.match('/index.html');
        }
        
        // For other requests, fetch from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache if not a valid response or if it's an extension URL
            if (!response || 
                response.status !== 200 || 
                response.type !== 'basic' ||
                event.request.url.startsWith('chrome-extension://') ||
                event.request.url.startsWith('moz-extension://') ||
                event.request.url.startsWith('safari-extension://')) {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              })
              .catch((err) => {
                // Silently fail if caching fails (e.g., for extension URLs)
                console.warn('Cache put failed:', err);
              });
            
            return response;
          })
          .catch(() => {
            // If fetch fails and it's a navigation request, return index.html
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => self.clients.claim())
  );
});