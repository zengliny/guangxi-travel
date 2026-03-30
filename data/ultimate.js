/**
 * 广西旅游网站 - 最终优化
 * [P0] 核心 - 2026-03-30
 */

// 1. 卡片入场动画控制
function initCardAnimations() {
    const cards = document.querySelectorAll('.card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.animationDelay = `${index * 0.05}s`;
                    entry.target.classList.add('animate-in');
                }, index * 50);
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach(card => observer.observe(card));
}

// 2. 平滑滚动增强
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 3. 数字滚动动画
function animateNumbers() {
    const numbers = document.querySelectorAll('[data-count]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const end = parseInt(target.dataset.count);
                const duration = 2000;
                const step = end / (duration / 16);
                let current = 0;
                
                const timer = setInterval(() => {
                    current += step;
                    if (current >= end) {
                        target.textContent = end;
                        clearInterval(timer);
                    } else {
                        target.textContent = Math.floor(current);
                    }
                }, 16);
                
                observer.unobserve(target);
            }
        });
    });
    
    numbers.forEach(num => observer.observe(num));
}

// 4. 工具提示
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(el => {
        const tooltip = document.createElement('div');
        tooltip.className = 'custom-tooltip';
        tooltip.textContent = el.dataset.tooltip;
        document.body.appendChild(tooltip);
        
        el.addEventListener('mouseenter', () => {
            const rect = el.getBoundingClientRect();
            tooltip.style.top = `${rect.top - 40}px`;
            tooltip.style.left = `${rect.left + rect.width / 2}px`;
            tooltip.classList.add('show');
        });
        
        el.addEventListener('mouseleave', () => {
            tooltip.classList.remove('show');
        });
    });
}

// 5. 滚动显示动画
function initScrollReveal() {
    const elements = document.querySelectorAll('.section-title, .section-subtitle');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(el => observer.observe(el));
}

// 6. 防抖和节流工具
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 7. 移动端菜单优化
function initMobileMenu() {
    const menuBtn = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuBtn.classList.toggle('active');
        });
        
        // 点击外部关闭
        document.addEventListener('click', (e) => {
            if (!menuBtn.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                menuBtn.classList.remove('active');
            }
        });
    }
}

// 8. 区域标签切换优化
function initSectionTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('.section');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const filter = tab.dataset.tab;
            
            // 更新 tab 状态
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // 筛选内容
            sections.forEach(section => {
                if (filter === 'all') {
                    section.style.display = '';
                } else {
                    // 根据标签筛选
                    const items = section.querySelectorAll('.card');
                    items.forEach(item => {
                        const tag = item.querySelector('.card-tag');
                        if (filter === 'featured' && tag) {
                            item.style.display = '';
                        } else if (filter === 'featured' && !tag) {
                            item.style.display = 'none';
                        }
                    });
                }
            });
        });
    });
}

// 9. 页面可见性处理
function initVisibilityHandler() {
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            document.title = '👀 广西旅游达人 - 待命中';
        } else {
            document.title = '广西旅游达人 | 北海民宿、租房、候鸟养老';
        }
    });
}

// 10. 初始化一切
document.addEventListener('DOMContentLoaded', () => {
    initCardAnimations();
    initSmoothScroll();
    initMobileMenu();
    initSectionTabs();
    initVisibilityHandler();
    
    // 延迟初始化
    setTimeout(() => {
        initScrollReveal();
    }, 500);
    
    console.log('✅ 最终优化已加载');
});

// 导出工具函数
window.utils = { debounce, throttle };
