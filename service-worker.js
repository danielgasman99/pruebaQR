const CACHE_NAME = 'qr-reader-cache-v3';
const urlsToCache = [
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/html5-qrcode'
];

// Evento 'install': Se ejecuta cuando el service worker se instala.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto, precargando archivos.');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento 'fetch': Intercepta las solicitudes de red.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devuelve el archivo en caché si está disponible
        if (response) {
          return response;
        }
        // De lo contrario, continúa con la solicitud de red
        return fetch(event.request);
      })
  );
});

// Evento 'activate': Limpia los caches antiguos.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Borrando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
