/**
 * v2.0 客服聊天页面
 */

// ==================== 状态管理 ====================
interface Message {
    id: number;
    content: string;
    sender: 'user' | 'agent' | 'bot';
    timestamp: string;
    type: 'text' | 'image';
}

interface Ticket {
    id: number;
    title: string;
    status: 'pending' | 'processing' | 'resolved';
    type: '咨询' | '投诉' | '建议';
}

const chatStore = {
    messages: [] as Message[],
    tickets: [] as Ticket[],
    currentTicket: null as Ticket | null,

    addMessage(message: Message) {
        this.messages.push(message);
    },

    setTicket(ticket: Ticket) {
        this.currentTicket = ticket;
        this.tickets.push(ticket);
    },
};

// ==================== 智能客服机器人 ====================
class ChatBot {
    private responses: Record<string, string> = {
        '涠洲岛': '涠洲岛是广西最著名的海岛景区，推荐游玩火山口公园、五彩滩、滴水丹屏。',
        '德天瀑布': '德天瀑布是中国最大的跨国瀑布，位于中越边境，建议清晨或傍晚游览。',
        '阳朔': '阳朔以喀斯特地貌和田园风光闻名，推荐游览遇龙河、十里画廊、西街。',
        '民宿': '涠洲岛推荐住在南湾街附近，阳朔推荐西街周边或遇龙河沿岸。',
        '价格': '涠洲岛门票115元，德天瀑布115元，民宿价格200-800元/晚不等。',
        '路线': '推荐7天路线：桂林2天+阳朔2天+涠洲岛3天。',
    };

    async reply(message: string): Promise<string> {
        const lower = message.toLowerCase();

        // 关键词匹配
        for (const [keyword, response] of Object.entries(this.responses)) {
            if (lower.includes(keyword)) return response;
        }

        // 默认回复
        return '您好！我是广西旅游助手，可以帮您查询景点、民宿、路线等信息。';
    }
}

const chatBot = new ChatBot();

// ==================== 聊天界面 ====================
function initChat() {
    const form = document.getElementById('chat-form');
    if (!form) return;

    const input = document.getElementById('chat-input') as HTMLInputElement;
    const messagesContainer = document.getElementById('chat-messages');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const content = input.value.trim();
        if (!content) return;

        // 添加用户消息
        const userMessage: Message = {
            id: Date.now(),
            content,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString(),
            type: 'text',
        };

        chatStore.addMessage(userMessage);
        appendMessage(userMessage);
        input.value = '';

        // 显示机器人回复
        showTypingIndicator();

        const botResponse = await chatBot.reply(content);
        removeTypingIndicator();

        const botMessage: Message = {
            id: Date.now() + 1,
            content: botResponse,
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString(),
            type: 'text',
        };

        chatStore.addMessage(botMessage);
        appendMessage(botMessage);
    });
}

// ==================== 工单系统 ====================
function initTickets() {
    const form = document.getElementById('ticket-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = (form.elements.namedItem('title') as HTMLInputElement).value;
        const content = (form.elements.namedItem('content') as HTMLTextAreaElement).value;
        const type = (form.elements.namedItem('type') as HTMLSelectElement).value;

        if (!title || !content) {
            showNotification('请填写完整信息', 'error');
            return;
        }

        // 创建工单
        const ticket: Ticket = {
            id: Date.now(),
            title,
            status: 'pending',
            type,
        };

        chatStore.setTicket(ticket);

        // TODO: 调用真实 API

        showNotification('工单创建成功，我们会尽快联系您', 'success');
        form.reset();
    });
}

// ==================== UI 辅助函数 ====================
function appendMessage(message: Message) {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    const isUser = message.sender === 'user';
    const avatar = isUser
        ? '/images/avatar-default.png'
        : message.sender === 'bot'
        ? '/images/bot-avatar.png'
        : '/images/agent-avatar.png';

    container.innerHTML += `
        <div class="message ${isUser ? 'message-user' : 'message-agent'}">
            <img src="${avatar}" class="message-avatar" alt="avatar">
            <div class="message-content">
                <div class="message-text">${message.content}</div>
                <div class="message-time">${message.timestamp}</div>
            </div>
        </div>
    `;

    container.scrollTop = container.scrollHeight;
}

function showTypingIndicator() {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    container.innerHTML += `
        <div class="message message-bot">
            <img src="/images/bot-avatar.png" class="message-avatar" alt="bot">
            <div class="message-content">
                <div class="message-text typing">正在输入...</div>
            </div>
        </div>
    `;

    container.scrollTop = container.scrollHeight;
}

function removeTypingIndicator() {
    const typing = document.querySelector('.typing');
    if (typing) typing.parentElement.remove();
}

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
export function initChatPage() {
    initChat();
    initTickets();
}
