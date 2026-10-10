// Lets ChronicRx be installed as a desktop / phone app. Pages always load fresh from the network so every update
// shows at once; the last copy is kept only to open the app when the connection drops. Patient data and sign-in
// go straight to Supabase and are never cached here.
const CACHE = 'chronicrx-shell-v1';
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', 'manifest.webmanifest', 'icons/icon-192.png']))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req.mode === 'navigate' ? './' : req, copy)); }
    return res;
  }).catch(() => caches.match(req.mode === 'navigate' ? './' : req)));
});
