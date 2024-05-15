self.addEventListener('install', (event) => {
    console.log('Service worker installed');
    event.waitUntil(
      caches.open('static-cache').then((cache) => {
        return cache.addAll([
          '/',
          '/manifest.json',
          '/icons/augmego-icon.webp',
        ]);
      })
    );
  });
  
  self.addEventListener('activate', (event) => {
    console.log('Service worker activated');
  });
  
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });
  