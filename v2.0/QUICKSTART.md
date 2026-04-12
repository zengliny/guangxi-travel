# v2.0 快速开始指南

## 前置要求
1. Node.js 18+
2. Cloudflare 账号
3. Wrangler CLI (`npm install -g wrangler`)

## 快速开始

### 1. 安装依赖
```bash
cd v2.0
npm install
```

### 2. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 填入必要配置
```

### 3. 创建 Cloudflare 资源
```bash
# 登录 Cloudflare
wrangler login

# 创建 KV 命名空间
wrangler kv:namespace create "GUANGXI_KV"

# 创建 D1 数据库
wrangler d1 create guangxi-travel-db
```

### 4. 本地开发
```bash
# 启动本地开发服务器
npm run dev
```

### 5. 部署
```bash
# 部署到 Workers
npm run build:worker
wrangler deploy

# 部署到 Pages
npx wrangler pages deploy pages --project-name=guangxi-travel-v2
```

## 项目结构
```
v2.0/
├── src/              # TypeScript 源码
│   ├── auth.ts       # 用户认证
│   ├── user-profile.ts  # 个人中心
│   ├── chat-page.ts  # 客服聊天
│   ├── referral-page.ts # 邀请返利
│   └── cms-page.ts   # CMS 后台
├── shared/           # 共享服务
│   ├── database-schema.ts  # 数据库 Schema
│   ├── user-service.ts     # 用户服务
│   ├── referral-service.ts # 邀请服务
│   ├── customer-service.ts # 客服服务
│   ├── feishu-bot.ts       # 飞书机器人
│   └── cms/               # CMS 服务
├── worker/           # Cloudflare Worker
│   ├── index.ts      # 入口文件
│   ├── api-routes.ts # API 路由
│   └── feishu-webhook.ts # 飞书 Webhook
└── pages/            # 静态页面
    ├── login.html    # 登录页面
    ├── chat.html     # 客服页面
    ├── referral.html # 邀请页面
    └── user/
        └── profile.html # 个人中心
```

## 免费服务配额
| 服务 | 配额 |
|------|------|
| Cloudflare Pages | 500次部署/月 |
| Cloudflare Workers | 10万请求/天 |
| D1 Database | 500万行读取/月 |
| 飞书机器人 | 无限制 |

## 下一步
1. 配置 `.env` 文件
2. 创建 D1 数据库并推送 Schema
3. 部署到 Cloudflare
4. 开始使用前端页面
