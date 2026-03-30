/**
 * 广西旅游网站 - 增强功能
 * [P0] 核心 - 2026-03-30
 */

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initPageLoader();
    initBackToTop();
    initScrollAnimations();
});

// 页面加载动画
function initPageLoader() {
    // 创建加载动画元素
    const loaderHTML = `
        <div class="page-loader" id="pageLoader">
            <div class="loader-content">
                <div class="loader-logo">🏝️</div>
                <div class="loader-text">广西旅游达人</div>
                <div class="loader-spinner"></div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', loaderHTML);
    
    // 页面加载完成后淡出
    window.addEventListener('load', function() {
        setTimeout(function() {
            const loader = document.getElementById('pageLoader');
            if (loader) {
                loader.classList.add('fade-out');
                setTimeout(function() {
                    loader.remove();
                }, 500);
            }
        }, 800);
    });
}

// 返回顶部按钮
function initBackToTop() {
    // 创建按钮
    const btnHTML = `<button class="back-to-top" id="backToTop" onclick="scrollToTop()">↑</button>`;
    document.body.insertAdjacentHTML('beforeend', btnHTML);
    
    // 滚动监听
    window.addEventListener('scroll', function() {
        const btn = document.getElementById('backToTop');
        if (btn) {
            if (window.scrollY > 300) {
                btn.classList.add('show');
            } else {
                btn.classList.remove('show');
            }
        }
    });
}

// 滚动到顶部
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 滚动动画初始化
function initScrollAnimations() {
    // 卡片已经在 CSS 中用 animation 实现
    // 这里可以添加滚动触发的动画
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });
    
    // 监听所有板块
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
}

// 空状态显示（供筛选功能调用）
function showNoResults(message) {
    return `
        <div class="no-results">
            <div class="no-results-icon">🔍</div>
            <div class="no-results-title">没有找到相关结果</div>
            <div class="no-results-desc">${message || '试试调整筛选条件或使用搜索'}</div>
            <button class="no-results-btn" onclick="resetFilters(); document.getElementById('filterPrice').focus();">
                🔄 重置筛选
            </button>
        </div>
    `;
}

// 平滑滚动到指定板块
function smoothScrollTo(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

console.log('✅ 增强功能已加载');
