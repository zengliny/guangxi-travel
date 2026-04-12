/**
 * v2.0 用户系统 - 个人中心页面
 */

// ==================== 状态管理 ====================
interface UserProfile {
    realName: string;
    idCard: string;
    address: string;
    city: string;
    preferences: string[];
}

const userStore = {
    state: {
        profile: null as UserProfile | null,
        favorites: [] as any[],
        orders: [] as any[],
        browsingHistory: [] as any[],
    },

    setProfile(profile: UserProfile) {
        this.state.profile = profile;
        localStorage.setItem('profile', JSON.stringify(profile));
    },

    setFavorites(favorites: any[]) {
        this.state.favorites = favorites;
    },

    setOrders(orders: any[]) {
        this.state.orders = orders;
    },

    setBrowsingHistory(history: any[]) {
        this.state.browsingHistory = history;
    },
};

// ==================== 页面初始化 ====================
function initProfile() {
    const profileForm = document.getElementById('profile-form');
    if (!profileForm) return;

    // 加载用户资料
    const savedProfile = localStorage.getItem('profile');
    if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        Object.entries(profile).forEach(([key, value]) => {
            const input = profileForm.elements.namedItem(key) as HTMLInputElement;
            if (input) input.value = value;
        });
    }

    // 保存资料
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(profileForm);
        const profile = Object.fromEntries(formData.entries()) as UserProfile;

        userStore.setProfile(profile);
        showNotification('资料保存成功', 'success');
    });
}

// ==================== 收藏列表 ====================
function initFavorites() {
    const container = document.getElementById('favorites-list');
    if (!container) return;

    // TODO: 调用真实 API
    const mockFavorites = [
        {
            id: 1,
            title: '涠洲岛五彩滩',
            image: '/images/destination1.jpg',
            type: 'destination',
        },
        {
            id: 2,
            title: '阳朔西街民宿',
            image: '/images/property1.jpg',
            type: 'property',
        },
    ];

    container.innerHTML = mockFavorites
        .map(
            (item) => `
            <div class="favorite-item">
                <div class="favorite-image" style="background-image: url('${item.image}')"></div>
                <div class="favorite-info">
                    <h3 class="favorite-title">${item.title}</h3>
                    <span class="favorite-type">${item.type === 'destination' ? '景点' : '民宿'}</span>
                    <button class="btn btn-sm btn-danger" onclick="removeFavorite(${item.id})">取消收藏</button>
                </div>
            </div>
        `
        )
        .join('');
}

// ==================== 订单列表 ====================
function initOrders() {
    const container = document.getElementById('orders-list');
    if (!container) return;

    // TODO: 调用真实 API
    const mockOrders = [
        {
            id: 'ORD20240412001',
            title: '涠洲岛3日游',
            amount: 888,
            status: 'completed',
            date: '2024-04-10',
        },
        {
            id: 'ORD20240412002',
            title: '阳朔民宿预订',
            amount: 666,
            status: 'pending',
            date: '2024-04-12',
        },
    ];

    container.innerHTML = mockOrders
        .map(
            (item) => `
            <div class="order-item">
                <div class="order-info">
                    <h4 class="order-title">${item.title}</h4>
                    <p class="order-id">订单号: ${item.id}</p>
                    <p class="order-date">${item.date}</p>
                </div>
                <div class="order-status status-${item.status}">
                    ${item.status === 'completed' ? '已完成' : item.status === 'pending' ? '待处理' : '已取消'}
                </div>
                <div class="order-amount">¥${item.amount}</div>
            </div>
        `
        )
        .join('');
}

// ==================== 浏览历史 ====================
function initHistory() {
    const container = document.getElementById('history-list');
    if (!container) return;

    // TODO: 调用真实 API
    const mockHistory = [
        {
            id: 1,
            title: '德天瀑布',
            image: '/images/destination2.jpg',
            type: 'destination',
            time: '10分钟前',
        },
    ];

    container.innerHTML = mockHistory
        .map(
            (item) => `
            <div class="history-item">
                <div class="history-image" style="background-image: url('${item.image}')"></div>
                <div class="history-info">
                    <h4 class="history-title">${item.title}</h4>
                    <p class="history-time">${item.time}</p>
                </div>
            </div>
        `
        )
        .join('');
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
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">
                ${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}
            </span>
            <span class="notification-text">${message}</span>
        </div>
    `;

    container.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ==================== 导出 ====================
export function initUserProfile() {
    initProfile();
    initFavorites();
    initOrders();
    initHistory();
}
