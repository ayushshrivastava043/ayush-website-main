// Service Worker for caching chatbot assets
const CACHE_NAME = 'chatbot-cache-v3';
const urlsToCache = [
  'assets/20250821-1758-Relaxed-Chatbot--unscreen-ezgif.com-apng-to-gif-converter.gif',
  'assets/js/chatbot-widget.js',
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
  // Only cache GIF files, not JavaScript files
  if (event.request.url.includes('gif') && !event.request.url.includes('.js')) {
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
