// Banner 轮播功能
let currentBanner = 0;
const banners = document.querySelectorAll('.banner-slide');
const dots = document.querySelectorAll('.dot');

function showBanner(index) {
    banners.forEach((banner, i) => {
        banner.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    currentBanner = index;
}

function changeBanner(direction) {
    let newIndex = currentBanner + direction;
    if (newIndex < 0) newIndex = banners.length - 1;
    if (newIndex >= banners.length) newIndex = 0;
    showBanner(newIndex);
}

function goToBanner(index) {
    showBanner(index);
}

// 自动轮播
setInterval(() => {
    changeBanner(1);
}, 5000);

// 热门房源数据
const FEATURED_PROPERTIES = [
    {
        id: 1,
        name: "涠洲岛•南湾海景民宿",
        location: "涠洲岛南湾",
        price: "268",
        unit: "起/晚",
        tag: "海景房",
        icon: "🏠",
        desc: "步行可达沙滩，阳台看日出",
        facilities: ["海景阳台", "免费停车", "接站服务", "厨房"]
    },
    {
        id: 2,
        name: "北海银滩•银海一号",
        location: "北海银海区",
        price: "198",
        unit: "起/晚",
        tag: "银滩旁",
        icon: "🏖️",
        desc: "距银滩500米，步行3分钟",
        facilities: ["靠近海滩", "海景房", "早餐含", "电梯"]
    },
    {
        id: 3,
        name: "阳朔•遇龙河畔民宿",
        location: "阳朔遇龙河",
        price: "328",
        unit: "起/晚",
        tag: "景观房",
        icon: "🏞️",
        desc: "遇龙河最佳观景位置",
        facilities: ["河景房", "自行车", "私人导游", "接送"]
    },
    {
        id: 4,
        name: "德天瀑布•景区民宿",
        location: "大新县德天",
        price: "188",
        unit: "起/晚",
        tag: "景区内",
        icon: "🌊",
        desc: "步行可达景区门口",
        facilities: ["景区直达", "含门票", "包车服务", "餐饮"]
    }
];

// 渲染热门房源卡片
function renderFeaturedProperties() {
    const grid = document.getElementById('featuredGrid');
    if (!grid) return;
    
    grid.innerHTML = FEATURED_PROPERTIES.map(property => `
        <div class="featured-card" onclick="showPropertyDetail(${property.id})">
            <div class="featured-img">
                ${property.icon}
                <span class="featured-tag">${property.tag}</span>
            </div>
            <div class="featured-body">
                <h3 class="featured-title">${property.name}</h3>
                <p class="featured-desc">${property.desc}</p>
                <div class="featured-meta">
                    <div class="featured-price">¥${property.price}<span>/${property.unit}</span></div>
                    <button class="featured-btn">查看详情</button>
                </div>
            </div>
        </div>
    `).join('');
}

// 显示房源详情弹窗
function showPropertyDetail(id) {
    const property = FEATURED_PROPERTIES.find(p => p.id === id);
    if (!property) return;
    
    const modal = document.getElementById('propertyModal');
    const content = document.getElementById('propertyModalContent');
    
    content.innerHTML = `
        <div class="property-modal-header">
            <span class="property-modal-close" onclick="closePropertyModal()">&times;</span>
            <h3>${property.name}</h3>
            <p>📍 ${property.location}</p>
        </div>
        <div class="property-modal-body">
            <div class="property-info-grid">
                <div class="property-info-item">
                    <div class="label">价格</div>
                    <div class="value">¥${property.price}<span>/晚</span></div>
                </div>
                <div class="property-info-item">
                    <div class="label">标签</div>
                    <div class="value">${property.tag}</div>
                </div>
                <div class="property-info-item">
                    <div class="label">评分</div>
                    <div class="value">4.9⭐</div>
                </div>
                <div class="property-info-item">
                    <div class="label">预订</div>
                    <div class="value">立即</div>
                </div>
            </div>
            <div class="property-facilities">
                <h4>🏠 配套设施</h4>
                <div class="facility-tags">
                    ${property.facilities.map(f => `<span>${f}</span>`).join('')}
                </div>
            </div>
            <div class="property-contact">
                <button class="btn-wechat" onclick="showWechat()">💬 微信咨询</button>
                <a href="tel:17200861361" class="btn-phone">📞 电话预约</a>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

function closePropertyModal() {
    const modal = document.getElementById('propertyModal');
    modal.classList.remove('active');
}

// 点击弹窗外部关闭
document.addEventListener('click', function(e) {
    const modal = document.getElementById('propertyModal');
    if (e.target === modal) {
        closePropertyModal();
    }
});

// ESC 键关闭弹窗
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closePropertyModal();
    }
});

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    renderFeaturedProperties();
});

// 搜索功能
function filterSearch() {
    const region = document.getElementById('regionFilter').value;
    const type = document.getElementById('typeFilter').value;
    const price = document.getElementById('priceFilter').value;
    
    const results = filterProperties(region, type, price);
    renderSearchResults(results);
}

function quickSearch(keyword) {
    // 设置筛选条件
    if (keyword.includes('北海')) {
        document.getElementById('regionFilter').value = '北海';
    } else if (keyword.includes('涠洲岛')) {
        document.getElementById('regionFilter').value = '涠洲岛';
    } else if (keyword.includes('阳朔')) {
        document.getElementById('regionFilter').value = '阳朔';
    }
    
    filterSearch();
    
    // 滚动到结果区域
    document.querySelector('.featured-section')?.scrollIntoView({behavior: 'smooth'});
}

function filterProperties(region, type, price) {
    // 简单筛选逻辑 - 实际可连接后端 API
    const allProperties = window.properties || [];
    
    return allProperties.filter(p => {
        if (region && !p.region?.includes(region)) return false;
        if (type && !p.type?.includes(type)) return false;
        if (price) {
            const [min, max] = price.split('-').map(v => v === '1000+' ? Infinity : parseInt(v));
            const pPrice = p.price || 0;
            if (max && pPrice > max) return false;
            if (min !== undefined && pPrice < min) return false;
        }
        return true;
    });
}

function renderSearchResults(results) {
    const grid = document.getElementById('featuredGrid');
    if (!grid) return;
    
    if (results.length === 0) {
        grid.innerHTML = '<div class="no-results">未找到匹配房源，请尝试其他筛选条件</div>';
        return;
    }
    
    grid.innerHTML = results.map(p => `
        <div class="featured-card" onclick="showPropertyDetail(${p.id})">
            <div class="card-image" style="background: linear-gradient(135deg, #0ea5e9, #06b6d4);">
                <span class="card-tag">${p.region || '广西'}</span>
            </div>
            <div class="card-content">
                <h3>${p.name}</h3>
                <p class="card-location">📍 ${p.location}</p>
                <div class="card-footer">
                    <span class="card-price">¥${p.price}/晚</span>
                    <span class="card-rating">⭐ ${p.rating || '5.0'}</span>
                </div>
            </div>
        </div>
    `).join('');
}
