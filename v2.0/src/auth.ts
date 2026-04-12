/**
 * v2.0 用户系统 - 登录/注册页面
 */

// ==================== 状态管理 ====================
interface User {
    id: number;
    phone: string;
    nickname: string;
    avatar: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const authStore = {
    state: {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
    } as AuthState,

    setUser(user: User | null) {
        this.state.user = user;
        this.state.isAuthenticated = !!user;
        localStorage.setItem('user', JSON.stringify(user));
    },

    clearUser() {
        this.state.user = null;
        this.state.isAuthenticated = false;
        localStorage.removeItem('user');
    },

    setLoading(loading: boolean) {
        this.state.loading = loading;
    },

    setError(error: string | null) {
        this.state.error = error;
    },
};

// ==================== API 调用 ====================
async function apiPost(path: string, data: any) {
    const response = await fetch(`/api${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return response.json();
}

// ==================== 登录表单 ====================
function initLogin() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const phone = (form.elements.namedItem('phone') as HTMLInputElement).value;
        const password = (form.elements.namedItem('password') as HTMLInputElement).value;

        if (!phone || !password) {
            showNotification('请输入手机号和密码', 'error');
            return;
        }

        authStore.setLoading(true);

        try {
            // TODO: 调用真实 API
            const user = {
                id: 1,
                phone,
                nickname: '游客' + phone.slice(-4),
                avatar: '/images/avatar-default.png',
            };

            authStore.setUser(user);
            showNotification('登录成功', 'success');
            setTimeout(() => {
                window.location.href = '/v2.0/user/profile.html';
            }, 1000);
        } catch (error) {
            authStore.setError('登录失败，请重试');
            showNotification('登录失败', 'error');
        } finally {
            authStore.setLoading(false);
        }
    });
}

// ==================== 注册表单 ====================
function initRegister() {
    const form = document.getElementById('register-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const phone = (form.elements.namedItem('phone') as HTMLInputElement).value;
        const password = (form.elements.namedItem('password') as HTMLInputElement).value;
        const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value;
        const code = (form.elements.namedItem('code') as HTMLInputElement).value;

        if (password !== confirmPassword) {
            showNotification('两次密码不一致', 'error');
            return;
        }

        authStore.setLoading(true);

        try {
            // TODO: 调用真实 API
            const user = {
                id: 1,
                phone,
                nickname: '新用户' + phone.slice(-4),
                avatar: '/images/avatar-default.png',
            };

            authStore.setUser(user);
            showNotification('注册成功', 'success');
            setTimeout(() => {
                window.location.href = '/v2.0/user/profile.html';
            }, 1000);
        } catch (error) {
            authStore.setError('注册失败，请重试');
            showNotification('注册失败', 'error');
        } finally {
            authStore.setLoading(false);
        }
    });
}

// ==================== 获取验证码 ====================
function initGetCode() {
    const btn = document.getElementById('get-code-btn');
    if (!btn) return;

    btn.addEventListener('click', async () => {
        const phone = (document.getElementById('register-form')?.elements.namedItem('phone') as HTMLInputElement)?.value;

        if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
            showNotification('请输入正确的手机号', 'error');
            return;
        }

        btn.disabled = true;
        let count = 60;

        const interval = setInterval(() => {
            count--;
            btn.textContent = `${count}秒后重试`;
            if (count <= 0) {
                clearInterval(interval);
                btn.disabled = false;
                btn.textContent = '获取验证码';
            }
        }, 1000);

        // TODO: 调用真实 API 发送验证码
        console.log('发送验证码到:', phone);
    });
}

// ==================== 通知组件 ====================
function showNotification(message: string, type: 'success' | 'error' | 'info') {
    const container = document.getElementById('notification-container');
    if (!container) return;

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
export function initAuth() {
    initLogin();
    initRegister();
    initGetCode();
}
