/**
 * v2.0 邀请返利页面
 */

// ==================== 状态管理 ====================
interface ReferralStats {
    totalReferrals: number;
    completedReferrals: number;
    pendingRewards: number;
    paidRewards: number;
}

const referralStore = {
    state: {
        code: '',
        stats: {
            totalReferrals: 0,
            completedReferrals: 0,
            pendingRewards: 0,
            paidRewards: 0,
        } as ReferralStats,
    },

    setCode(code: string) {
        this.state.code = code;
    },

    setStats(stats: ReferralStats) {
        this.state.stats = stats;
    },
};

// ==================== 邀请码生成 ====================
function generateReferralCode(userId: number): string {
    const timestamp = Date.now().toString(36).toUpperCase().slice(-6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `GXTL${userId.toString().padStart(4, '0')}${timestamp}${random}`;
}

// ==================== 邀请页面 ====================
function initReferral() {
    const copyBtn = document.getElementById('copy-code-btn');
    const shareBtns = document.querySelectorAll('.share-btn');

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const code = referralStore.state.code;
            if (!code) return;

            navigator.clipboard.writeText(code).then(() => {
                showNotification('邀请码已复制', 'success');
                copyBtn.innerHTML = '已复制';
                setTimeout(() => {
                    copyBtn.innerHTML = '复制邀请码';
                }, 2000);
            });
        });
    }

    // 分享按钮
    shareBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const platform = btn.dataset.platform;
            shareToPlatform(platform || '');
        });
    });
}

// ==================== 分享到平台 ====================
function shareToPlatform(platform: string) {
    const code = referralStore.state.code;
    const url = `${window.location.origin}/?ref=${code}`;

    let shareUrl = '';
    switch (platform) {
        case 'wechat':
            showNotification('请长按二维码分享到微信', 'info');
            break;
        case 'qq':
            shareUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(url)}`;
            break;
        case 'weibo':
            shareUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}`;
            break;
        case 'douyin':
            showNotification('请复制链接分享到抖音', 'info');
            break;
        default:
            showNotification('请复制链接分享', 'info');
    }

    if (shareUrl) {
        window.open(shareUrl, '_blank');
    }
}

// ==================== 奖励规则 ====================
function initRewardRules() {
    const rules = [
        {
            title: '邀请人奖励',
            items: [
                '好友首次咨询：¥50',
                '好友成交订单：订单金额的5%',
            ],
        },
        {
            title: '被邀请人奖励',
            items: [
                '首次咨询：¥100优惠券',
                '首单优惠：¥200',
            ],
        },
    ];

    const container = document.getElementById('reward-rules');
    if (container) {
        container.innerHTML = rules
            .map(
                (rule) => `
                <div class="rule-card">
                    <h3 class="rule-title">${rule.title}</h3>
                    <ul class="rule-list">
                        ${rule.items.map((item) => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            `
            )
            .join('');
    }
}

// ==================== 奖励记录 ====================
function initRewardRecords() {
    const container = document.getElementById('reward-records');
    if (!container) return;

    // TODO: 调用真实 API
    const mockRecords = [
        {
            id: 1,
            type: 'referrer_reward',
            amount: 50,
            description: '好友首次咨询奖励',
            status: 'paid',
            date: '2024-04-10',
        },
        {
            id: 2,
            type: 'referrer_reward',
            amount: 100,
            description: '好友成交订单佣金',
            status: 'pending',
            date: '2024-04-12',
        },
    ];

    container.innerHTML = mockRecords
        .map(
            (record) => `
            <div class="record-item">
                <div class="record-info">
                    <span class="record-type">${record.type === 'referrer_reward' ? '邀请人奖励' : '被邀请人奖励'}</span>
                    <span class="record-desc">${record.description}</span>
                </div>
                <div class="record-amount">+¥${record.amount}</div>
                <div class="record-status status-${record.status}">
                    ${record.status === 'paid' ? '已发放' : '待发放'}
                </div>
                <div class="record-date">${record.date}</div>
            </div>
        `
        )
        .join('');
}

// ==================== 提现功能 ====================
function initWithdraw() {
    const form = document.getElementById('withdraw-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const amount = parseFloat((form.elements.namedItem('amount') as HTMLInputElement).value);
        const method = (form.elements.namedItem('method') as HTMLSelectElement).value;
        const account = (form.elements.namedItem('account') as HTMLInputElement).value;

        if (amount < 100) {
            showNotification('提现金额至少为¥100', 'error');
            return;
        }

        // TODO: 调用真实 API

        showNotification('提现申请已提交', 'success');
        form.reset();
    });
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
export function initReferralPage() {
    // 生成邀请码
    const userId = 1; // TODO: 从登录状态获取
    referralStore.setCode(generateReferralCode(userId));
    initReferral();
    initRewardRules();
    initRewardRecords();
    initWithdraw();
}
