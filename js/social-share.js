/**
 * 广西旅游网站 - 社交分享和引流功能
 * 版本: 2.0
 * 日期: 2026-04-12
 */

// ==================== 社交分享功能 ====================

class SocialShare {
    constructor() {
        this.shareData = {
            title: '广西旅游达人 | 带你玩转涠洲岛、德天瀑布、阳朔',
            text: '广西本地旅游达人，提供景点攻略、民宿推荐、租房信息、候鸟养老、旅游房产等服务。免费咨询：17200861361',
            url: window.location.href
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.createShareButtons();
    }

    createShareButtons() {
        const shareContainer = document.createElement('div');
        shareContainer.className = 'social-share-container';
        shareContainer.innerHTML = `
            <div class="social-share-buttons">
                <button class="share-btn wechat" data-platform="wechat" title="分享到微信">
                    <span class="icon">💬</span>
                    <span class="label">微信</span>
                </button>
                <button class="share-btn weibo" data-platform="weibo" title="分享到微博">
                    <span class="icon">🐦</span>
                    <span class="label">微博</span>
                </button>
                <button class="share-btn qq" data-platform="qq" title="分享到QQ">
                    <span class="icon">🐧</span>
                    <span class="label">QQ</span>
                </button>
                <button class="share-btn douyin" data-platform="douyin" title="分享到抖音">
                    <span class="icon">🎵</span>
                    <span class="label">抖音</span>
                </button>
                <button class="share-btn xiaohongshu" data-platform="xiaohongshu" title="分享到小红书">
                    <span class="icon">📕</span>
                    <span class="label">小红书</span>
                </button>
            </div>
            <div class="share-qr-modal" id="shareQRModal">
                <div class="share-qr-content">
                    <span class="close-btn" onclick="closeShareQRModal()">&times;</span>
                    <h3>分享到微信</h3>
                    <div class="qr-code" id="shareQRCode"></div>
                    <p>扫描二维码分享给朋友</p>
                </div>
            </div>
        `;

        document.body.appendChild(shareContainer);
    }

    bindEvents() {
        document.addEventListener('click', (e) => {
            const shareBtn = e.target.closest('.share-btn');
            if (shareBtn) {
                const platform = shareBtn.dataset.platform;
                this.shareToPlatform(platform);
            }
        });
    }

    shareToPlatform(platform) {
        const shareUrl = this.getShareUrl(platform);

        switch(platform) {
            case 'wechat':
                this.showWechatQR();
                break;
            case 'weibo':
                window.open(shareUrl, '_blank', 'width=600,height=400');
                break;
            case 'qq':
                window.open(shareUrl, '_blank', 'width=800,height=600');
                break;
            case 'douyin':
                this.copyToClipboard(this.shareData.url);
                alert('链接已复制，请打开抖音分享');
                break;
            case 'xiaohongshu':
                this.copyToClipboard(this.shareData.url);
                alert('链接已复制，请打开小红书分享');
                break;
        }
    }

    getShareUrl(platform) {
        const encodedUrl = encodeURIComponent(this.shareData.url);
        const encodedTitle = encodeURIComponent(this.shareData.title);

        switch(platform) {
            case 'weibo':
                return `http://service.weibo.com/share/share.php?url=${encodedUrl}&title=${encodedTitle}`;
            case 'qq':
                return `http://connect.qq.com/widget/shareqq/index.html?url=${encodedUrl}&title=${encodedTitle}`;
            default:
                return this.shareData.url;
        }
    }

    showWechatQR() {
        const modal = document.getElementById('shareQRModal');
        modal.classList.add('active');

        // 生成二维码
        this.generateQRCode();
    }

    generateQRCode() {
        const qrContainer = document.getElementById('shareQRCode');
        if (!qrContainer) return;

        // 使用第三方库生成二维码，这里使用简单实现
        const qrText = `${this.shareData.title}\n${this.shareData.text}\n${this.shareData.url}`;
        qrContainer.innerHTML = `
            <div class="qr-placeholder">
                <div class="qr-icon">📱</div>
                <p>微信扫码分享</p>
                <small>${this.shareData.url.substring(0, 30)}...</small>
            </div>
        `;
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('链接已复制到剪贴板');
        }).catch(err => {
            console.error('复制失败:', err);
        });
    }
}

// ==================== 引流功能 ====================

class LeadGeneration {
    constructor() {
        this.leadData = {
            source: 'website',
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        };

        this.init();
    }

    init() {
        this.trackUserBehavior();
        this.createLeadForms();
        this.setupCTAs();
    }

    trackUserBehavior() {
        // 跟踪页面浏览
        this.trackPageView();

        // 跟踪按钮点击
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('button, a');
            if (btn) {
                this.trackClick(btn);
            }
        });

        // 跟踪滚动深度
        this.trackScrollDepth();

        // 跟踪停留时间
        this.trackTimeOnPage();
    }

    trackPageView() {
        const pageData = {
            ...this.leadData,
            action: 'page_view',
            page: window.location.pathname,
            referrer: document.referrer
        };

        this.saveLeadData(pageData);
    }

    trackClick(element) {
        const clickData = {
            ...this.leadData,
            action: 'click',
            element: element.tagName,
            text: element.textContent.trim(),
            href: element.href || '',
            class: element.className
        };

        this.saveLeadData(clickData);
    }

    trackScrollDepth() {
        let scrollDepth = 0;
        let maxScrollDepth = 0;

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

            scrollDepth = Math.round((scrollTop / scrollHeight) * 100);

            if (scrollDepth > maxScrollDepth) {
                maxScrollDepth = scrollDepth;

                if (maxScrollDepth % 25 === 0) {
                    const scrollData = {
                        ...this.leadData,
                        action: 'scroll',
                        depth: maxScrollDepth
                    };

                    this.saveLeadData(scrollData);
                }
            }
        });
    }

    trackTimeOnPage() {
        let startTime = Date.now();

        window.addEventListener('beforeunload', () => {
            const timeSpent = Date.now() - startTime;
            const seconds = Math.round(timeSpent / 1000);

            const timeData = {
                ...this.leadData,
                action: 'time_spent',
                seconds: seconds
            };

            this.saveLeadData(timeData);
        });
    }

    createLeadForms() {
        // 创建咨询表单
        const formContainer = document.createElement('div');
        formContainer.className = 'lead-form-container';
        formContainer.innerHTML = `
            <div class="lead-form-modal" id="leadFormModal">
                <div class="lead-form-content">
                    <span class="close-btn" onclick="closeLeadForm()">&times;</span>
                    <h3>免费咨询</h3>
                    <form id="leadForm" onsubmit="submitLeadForm(event)">
                        <div class="form-group">
                            <label for="name">姓名</label>
                            <input type="text" id="name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="phone">电话</label>
                            <input type="tel" id="phone" name="phone" required>
                        </div>
                        <div class="form-group">
                            <label for="interest">感兴趣的服务</label>
                            <select id="interest" name="interest">
                                <option value="民宿">民宿推荐</option>
                                <option value="租房">租房信息</option>
                                <option value="养老">候鸟养老</option>
                                <option value="房产">旅游房产</option>
                                <option value="托管">房屋托管</option>
                                <option value="拍卖">拍卖房</option>
                                <option value="置换">房屋置换</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="message">具体需求</label>
                            <textarea id="message" name="message" rows="3"></textarea>
                        </div>
                        <button type="submit" class="submit-btn">提交咨询</button>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(formContainer);
    }

    setupCTAs() {
        // 添加CTA按钮
        const ctaButtons = [
            {
                text: '免费咨询',
                class: 'cta-primary',
                action: 'show_lead_form'
            },
            {
                text: '微信咨询',
                class: 'cta-secondary',
                action: 'show_wechat_qr'
            },
            {
                text: '电话预约',
                class: 'cta-phone',
                action: 'call_phone'
            }
        ];

        ctaButtons.forEach(cta => {
            const ctaElement = document.createElement('button');
            ctaElement.className = `cta-btn ${cta.class}`;
            ctaElement.textContent = cta.text;
            ctaElement.dataset.action = cta.action;

            ctaElement.addEventListener('click', () => {
                this.handleCTAAction(cta.action);
            });

            // 添加到页面底部
            const footer = document.querySelector('footer') || document.body;
            footer.appendChild(ctaElement);
        });
    }

    handleCTAAction(action) {
        switch(action) {
            case 'show_lead_form':
                this.showLeadForm();
                break;
            case 'show_wechat_qr':
                this.showWechatQR();
                break;
            case 'call_phone':
                window.location.href = 'tel:17200861361';
                break;
        }
    }

    showLeadForm() {
        const modal = document.getElementById('leadFormModal');
        modal.classList.add('active');
    }

    showWechatQR() {
        // 显示微信二维码
        alert('请添加微信: 17200861361');
    }

    saveLeadData(data) {
        // 保存到本地存储
        const leads = JSON.parse(localStorage.getItem('guangxi_leads') || '[]');
        leads.push(data);
        localStorage.setItem('guangxi_leads', JSON.stringify(leads));

        // 发送到服务器（如果有后端）
        this.sendToServer(data);
    }

    sendToServer(data) {
        // 如果有后端API，可以发送数据
        // fetch('/api/leads', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(data)
        // });
    }
}

// ==================== 裂变营销功能 ====================

class ViralMarketing {
    constructor() {
        this.referralCode = this.generateReferralCode();
        this.init();
    }

    init() {
        this.createReferralSection();
        this.setupSharing();
    }

    generateReferralCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    createReferralSection() {
        const referralSection = document.createElement('section');
        referralSection.className = 'referral-section';
        referralSection.innerHTML = `
            <div class="container">
                <h2 class="section-title">🎁 邀请有奖</h2>
                <p class="section-subtitle">邀请好友，共享优惠</p>

                <div class="referral-grid">
                    <div class="referral-card">
                        <div class="referral-icon">👥</div>
                        <h3>邀请好友</h3>
                        <p>分享你的专属链接给朋友</p>
                        <div class="referral-code">${this.referralCode}</div>
                    </div>

                    <div class="referral-card">
                        <div class="referral-icon">💰</div>
                        <h3>获得奖励</h3>
                        <p>好友成功咨询，你获得¥50奖励</p>
                        <div class="reward-amount">¥50</div>
                    </div>

                    <div class="referral-card">
                        <div class="referral-icon">🎉</div>
                        <h3>好友优惠</h3>
                        <p>好友首次咨询获得¥100优惠</p>
                        <div class="friend-reward">¥100</div>
                    </div>
                </div>

                <div class="referral-actions">
                    <button class="referral-btn copy-link" onclick="copyReferralLink()">
                        📋 复制邀请链接
                    </button>
                    <button class="referral-btn share-wechat" onclick="shareToWechat()">
                        💬 分享到微信
                    </button>
                </div>
            </div>
        `;

        // 添加到页面
        const main = document.querySelector('main') || document.body;
        main.appendChild(referralSection);
    }

    setupSharing() {
        // 设置分享功能
        this.shareConfig = {
            title: '广西旅游达人 - 邀请有奖',
            text: `使用我的邀请码 ${this.referralCode} 咨询广西旅游服务，你获得¥100优惠，我获得¥50奖励！`,
            url: `${window.location.origin}?ref=${this.referralCode}`
        };
    }
}

// ==================== 初始化所有功能 ====================

document.addEventListener('DOMContentLoaded', () => {
    // 初始化社交分享
    const socialShare = new SocialShare();

    // 初始化引流功能
    const leadGeneration = new LeadGeneration();

    // 初始化裂变营销
    const viralMarketing = new ViralMarketing();

    // 全局函数
    window.closeShareQRModal = function() {
        const modal = document.getElementById('shareQRModal');
        modal.classList.remove('active');
    };

    window.closeLeadForm = function() {
        const modal = document.getElementById('leadFormModal');
        modal.classList.remove('active');
    };

    window.submitLeadForm = function(event) {
        event.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            interest: document.getElementById('interest').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toISOString()
        };

        // 保存数据
        leadGeneration.saveLeadData({
            ...leadGeneration.leadData,
            action: 'form_submit',
            form_data: formData
        });

        // 显示成功消息
        alert('咨询已提交，我们会尽快联系您！');

        // 关闭表单
        closeLeadForm();

        // 清空表单
        event.target.reset();
    };

    window.copyReferralLink = function() {
        const link = `${window.location.origin}?ref=${viralMarketing.referralCode}`;
        navigator.clipboard.writeText(link).then(() => {
            alert('邀请链接已复制到剪贴板！');
        });
    };

    window.shareToWechat = function() {
        alert('请将邀请链接分享到微信');
    };
});

// ==================== 导出函数供外部使用 ====================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SocialShare,
        LeadGeneration,
        ViralMarketing
    };
}