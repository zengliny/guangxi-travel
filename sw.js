/**
 * Service Worker - 离线缓存策略
 * [P0] 核心 - 2026-04-12
 * 优化：智能缓存、资源预取、离线体验
 */

const CACHE_NAME = 'guangxi-travel-v5';
const OFFLINE_URL = '/offline.html';

// 需要缓存的资源 - 智能分类
const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/offline.html',
    '/critical.css',
    '/styles.css',
    '/data/content.js',
    '/data/search.js',
    '/data/filter.js',
    '/data/booking.js',
    '/js/banner.js',
    '/js/social-share.js',
    '/js/animations.js',
    '/js/form-validation.js',
    '/js/map.js',
    '/js/video.js',
    '/manifest.json',
    '/images/icon-192.png',
    '/images/icon-512.png'
];

// 动态缓存策略配置
const CACHE_STRATEGY = {
    // 静态资源：缓存优先
    static: ['font', 'image', 'audio', 'video'],
    // 动态资源：网络优先
    dynamic: ['api', 'xhr', 'fetch'],
    // 混合策略：缓存优先但更新
    stale: ['html', 'css', 'js']
};

// 安装事件 - 预缓存关键资源
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('📦 预缓存关键资源');
                return cache.addAll(PRECACHE_ASSETS);
            })
            .then(() => {
                console.log('✅ Service Worker 安装完成');
                return self.skipWaiting();
            })
            .catch(error => {
                console.warn('⚠️ 部分资源缓存失败:', error);
                return self.skipWaiting();
            })
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
        }).then(() => {
            console.log('🧹 旧缓存清理完成');
            return self.clients.claim();
        })
    );
});

// 拦截请求 - 智能缓存策略
self.addEventListener('fetch', event => {
    // 跳过非 GET 请求
    if (event.request.method !== 'GET') return;

    // 跳过非同源请求
    if (!event.request.url.startsWith(self.location.origin)) return;

    // 跳过浏览器缓存请求
    if (event.request.cache === 'no-store') return;

    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    // 缓存存在 - 后台更新
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

                // 缓存不存在 - 请求网络
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
                        // 网络失败 - 智能降级
                        if (event.request.destination === 'document') {
                            return caches.match(OFFLINE_URL);
                        }
                        if (event.request.destination === 'image') {
                            return new Response('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="#e2e8f0" width="200" height="200"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#94a3b8">图片加载失败</text></svg>', { headers: { 'Content-Type': 'image/svg+xml' } });
                        }
                        return new Response('网络连接失败', { status: 503 });
                    });
            })
    );
});

// 推送通知处理
self.addEventListener('push', event => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || '广西旅游达人';
    const body = data.body || '您有新的消息';
    const options = {
        body: body,
        icon: '/images/icon-192.png',
        badge: '/images/icon-192.png',
        data: data.url || '/',
        tag: 'guangxi-travel-notification',
        renotify: true,
        requireInteraction: data.requireInteraction || false
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// 通知点击处理
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data || '/')
    );
});

// 后台同步
self.addEventListener('sync', event => {
    if (event.tag === 'sync-offline-data') {
        event.waitUntil(syncOfflineData());
    }
});

// 同步离线数据
async function syncOfflineData() {
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
        client.postMessage({ type: 'SYNC_COMPLETE' });
    });
}

// 信息栏消息处理
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.delete(CACHE_NAME).then(() => {
                event.source.postMessage({ type: 'CACHE_CLEARED' });
            })
        );
    }
});
