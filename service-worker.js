/*
 * Service Worker for the State of Law Coalition website
 *
 * This service worker implements a simple cache‑first strategy.  When the
 * service worker is installed it pre‑caches all core assets (HTML pages,
 * CSS, fonts, images, icons, manifest).  During fetch events the
 * worker responds from the cache if possible, otherwise it falls back
 * to the network.  Activating the service worker cleans up any old
 * caches when the cache name changes.
 */

const CACHE_NAME = 'state-of-law-cache-v1';

// List of resources to cache for offline use.  Paths are relative to
// the root of the site.  Make sure to update this list if files are
// added or renamed.
const urlsToCache = [
  '/',
  '/index.html',
  '/program.html',
  '/leader.html',
  '/style.css',
  '/manifest.json',
  '/service-worker.js',
  // Fonts
  '/assets/lyon-arabic-text-black.otf',
  '/assets/lyon-arabic-text-semibold.otf',
  // Icons and images
  '/assets/state_of_law_logo.svg',
  '/assets/state_of_law_logo.jpg',
  '/assets/icon-192x192.png',
  '/assets/icon-512x512.png'
];

// Install event: pre‑cache defined assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate event: clean up any old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
});

// Fetch event: respond with cached resource or fall back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});