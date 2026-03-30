/**
 * 广西旅游网站 - 性能优化
 * [P0] 核心 - 2026-03-30
 */

// 图片懒加载
function initLazyLoad() {
    // 使用 Intersection Observer
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // 如果有 data-src，使用它
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                    }
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        // 观察所有带 lazy 类的图片
        document.querySelectorAll('img.lazy').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // 降级处理：直接加载
        document.querySelectorAll('img.lazy').forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    }
}

// 预加载关键资源
function preloadCriticalResources() {
    // 预加载关键字体
    const fonts = [
        'https://fonts.gstatic.com/s/notoscsanssc/v36/k3kCo84MPvpLmixcA63oeALhLOCT-xWdqOhi.woff2'
    ];
    
    fonts.forEach(font => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'font';
        link.href = font;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    });
}

// 预连接第三方域名
function preconnectThirdParty() {
    const domains = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com'
    ];
    
    domains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        document.head.appendChild(link);
    });
}

// 性能监控
function initPerformanceMonitor() {
    // 监控页面加载时间
    window.addEventListener('load', function() {
        if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
            const firstPaint = timing.firstPaint || 0;
            
            console.log('📊 性能指标:');
            console.log(`  DOM加载: ${domReady}ms`);
            console.log(`  页面加载: ${loadTime}ms`);
            console.log(`  首屏绘制: ${firstPaint}ms`);
            
            // 上报性能数据（可选）
            if (typeof reportPerformance === 'function') {
                reportPerformance({ loadTime, domReady, firstPaint });
            }
        }
    });
    
    // 监控资源加载错误
    window.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG' || e.target.tagName === 'SCRIPT') {
            console.warn('⚠️ 资源加载失败:', e.target.src || e.target.href);
        }
    }, true);
}

// Service Worker 注册（PWA 支持）
function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        // 注意：需要 HTTPS 或 localhost
        if (location.protocol === 'https:' || location.hostname === 'localhost') {
            navigator.serviceWorker.register('/sw.js').then(registration => {
                console.log('✅ Service Worker 注册成功:', registration.scope);
            }).catch(error => {
                console.log('⚠️ Service Worker 注册失败:', error);
            });
        }
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    preloadCriticalResources();
    preconnectThirdParty();
    initLazyLoad();
    initPerformanceMonitor();
    initServiceWorker();
});

console.log('✅ 性能优化已加载');
