/**
 * v2.0 CMS 后台页面
 */

// ==================== 状态管理 ====================
interface Destination {
    id: number;
    name: string;
    slug: string;
    description: string;
    coverImage: string;
    rating: number;
    viewCount: number;
}

interface Property {
    id: number;
    name: string;
    destinationId: number;
    price: number;
    rating: number;
    status: 'active' | 'inactive' | 'pending';
}

interface Order {
    id: string;
    userId: number;
    amount: number;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    date: string;
}

const cmsStore = {
    destinations: [] as Destination[],
    properties: [] as Property[],
    orders: [] as Order[],
};

// ==================== 景点管理 ====================
function initDestinations() {
    const container = document.getElementById('destinations-list');
    if (!container) return;

    // TODO: 调用真实 API
    const mockDestinations: Destination[] = [
        {
            id: 1,
            name: '涠洲岛',
            slug: 'weizhou',
            description: '中国最大、最年轻的火山岛',
            coverImage: '/images/destination1.jpg',
            rating: 4.8,
            viewCount: 12500,
        },
        {
            id: 2,
            name: '德天瀑布',
            slug: 'detian',
            description: '中国最大的跨国瀑布',
            coverImage: '/images/destination2.jpg',
            rating: 4.7,
            viewCount: 9800,
        },
        {
            id: 3,
            name: '阳朔',
            slug: 'yangshuo',
            description: '喀斯特地貌代表景区',
            coverImage: '/images/destination3.jpg',
            rating: 4.6,
            viewCount: 15200,
        },
    ];

    cmsStore.destinations = mockDestinations;

    container.innerHTML = mockDestinations
        .map(
            (dest) => `
            <div class="destination-item">
                <div class="destination-image" style="background-image: url('${dest.coverImage}')"></div>
                <div class="destination-info">
                    <h4 class="destination-title">${dest.name}</h4>
                    <p class="destination-desc">${dest.description}</p>
                    <div class="destination-stats">
                        <span class="stat">⭐ ${dest.rating}</span>
                        <span class="stat">👁 ${dest.viewCount.toLocaleString()}</span>
                    </div>
                    <div class="destination-actions">
                        <button class="btn btn-sm btn-primary" onclick="editDestination(${dest.id})">编辑</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteDestination(${dest.id})">删除</button>
                    </div>
                </div>
            </div>
        `
        )
        .join('');
}

// ==================== 民宿管理 ====================
function initProperties() {
    const container = document.getElementById('properties-list');
    if (!container) return;

    // TODO: 调用真实 API
    const mockProperties: Property[] = [
        {
            id: 1,
            name: '涠洲岛海景民宿',
            destinationId: 1,
            price: 488,
            rating: 4.9,
            status: 'active',
        },
        {
            id: 2,
            name: '阳朔山水别院',
            destinationId: 3,
            price: 666,
            rating: 4.7,
            status: 'active',
        },
    ];

    cmsStore.properties = mockProperties;

    container.innerHTML = mockProperties
        .map(
            (prop) => `
            <div class="property-item">
                <div class="property-info">
                    <h4 class="property-title">${prop.name}</h4>
                    <div class="property-meta">
                        <span>¥${prop.price}/晚</span>
                        <span>⭐ ${prop.rating}</span>
                        <span class="status status-${prop.status}">${prop.status === 'active' ? '正常' : '下架'}</span>
                    </div>
                </div>
                <div class="property-actions">
                    <button class="btn btn-sm btn-primary" onclick="editProperty(${prop.id})">编辑</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProperty(${prop.id})">删除</button>
                </div>
            </div>
        `
        )
        .join('');
}

// ==================== 订单管理 ====================
function initOrders() {
    const container = document.getElementById('orders-list');
    if (!container) return;

    // TODO: 调用真实 API
    const mockOrders: Order[] = [
        {
            id: 'ORD20240412001',
            userId: 1,
            amount: 888,
            status: 'completed',
            date: '2024-04-10',
        },
        {
            id: 'ORD20240412002',
            userId: 2,
            amount: 666,
            status: 'pending',
            date: '2024-04-12',
        },
    ];

    cmsStore.orders = mockOrders;

    container.innerHTML = mockOrders
        .map(
            (order) => `
            <div class="order-item">
                <div class="order-info">
                    <span class="order-id">#${order.id}</span>
                    <span class="order-user">用户: ${order.userId}</span>
                    <span class="order-date">${order.date}</span>
                </div>
                <div class="order-amount">¥${order.amount}</div>
                <div class="order-status status-${order.status}">
                    ${order.status === 'completed' ? '已完成' : order.status === 'pending' ? '待处理' : '已取消'}
                </div>
                <div class="order-actions">
                    <button class="btn btn-sm btn-primary" onclick="viewOrder('${order.id}')">详情</button>
                </div>
            </div>
        `
        )
        .join('');
}

// ==================== 数据报表 ====================
function initDashboard() {
    const stats = [
        { label: '总用户数', value: '1,234', change: '+12%', icon: '👥' },
        { label: '总订单数', value: '567', change: '+8%', icon: '📦' },
        { label: '总销售额', value: '¥89,000', change: '+15%', icon: '💰' },
        { label: '景点浏览量', value: '125K', change: '+20%', icon: '👁' },
    ];

    const container = document.getElementById('dashboard-stats');
    if (container) {
        container.innerHTML = stats
            .map(
                (stat) => `
                <div class="stat-card">
                    <div class="stat-icon">${stat.icon}</div>
                    <div class="stat-value">${stat.value}</div>
                    <div class="stat-label">${stat.label}</div>
                    <div class="stat-change ${stat.change.startsWith('+') ? 'positive' : 'negative'}">
                        ${stat.change}
                    </div>
                </div>
            `
            )
            .join('');
    }
}

// ==================== 通知组件 ====================
function showNotification(message: string, type: 'success' | 'error' | 'info') {
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'notification-container';
        document.body.appendChild(container);
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `<span>${message}</span>`;

    container.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ==================== 导出 ====================
export function initCMS() {
    initDestinations();
    initProperties();
    initOrders();
    initDashboard();
}
