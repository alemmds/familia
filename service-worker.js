// ===== Service Worker for Familia Finanças PWA =====
const CACHE_NAME = 'familia-financas-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

// ===== Install Event =====
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Cache opened');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => {
                console.log('Assets cached successfully');
                return self.skipWaiting(); // Force the waiting service worker to become active
            })
            .catch((error) => {
                console.error('Failed to cache assets:', error);
            })
    );
});

// ===== Activate Event =====
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
        .then(() => {
            console.log('Service Worker activated');
            return self.clients.claim(); // Take control of all clients
        })
    );
});

// ===== Fetch Event =====
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached response if available
                if (response) {
                    console.log('Serving from cache:', event.request.url);
                    return response;
                }
                
                // Otherwise, fetch from network
                console.log('Fetching from network:', event.request.url);
                return fetch(event.request)
                    .then((response) => {
                        // Clone the response
                        const responseClone = response.clone();
                        
                        // Cache the response
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseClone);
                            });
                        
                        return response;
                    });
            })
            .catch((error) => {
                console.error('Fetch failed:', error);
                // Return a fallback response for HTML pages
                if (event.request.headers.get('accept').includes('text/html')) {
                    return caches.match('/index.html');
                }
            })
    );
});

// ===== Background Sync (if supported) =====
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-data') {
        event.waitUntil(
            syncDataWithServer()
        );
    }
});

async function syncDataWithServer() {
    // In a real app, this would sync local data with a server
    console.log('Syncing data with server...');
    
    // For now, just log
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
        client.postMessage({
            type: 'SYNC_COMPLETE',
            message: 'Dados sincronizados!'
        });
    });
}

// ===== Push Notifications (if supported) =====
self.addEventListener('push', (event) => {
    const data = event.data.json();
    const title = data.title || 'Familia Finanças';
    const options = {
        body: data.body || 'Você tem uma nova notificação',
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        data: {
            url: data.url || '/'
        }
    };
    
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.notification.data.url) {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    }
});

// ===== Periodic Sync (if supported) =====
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'daily-sync') {
        event.waitUntil(
            dailySync()
        );
    }
});

async function dailySync() {
    console.log('Performing daily sync...');
    // Sync data and show notification if needed
}
