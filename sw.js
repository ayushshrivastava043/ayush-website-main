// Service Worker for caching chatbot assets - Optimized
const CACHE_NAME = 'chatbot-cache-v2';
const urlsToCache = [
  'assets/chatbot-avatar-optimized.webp',
  'assets/js/enhanced-chatbot-widget-optimized.js',
  'assets/css/style.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('🚀 [SW] Caching chatbot assets...');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('chatbot') || event.request.url.includes('gif')) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            console.log('🚀 [SW] Serving from cache:', event.request.url);
            return response;
          }
          return fetch(event.request);
        })
    );
  }
});
