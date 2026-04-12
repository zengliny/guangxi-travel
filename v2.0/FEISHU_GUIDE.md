# 飞书机器人配置指南

## 获取飞书机器人 Webhook

1. 打开飞书，创建一个群聊
2. 点击群设置 → 机器人 → 自定义机器人
3. 输入机器人名称，选择发送消息权限
4. 复制 Webhook 地址和密钥

## 配置环境变量

在项目根目录创建 `.env` 文件：

```env
FEISHU_BOT_WEBHOOK=https://open.feishu.cn/open-apis/bot/v2/hook/your-bot-id
FEISHU_BOT_SECRET=your-bot-secret
```

## 功能说明

### 1. 工单通知
当用户提交工单时，飞书机器人会发送卡片消息：

```
**#123 咨询工单**
用户咨询内容...

用户: 张三 | 电话: 13800138000
状态: 待处理
[查看详情]
```

### 2. 优惠券通知
当用户获得优惠券时：

```
🎉 恭喜！你获得了一张优惠券
**面额: ¥100**
优惠码: GXTL2024XXXX
```

### 3. 智能客服
用户在飞书中发送消息，机器人会自动回复：

- "涠洲岛" → 景点介绍
- "民宿" → 推荐民宿
- "路线" → 推荐路线
- "客服" → 转人工

## API 集成

### 发送文本消息
```typescript
import { getFeishuBot } from '../shared/feishu-bot'

const bot = getFeishuBot()
await bot.sendText('您好！欢迎咨询广西旅游')
```

### 发送卡片消息
```typescript
const card = {
  config: { wide_screen_mode: true },
  elements: [
    { tag: 'text', text: { content: '欢迎消息' } }
  ]
}
await bot.sendCard(card)
```

### 发送工单通知
```typescript
await bot.sendTicketNotification({
  id: '123',
  user: '张三',
  phone: '13800138000',
  type: '咨询',
  content: '我想咨询涠洲岛民宿',
  status: '待处理'
})
```

## 注意事项

1. 飞书机器人免费版只支持 Webhook 方式
2. 每个群最多可添加 5 个机器人
3. Webhook 地址需要公网可访问
4. 建议使用 Cloudflare Tunnel 暴露本地服务
