/**
 * 广西旅游网站 - 交互增强
 * [P0] 核心 - 2026-03-30
 */

// 快捷导航侧边栏
function createQuickNav() {
    const navHTML = `
        <div class="quick-nav" id="quickNav">
            <div class="quick-nav-title">快速导航</div>
            <div class="quick-nav-items">
                <a href="#destinations" class="quick-nav-item">🗺️ 景点</a>
                <a href="#homestay" class="quick-nav-item">🏠 民宿</a>
                <a href="#rental" class="quick-nav-item">🏡 租房</a>
                <a href="#elderly" class="quick-nav-item">🦅 养老</a>
                <a href="#property" class="quick-nav-item">🏘️ 房产</a>
                <a href="#trust" class="quick-nav-item">🤝 托管</a>
                <a href="#auction" class="quick-nav-item">⚖️ 拍卖</a>
                <a href="#exchange" class="quick-nav-item">🔄 置换</a>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', navHTML);
}

// 区域标签切换
function createSectionTabs() {
    const tabsHTML = `
        <div class="section-tabs" id="sectionTabs">
            <button class="tab-btn active" data-tab="all">全部</button>
            <button class="tab-btn" data-tab="featured">精选</button>
            <button class="tab-btn" data-tab="popular">热门</button>
            <button class="tab-btn" data-tab="new">最新</button>
        </div>
    `;
    
    // 插入到 mainContent 前面
    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
        mainContent.insertAdjacentHTML('beforebegin', tabsHTML);
    }
    
    // 绑定点击事件
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // 切换 active 状态
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 筛选卡片
            const filter = this.dataset.tab;
            filterCards(filter);
        });
    });
}

// 筛选卡片
function filterCards(filter) {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        if (filter === 'all') {
            card.style.display = '';
            card.classList.add('fade-in');
        } else if (filter === 'featured') {
            const isFeatured = card.querySelector('.card-tag');
            card.style.display = isFeatured ? '' : 'none';
        } else {
            card.style.display = '';
        }
    });
}

// 滚动进度条
function createScrollProgress() {
    const progressHTML = `<div class="scroll-progress" id="scrollProgress"></div>`;
    document.body.insertAdjacentHTML('beforeend', progressHTML);
    
    window.addEventListener('scroll', function() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        const progress = document.getElementById('scrollProgress');
        if (progress) {
            progress.style.width = scrolled + '%';
        }
    });
}

// 卡片点击展开详情
function initCardExpand() {
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function(e) {
            // 防止按钮点击触发
            if (e.target.classList.contains('card-btn')) return;
            
            this.classList.toggle('expanded');
        });
    });
}

// 微信二维码弹窗
function initWechatModal() {
    const modal = document.getElementById('wechatModal');
    if (!modal) return;
    
    // 点击外部关闭
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal('wechatModal');
        }
    });
    
    // ESC 关闭
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal('wechatModal');
        }
    });
}

// 键盘快捷键
function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K 打开搜索
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('searchInput')?.focus();
        }
        
        // / 快速搜索
        if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
            e.preventDefault();
            document.getElementById('searchInput')?.focus();
        }
        
        // Home 回到顶部
        if (e.key === 'Home') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

// 初始化一切
document.addEventListener('DOMContentLoaded', function() {
    createQuickNav();
    createSectionTabs();
    createScrollProgress();
    initCardExpand();
    initWechatModal();
    initKeyboardShortcuts();
});

console.log('✅ 交互增强已加载');
