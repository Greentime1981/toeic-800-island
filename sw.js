// 多益 800 衝刺島 service worker（版本號由 build.py 依內容自動更新）
const CACHE = 'toeic800-0432cf2b';
const ASSETS = ['./', './manifest.json', './icons/icon-180.png', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    for (const url of ASSETS) {
      try {
        const r = await fetch(url, {cache: 'reload'});
        // 被轉址的回應重新包成新的 Response，避免主畫面開啟時 ERR_FAILED
        const body = r.redirected ? new Response(await r.blob(), {status: 200, headers: r.headers}) : r;
        if (r.ok) await c.put(url, body);
      } catch (err) {}
    }
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (req.mode === 'navigate') {
    e.respondWith(caches.match('./').then(r => r || fetch(req)));
    return;
  }
  e.respondWith(caches.match(req).then(r => r || fetch(req)));
});
