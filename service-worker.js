self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("gym-app-v1").then(cache => {
      return cache.addAll([
        "user.html",
        "scan.html",
        "admin.html",
        "manifest.json"
      ]);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
