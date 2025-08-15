// Nom du cache (changer la version si tu modifies les fichiers)
const CACHE_NAME = "metallerie-cache-v2";

// Liste des fichiers à mettre en cache
const FILES_TO_CACHE = [
  "/metallerie/metallerie-pwa.html",
  "/metallerie/sw.js",
  "/metallerie/manifest.json",
  "/metallerie/icons/icon-128x128.png",
];

// Installation du service worker et mise en cache initiale
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activation : nettoyage des anciens caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interception des requêtes
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Si on a une réponse en cache → on la sert
      if (cachedResponse) {
        return cachedResponse;
      }
      // Sinon, on va sur le réseau
      return fetch(event.request).catch(() => {
        // Si le réseau est indisponible, fallback sur la page HTML principale
        if (event.request.mode === "navigate") {
          return caches.match("/metallerie/metallerie-pwa.html");
        }
      });
    })
  );
});
