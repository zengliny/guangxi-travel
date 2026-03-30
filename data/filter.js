/**
 * 广西旅游网站 - 筛选功能
 * [P0] 核心 - 2026-03-30
 */

// 筛选器配置
const FILTER_CONFIG = {
    // 价格区间选项
    priceRanges: [
        { label: '不限', value: '' },
        { label: '¥500以下', value: '0-500', min: 0, max: 500 },
        { label: '¥500-1000', value: '500-1000', min: 500, max: 1000 },
        { label: '¥1000-2000', value: '1000-2000', min: 1000, max: 2000 },
        { label: '¥2000-3000', value: '2000-3000', min: 2000, max: 3000 },
        { label: '¥3000以上', value: '3000+', min: 3000, max: Infinity }
    ],
    // 位置选项
    locations: [
        { label: '不限', value: '' },
        { label: '北海', value: '北海' },
        { label: '涠洲岛', value: '涠洲岛' },
        { label: '阳朔', value: '阳朔' },
        { label: '桂林', value: '桂林' },
        { label: '德天', value: '德天' }
    ],
    // 类型选项
    types: [
        { label: '不限', value: '' },
        { label: '民宿', value: 'homestay' },
        { label: '租房', value: 'rental' },
        { label: '养老', value: 'elderly' },
        { label: '房产', value: 'property' }
    ]
};

// 创建筛选器 UI
function createFilterUI() {
    const filterHTML = `
        <div class="filter-bar" id="filterBar">
            <div class="filter-title">🔍 筛选条件</div>
            <div class="filter-group">
                <label>价格</label>
                <select id="filterPrice" onchange="applyFilters()">
                    ${FILTER_CONFIG.priceRanges.map(p => 
                        `<option value="${p.value}">${p.label}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="filter-group">
                <label>位置</label>
                <select id="filterLocation" onchange="applyFilters()">
                    ${FILTER_CONFIG.locations.map(l => 
                        `<option value="${l.value}">${l.label}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="filter-group">
                <label>类型</label>
                <select id="filterType" onchange="applyFilters()">
                    ${FILTER_CONFIG.types.map(t => 
                        `<option value="${t.value}">${t.label}</option>`
                    ).join('')}
                </select>
            </div>
            <button class="filter-reset" onclick="resetFilters()">重置</button>
            <span class="filter-count" id="filterCount"></span>
        </div>
    `;
    
    // 插入到 mainContent 前面
    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
        mainContent.insertAdjacentHTML('beforebegin', filterHTML);
    }
}

// 解析价格
function parsePrice(priceStr) {
    if (!priceStr) return 0;
    // 提取数字
    const match = priceStr.match(/[\d,]+/);
    if (match) {
        return parseInt(match[0].replace(/,/g, ''));
    }
    return 0;
}

// 获取价格区间
function getPriceRange(rangeValue) {
    return FILTER_CONFIG.priceRanges.find(r => r.value === rangeValue);
}

// 应用筛选
function applyFilters() {
    const priceRange = document.getElementById('filterPrice').value;
    const location = document.getElementById('filterLocation').value;
    const type = document.getElementById('filterType').value;
    
    let totalCount = 0;
    
    // 遍历所有板块筛选
    for (const [category, data] of Object.entries(CONTENT)) {
        if (!data.items) continue;
        
        data.items.forEach((item, index) => {
            const itemElement = document.querySelector(`[data-category="${category}"][data-index="${index}"]`);
            if (!itemElement) return;
            
            let show = true;
            
            // 1. 价格筛选
            if (priceRange) {
                const range = getPriceRange(priceRange);
                if (range) {
                    const itemPrice = parsePrice(item.price || item.priceRange || '');
                    if (itemPrice > 0 && (itemPrice < range.min || itemPrice > range.max)) {
                        show = false;
                    }
                }
            }
            
            // 2. 位置筛选
            if (location && item.location && !item.location.includes(location)) {
                show = false;
            }
            if (location && item.name && !item.name.includes(location)) {
                // 尝试匹配名称中的位置
            }
            
            // 3. 类型筛选
            if (type && category !== type) {
                // 检查 tags 中是否有匹配
                const tagsMatch = item.tags && item.tags.some(t => 
                    t.toLowerCase().includes(getTypeKeyword(type))
                );
                if (!tagsMatch) {
                    show = false;
                }
            }
            
            // 显示/隐藏
            itemElement.style.display = show ? '' : 'none';
            if (show) totalCount++;
        });
    }
    
    // 更新计数
    document.getElementById('filterCount').textContent = `显示 ${totalCount} 项`;
}

// 获取类型关键词
function getTypeKeyword(type) {
    const keywords = {
        'homestay': ['民宿', '海景', '度假'],
        'rental': ['租房', '月租', '拎包'],
        'elderly': ['养老', '候鸟', '过冬'],
        'property': ['房产', '投资', '买房']
    };
    return keywords[type] ? keywords[type][0] : '';
}

// 重置筛选
function resetFilters() {
    document.getElementById('filterPrice').value = '';
    document.getElementById('filterLocation').value = '';
    document.getElementById('filterType').value = '';
    applyFilters();
}

// 为每个内容块添加 data 属性（用于筛选）
function markContentItems() {
    let index = 0;
    for (const [category, data] of Object.entries(CONTENT)) {
        if (!data.items) continue;
        data.items.forEach((item, i) => {
            const elements = document.querySelectorAll(`.content-grid .card, .content-list .item`);
            if (elements[index]) {
                elements[index].setAttribute('data-category', category);
                elements[index].setAttribute('data-index', i);
            }
            index++;
        });
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    createFilterUI();
    // 等待内容加载完成后标记
    setTimeout(markContentItems, 1000);
});
