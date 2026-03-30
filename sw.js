/**
 * Service Worker - 离线缓存策略
 * [P0] 核心 - 2026-03-30
 */

const CACHE_NAME = 'guangxi-travel-v4';
const OFFLINE_URL = '/offline.html';

// 需要缓存的资源
const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/offline.html',
    '/data/content.js',
    '/data/search.js',
    '/data/filter.js',
    '/data/booking.js',
    '/styles.css'
];

// 安装事件 - 预缓存关键资源
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('📦 预缓存关键资源');
                return cache.addAll(PRECACHE_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

// 拦截请求 - 缓存优先，网络备选
self.addEventListener('fetch', event => {
    // 跳过非 GET 请求
    if (event.request.method !== 'GET') return;
    
    // 跳过跨域请求
    if (!event.request.url.startsWith(self.location.origin)) return;
    
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    // 返回缓存，同时更新缓存
                    event.waitUntil(
                        fetch(event.request)
                            .then(networkResponse => {
                                if (networkResponse.ok) {
                                    caches.open(CACHE_NAME)
                                        .then(cache => cache.put(event.request, networkResponse));
                                }
                            })
                            .catch(() => {})
                    );
                    return cachedResponse;
                }
                
                // 缓存没有，请求网络
                return fetch(event.request)
                    .then(networkResponse => {
                        if (networkResponse.ok) {
                            const responseClone = networkResponse.clone();
                            caches.open(CACHE_NAME)
                                .then(cache => cache.put(event.request, responseClone));
                        }
                        return networkResponse;
                    })
                    .catch(() => {
                        // 网络失败，返回离线页面
                        if (event.request.destination === 'document') {
                            return caches.match(OFFLINE_URL);
                        }
                    });
            })
    );
});

// 推送通知处理
self.addEventListener('push', event => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || '广西旅游达人';
    const options = {
        body: data.body || '您有新的消息',
        icon: '/icon-192.png',
        badge: '/badge-72.png',
        data: data.url || '/'
    };
    
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// 通知点击处理
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data)
    );
});
