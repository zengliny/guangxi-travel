# v2.0 升级实施文档

## 项目架构

### 技术栈
- **前端**: Next.js + React + Tailwind CSS
- **后端**: Cloudflare Workers (D1 Database)
- **认证**: Lucia + JWT
- **消息**: 飞书机器人 + 飞书开放平台

### 部署架构
```
用户请求
   ↓
Cloudflare Pages (静态文件)
   ↓
Cloudflare Workers (API 处理)
   ↓
D1 Database (SQLite 兼容)
   ↓
飞书机器人 (消息推送)
```

## 免费服务清单

| 服务 | 配额 | 备注 |
|------|------|------|
| Cloudflare Pages | 500 次部署/月 | 完全免费 |
| Cloudflare Workers | 10 万请求/天 | 免费版足够 |
| D1 Database | 500 万行读取/月 | 免费版 |
| 飞书机器人 | 无限制 | Webhook 免费 |

## 实施步骤

### Phase 1: 基础设施 (1周)
- [x] 项目初始化
- [x] 数据库 Schema 设计
- [x] API 路由定义
- [ ] 部署到 Cloudflare
- [ ] 配置域名和 DNS

### Phase 2: 核心功能 (2周)
- [ ] 用户注册/登录
- [ ] 收藏功能
- [ ] 邀请返利系统
- [ ] 在线客服集成

### Phase 3: CMS 后台 (1周)
- [ ] 景点管理
- [ ] 民宿管理
- [ ] 订单管理
- [ ] 数据报表

### Phase 4: 前端集成 (1周)
- [ ] React 组件开发
- [ ] API 集成
- [ ] 样式调整
- [ ] 性能优化

### Phase 5: 测试部署 (1周)
- [ ] 功能测试
- [ ] 性能测试
- [ ] 生产部署

## 环境配置

### .env.example
```env
# 飞书机器人配置
FEISHU_BOT_WEBHOOK=https://open.feishu.cn/open-apis/bot/v2/hook/xxx
FEISHU_BOT_SECRET=your-secret

# JWT 密钥
JWT_SECRET=your-super-secret-jwt-key

# 应用配置
APP_URL=https://guangxi-travel.pages.dev
```

## 数据库迁移

```bash
# 推送 schema 到 D1
npx wrangler d1 execute <database-name> --file=shared/database-schema.ts

# 或使用 D1 UI 执行 SQL
```

## API 端点

| 方法 | 端点 | 说明 |
|------|------|------|
| GET | /api/destinations | 景点列表 |
| POST | /api/destinations | 创建景点 |
| GET | /api/properties | 民宿列表 |
| POST | /api/properties | 创建民宿 |
| POST | /api/orders | 创建订单 |
| GET | /api/dashboard | 仪表盘数据 |

## 部署命令

```bash
# 本地开发
npm run dev

# 构建
npm run build

# 部署
npx wrangler pages deploy pages --project-name=guangxi-travel-v2
```

## 成本预算

| 项目 | 月成本 | 备注 |
|------|--------|------|
| Cloudflare Pages | $0 | 免费 |
| Cloudflare Workers | $0 | 免费 |
| D1 Database | $0 | 免费 |
| 飞书 | $0 | 免费 |
| 域名 | $10-20 | 可选 |

**总成本: $0-20/月**
