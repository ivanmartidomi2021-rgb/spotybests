// ─────────────────────────────────────────────────────────────
//  Ivan Beats PWA — Service Worker
//  Autor: Ivan Alberson Martinez
// ─────────────────────────────────────────────────────────────

const CACHE = 'ivan-beats-v1';

const PRECACHE = [
  '/',
  '/manifest.json',
  '/audio/escapate.mp3',
  '/audio/Simpons.mp3',
  '/audio/Tattoo.mp3',
  '/audio/Tu_boda.mp3',
  '/audio/Tu_y_Yo.mp3',
  '/audio/UNA_CERVEZA.mp3',
  '/audio/vete_ya.mp3',
  '/audio/vss.mp3',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(cache =>
      Promise.allSettled(PRECACHE.map(url => cache.add(url).catch(() => {})))
    )
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res && res.status === 200) {
          caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        }
        return res;
      }).catch(() => caches.match('/'));
    })
  );
});
