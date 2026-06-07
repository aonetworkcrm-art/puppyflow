/* ══════════════════════════════════════════════
   NEXUS PUPPY FLOW — SERVICE WORKER v1.0
   Offline support + push notification handling
   ══════════════════════════════════════════════ */

const CACHE = 'nexus-puppy-flow-v1';
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './js/agent.js',
  './js/notifications.js',
  './js/briefing.js',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

// Install
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch
self.addEventListener('fetch', e => {
  if (e.request.url.includes('chrome-extension') || e.request.url.includes('hot-update')) return;
  
  e.respondWith(
    caches.match(e.request)
      .then(cached => cached || fetch(e.request).then(res => {
        return caches.open(CACHE).then(cache => {
          if (e.request.url.startsWith('http')) cache.put(e.request, res.clone());
          return res;
        });
      }).catch(() => new Response('Offline', { status: 503 })))
  );
});

// Push notifications
self.addEventListener('push', e => {
  if (!e.data) return;
  try {
    const data = e.data.json();
    self.registration.showNotification(data.title || 'Nexus Puppy Flow', {
      body: data.body || '',
      icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ctext y="80" font-size="80"%3E🐾%3C/text%3E%3C/svg%3E',
      badge: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ctext y="80" font-size="80"%3E🐾%3C/text%3E%3C/svg%3E',
      vibrate: [200, 100, 200],
      tag: data.tag || 'puppy-general',
      requireInteraction: true,
      data: data.data || {},
      actions: data.actions || []
    });
  } catch (err) {
    console.warn('SW push error:', err);
  }
});

// Notification click
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.notification.data?.url || './index.html';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes('index.html') && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
