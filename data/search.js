/**
 * 广西旅游网站 - 搜索功能
 * [P0] 核心 - 2026-03-30
 */

// 搜索功能初始化
function initSearch() {
    // 创建搜索框 HTML
    const searchHTML = `
        <div class="search-container" id="searchContainer">
            <div class="search-box">
                <input type="text" id="searchInput" placeholder="搜索民宿、景点、房源..." autocomplete="off">
                <button id="searchBtn" class="search-btn">搜索</button>
            </div>
            <div id="searchResults" class="search-results"></div>
        </div>
    `;
    
    // 插入到 header 容器内的 nav-container 后面，确保在移动端能正确显示
    const navContainer = document.querySelector('.nav-container');
    if (navContainer) {
        navContainer.insertAdjacentHTML('afterend', searchHTML);
    }
    
    // 等待 DOM 更新后绑定事件
    setTimeout(() => {
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        
        if (searchInput) {
            searchInput.addEventListener('input', debounce(handleSearch, 300));
            // 确保 input 可以获得焦点
            searchInput.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            searchInput.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
            });
        }
        
        if (searchBtn) {
            searchBtn.addEventListener('click', doSearch);
        }
        
        // 点击其他地方关闭搜索结果
        document.addEventListener('click', (e) => {
            const searchResults = document.getElementById('searchResults');
            if (searchResults && !e.target.closest('.search-container')) {
                searchResults.style.display = 'none';
            }
        });
    }, 100);
}

// 防抖
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// 搜索处理
function handleSearch(e) {
    const query = e.target.value.trim();
    if (query.length < 2) {
        document.getElementById('searchResults').style.display = 'none';
        return;
    }
    doSearch();
}

// 执行搜索
function doSearch() {
    const query = document.getElementById('searchInput').value.trim();
    if (query.length < 2) return;
    
    const results = searchContent(query);
    displayResults(results, query);
}

// 搜索核心逻辑
function searchContent(query) {
    const results = [];
    const q = query.toLowerCase();
    
    // 遍历所有内容板块
    for (const [category, data] of Object.entries(CONTENT)) {
        if (!data.items) continue;
        
        data.items.forEach(item => {
            // 搜索字段
            const searchFields = [
                item.name, item.description, 
                item.tags?.join(' '), item.location,
                item.price, item.priceRange
            ].filter(Boolean).join(' ').toLowerCase();
            
            if (searchFields.includes(q)) {
                results.push({
                    category: category,
                    categoryName: data.title,
                    ...item
                });
            }
        });
    }
    
    return results;
}

// 显示结果
function displayResults(results, query) {
    const container = document.getElementById('searchResults');
    
    if (results.length === 0) {
        container.innerHTML = `<div class="search-no-result">未找到"${query}"相关结果</div>`;
        container.style.display = 'block';
        return;
    }
    
    let html = `<div class="search-result-header">找到 ${results.length} 个结果</div>`;
    
    results.forEach(item => {
        const highlight = (text) => text.replace(new RegExp(`(${query})`, 'gi'), '<mark>$1</mark>');
        
        html += `
            <div class="search-result-item" onclick="scrollToSection('${item.category}')">
                <div class="search-result-category">${item.categoryName}</div>
                <div class="search-result-title">${highlight(item.name)}</div>
                <div class="search-result-desc">${highlight(item.description || '')}</div>
                <div class="search-result-tags">
                    ${(item.tags || []).slice(0, 3).map(t => `<span class="tag">${t}</span>`).join('')}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    container.style.display = 'block';
}

// 跳转到板块
function scrollToSection(categoryId) {
    const section = document.getElementById(categoryId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
    document.getElementById('searchResults').style.display = 'none';
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initSearch);
