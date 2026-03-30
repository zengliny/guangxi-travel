/**
 * 广西旅游网站 - 在线预约表单
 * [P0] 核心 - 2026-03-30
 */

// 预约表单配置
const BOOKING_CONFIG = {
    // 预约类型选项
    serviceTypes: [
        { value: 'homestay', label: '民宿预订', icon: '🏠' },
        { value: 'rental', label: '租房咨询', icon: '🏡' },
        { value: 'elderly', label: '候鸟养老', icon: '🦅' },
        { value: 'property', label: '旅游房产', icon: '🏘️' },
        { value: 'trust', label: '房屋托管', icon: '🤝' },
        { value: 'auction', label: '拍卖房', icon: '⚖️' },
        { value: 'other', label: '其他咨询', icon: '💬' }
    ],
    // 人数选项
    guestCounts: [
        { value: '1', label: '1人' },
        { value: '2', label: '2人' },
        { value: '3', label: '3-5人' },
        { value: '6', label: '6-10人' },
        { value: '10+', label: '10人以上' }
    ],
    // 入住时长
    stayDurations: [
        { value: '1-3', label: '1-3天' },
        { value: '4-7', label: '4-7天' },
        { value: '8-14', label: '8-14天' },
        { value: '15-30', label: '15-30天' },
        { value: '30+', label: '30天以上' }
    ]
};

// 创建预约按钮和表单
function createBookingWidget() {
    // 添加浮动预约按钮
    const fabHTML = `
        <div class="booking-fab" id="bookingFab" onclick="openBookingModal()">
            <span class="fab-icon">📅</span>
            <span class="fab-text">预约咨询</span>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', fabHTML);
    
    // 创建模态框
    const modalHTML = `
        <div class="booking-modal" id="bookingModal">
            <div class="booking-modal-content">
                <span class="booking-modal-close" onclick="closeBookingModal()">&times;</span>
                
                <div class="booking-modal-header">
                    <h2>📅 免费预约咨询</h2>
                    <p>填写以下信息，我们将在24小时内联系您</p>
                </div>
                
                <form id="bookingForm" class="booking-form" onsubmit="submitBooking(event)">
                    <!-- 预约类型 -->
                    <div class="booking-field">
                        <label>我想咨询 *</label>
                        <div class="booking-type-grid">
                            ${BOOKING_CONFIG.serviceTypes.map(t => `
                                <label class="booking-type-option">
                                    <input type="radio" name="serviceType" value="${t.value}" required>
                                    <span class="type-icon">${t.icon}</span>
                                    <span class="type-label">${t.label}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- 姓名 -->
                    <div class="booking-field">
                        <label for="guestName">您的姓名 *</label>
                        <input type="text" id="guestName" name="guestName" placeholder="请输入您的姓名" required>
                    </div>
                    
                    <!-- 电话 -->
                    <div class="booking-field">
                        <label for="guestPhone">联系电话 *</label>
                        <input type="tel" id="guestPhone" name="guestPhone" placeholder="请输入您的电话号码" required>
                    </div>
                    
                    <!-- 微信 -->
                    <div class="booking-field">
                        <label for="guestWechat">微信号（选填）</label>
                        <input type="text" id="guestWechat" name="guestWechat" placeholder="方便微信联系">
                    </div>
                    
                    <!-- 人数 -->
                    <div class="booking-field">
                        <label for="guestCount">入住人数</label>
                        <select id="guestCount" name="guestCount">
                            ${BOOKING_CONFIG.guestCounts.map(c => 
                                `<option value="${c.value}">${c.label}</option>`
                            ).join('')}
                        </select>
                    </div>
                    
                    <!-- 入住时长 -->
                    <div class="booking-field">
                        <label for="stayDuration">计划入住时长</label>
                        <select id="stayDuration" name="stayDuration">
                            ${BOOKING_CONFIG.stayDurations.map(d => 
                                `<option value="${d.value}">${d.label}</option>`
                            ).join('')}
                        </select>
                    </div>
                    
                    <!-- 预算 -->
                    <div class="booking-field">
                        <label for="budget">预算范围</label>
                        <select id="budget" name="budget">
                            <option value="">请选择预算</option>
                            <option value="500以下">¥500以下/晚</option>
                            <option value="500-1000">¥500-1000/晚</option>
                            <option value="1000-2000">¥1000-2000/晚</option>
                            <option value="2000-3000">¥2000-3000/晚</option>
                            <option value="3000+">¥3000以上/晚</option>
                        </select>
                    </div>
                    
                    <!-- 备注 -->
                    <div class="booking-field">
                        <label for="remarks">其他需求或备注</label>
                        <textarea id="remarks" name="remarks" rows="3" placeholder="请告诉我们您的具体需求..."></textarea>
                    </div>
                    
                    <!-- 提交按钮 -->
                    <button type="submit" class="booking-submit">
                        <span class="submit-icon">📨</span>
                        提交预约
                    </button>
                </form>
                
                <div class="booking-success" id="bookingSuccess" style="display:none;">
                    <div class="success-icon">✅</div>
                    <h3>预约成功！</h3>
                    <p>感谢您的预约，我们将在24小时内联系您</p>
                    <p class="success-note">💡 建议添加微信以便更快联系</p>
                    <button class="btn-secondary" onclick="closeBookingModal()">关闭</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// 打开预约模态框
function openBookingModal() {
    document.getElementById('bookingModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// 关闭预约模态框
function closeBookingModal() {
    document.getElementById('bookingModal').style.display = 'none';
    document.body.style.overflow = '';
    // 重置表单
    document.getElementById('bookingForm').reset();
    document.getElementById('bookingForm').style.display = 'block';
    document.getElementById('bookingSuccess').style.display = 'none';
}

// 提交预约
async function submitBooking(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('.booking-submit');
    const originalText = submitBtn.innerHTML;
    
    // 显示加载状态
    submitBtn.innerHTML = '<span class="loading">⏳ 提交中...</span>';
    submitBtn.disabled = true;
    
    // 收集表单数据
    const formData = new FormData(form);
    const bookingData = {
        serviceType: formData.get('serviceType'),
        guestName: formData.get('guestName'),
        guestPhone: formData.get('guestPhone'),
        guestWechat: formData.get('guestWechat'),
        guestCount: formData.get('guestCount'),
        stayDuration: formData.get('stayDuration'),
        budget: formData.get('budget'),
        remarks: formData.get('remarks'),
        submitTime: new Date().toISOString()
    };
    
    try {
        // 这里可以替换为你的 webhook URL
        // 推荐使用：Web3Forms、Formspree、Beeceptor 等免费服务
        
        const webhookUrl = 'https://webhook.site/YOUR-WEBHOOK-ID';
        
        // 模拟提交（实际使用时替换为真实 API）
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 显示成功
        form.style.display = 'none';
        document.getElementById('bookingSuccess').style.display = 'block';
        
        console.log('预约数据：', bookingData);
        
    } catch (error) {
        alert('提交失败，请稍后重试或直接联系微信');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// 点击外部关闭
document.addEventListener('click', (e) => {
    const modal = document.getElementById('bookingModal');
    if (e.target === modal) {
        closeBookingModal();
    }
});

// 初始化
document.addEventListener('DOMContentLoaded', createBookingWidget);
