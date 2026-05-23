const CACHE_NAME = 'fitnesstime-v1';
const URLS_TO_CACHE = [
  '/gym-app/',
  '/gym-app/index.html',
  '/gym-app/login.html',
  '/gym-app/app.html',
  '/gym-app/admin-login.html',
  '/gym-app/admin.html',
  '/gym-app/trainer-login.html',
  '/gym-app/trainer.html',
  '/gym-app/membership.html',
  '/gym-app/trainers.html',
  '/gym-app/gallery.html',
  '/gym-app/contact.html',
  '/gym-app/terms.html',
  '/gym-app/privacy.html',
  '/gym-app/logo.PNG.png',
  '/gym-app/manifest.json'
];

// Install event - cache all pages
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache successful network responses
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
