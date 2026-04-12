/**
 * 动画模块 - 按需加载
 * 版本: 2.0
 * 日期: 2026-04-12
 */

// ==================== 滚动动画 ====================
export function initAnimations() {
    if (!('IntersectionObserver' in window)) {
        return;
    }

    // 观察器配置
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '50px 0px'
    };

    // 滚动动画元素
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                animationObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        animationObserver.observe(element);
    });
}

// ==================== 悬停动画 ====================
export function initHoverAnimations() {
    const hoverElements = document.querySelectorAll('.hover-3d');

    hoverElements.forEach(element => {
        element.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        element.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

// ==================== 页面加载动画 ====================
export function initPageLoader() {
    const loader = document.getElementById('pageLoader');
    if (!loader) return;

    // 监听资源加载
    let resourcesLoaded = 0;
    const totalResources = document.images.length + 1; // +1 for CSS

    function checkLoad() {
        resourcesLoaded++;
        if (resourcesLoaded >= totalResources) {
            setTimeout(() => {
                loader.classList.add('hidden');
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 500);
            }, 300);
        }
    }

    // CSS加载完成
    document.addEventListener('DOMContentLoaded', checkLoad);

    // 图片加载完成
    document.images.forEach(img => {
        if (img.complete) {
            checkLoad();
        } else {
            img.addEventListener('load', checkLoad);
        }
    });
}

// ==================== 导出 ====================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initAnimations,
        initHoverAnimations,
        initPageLoader
    };
}
