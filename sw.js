const CACHE_PREFIX = 'dong-ho-kim-seiko-cache-';
const CACHE_NAME = CACHE_PREFIX + 'v1'; // đổi v1 -> v2 khi cập nhật phiên bản

const APP_SHELL = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png'
];
// Phông chữ ngoài (CDN) của phần mềm — cache để dùng offline
const CDN_FONT_CSS = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Playfair+Display:wght@500;600;700&display=swap';
const CDN_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(APP_SHELL).then(() =>
        // CDN lỗi thì bỏ qua, không làm hỏng việc cài đặt
        cache.add(new Request(CDN_FONT_CSS, { mode: 'no-cors' })).catch(() => {})
      )
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((n) => n.startsWith(CACHE_PREFIX) && n !== CACHE_NAME)
          .map((n) => caches.delete(n))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  const sameOrigin = url.origin === self.location.origin;
  const isFont = CDN_HOSTS.indexOf(url.hostname) !== -1;
  // Chỉ xử lý tài nguyên tĩnh của app và phông chữ.
  // Mọi request khác (vd. đồng bộ giờ worldtimeapi/cloudflare/timeapi) để trình duyệt tự xử lý.
  if (!sameOrigin && !isFont) return;
  if (sameOrigin && !req.mode.startsWith('navigate') &&
      !/\.(html|json|png|js|css)$/.test(url.pathname) && !url.pathname.endsWith('/')) return;

  event.respondWith(
    caches.open(CACHE_NAME).then((c) => c.match(req)).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          if (isFont && res && (res.ok || res.type === 'opaque')) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => {
          if (req.mode === 'navigate') {
            return caches.open(CACHE_NAME).then((c) => c.match('./index.html'));
          }
        });
    })
  );
});
