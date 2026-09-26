// オフライン対応。オンラインの時は常に最新のファイルを取りに行き、電波がない時は最後に見たものを使う。
const CACHE = 'cleanlog-v1';
const SHELL = [
  './', 'index.html', 'styles.css', 'app.js', 'ads.js', 'devices.js', 'export.js',
  'manifest.json', 'help.html', 'privacy.html', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/favicon.svg',
];
// 地図や画面の部品を配っている外部サービス。これらも最後に見たものを残しておく（地図の画像は残さない）
const LIBRARY_HOSTS = ['https://unpkg.com/', 'https://cdn.jsdelivr.net/', 'https://fonts.googleapis.com/', 'https://fonts.gstatic.com/'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => Promise.all(SHELL.map((url) => cache.add(url).catch(() => {}))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const sameOrigin = new URL(request.url).origin === self.location.origin;
  if (!sameOrigin && !LIBRARY_HOSTS.some((host) => request.url.startsWith(host))) return;
  event.respondWith(networkFirst(request));
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE);
  try {
    const response = await fetch(request);
    if (response.status === 200) cache.put(request, response.clone()).catch(() => {});
    return response;
  } catch (error) {
    const cached = await cache.match(request, { ignoreSearch: request.mode === 'navigate' });
    if (cached) return cached;
    if (request.mode === 'navigate') {
      const shell = await cache.match('index.html');
      if (shell) return shell;
    }
    throw error;
  }
}
