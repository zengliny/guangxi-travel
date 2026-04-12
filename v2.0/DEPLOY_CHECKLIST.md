# v2.0 部署检查清单

## 部署前检查

### 环境配置
- [ ] 创建 Cloudflare 账号
- [ ] 安装 Wrangler CLI (`npm install -g wrangler`)
- [ ] 登录 Cloudflare (`wrangler login`)

### 服务创建
- [ ] 创建 KV 命名空间 (`wrangler kv:namespace create "GUANGXI_KV"`)
- [ ] 创建 D1 数据库 (`wrangler d1 create guangxi-travel-db`)
- [ ] 记录数据库 ID 用于配置

### 环境变量
```bash
# 设置密钥
wrangler secret put JWT_SECRET
wrangler secret put FEISHU_BOT_WEBHOOK
wrangler secret put FEISHU_BOT_SECRET
```

### 配置文件
- [ ] `wrangler.toml` - Workers 配置
- [ ] `package.json` - 依赖配置
- [ ] `tsconfig.json` - TypeScript 配置
- [ ] `.env` - 环境变量 (从 `.env.example` 复制)

## 部署步骤

### 1. 构建项目
```bash
cd v2.0
npm install
npm run build:worker
```

### 2. 部署到 Cloudflare
```bash
# 部署 Worker
wrangler deploy

# 部署 Pages
npx wrangler pages deploy pages --project-name=guangxi-travel-v2
```

### 3. 配置 Pages 绑定
在 Cloudflare Dashboard → Pages → Settings → Functions:
- D1 Database: 选择 `guangxi-travel-db`
- Environment variables: 添加必要的变量

## 部署后验证

### API 测试
```bash
# 测试 API 端点
curl https://api.your-worker.workers.dev/api/destinations
```

### 数据库验证
```bash
# 查询用户表
wrangler d1 execute guangxi-travel-db --command="SELECT COUNT(*) FROM users;"

# 查询景点表
wrangler d1 execute guangxi-travel-db --command="SELECT COUNT(*) FROM destinations;"
```

### 飞书机器人测试
1. 在飞书中向机器人发送消息
2. 检查是否收到自动回复
3. 测试工单创建功能

## 常见问题

### 1. 部署失败
- 检查 `wrangler.toml` 配置
- 确认 API Token 有足够权限
- 查看错误日志 `wrangler logs`

### 2. D1 连接失败
- 确认数据库已创建
- 检查 Pages 绑定配置
- 验证环境变量设置

### 3. 飞书机器人无响应
- 检查 Webhook URL 是否正确
- 验证 Secret 是否匹配
- 查看飞书机器人日志

## 成本监控

### 免费配额
| 服务 | 配额 | 超出费用 |
|------|------|----------|
| Pages | 500次部署/月 | $5/月 |
| Workers | 10万请求/天 | $5/100万请求 |
| D1 | 500万行读取/月 | $0.50/100万请求 |

### 监控设置
1. Cloudflare Dashboard → Workers & Pages → 使用量
2. 设置预算警报
3. 定期检查使用情况

## 备份策略

### 数据库备份
```bash
# 导出数据库
wrangler d1 execute guangxi-travel-db --file=backup.sql
```

### 配置备份
```bash
# 备份环境变量
wrangler env:variable list > env.backup
```

## 更新和回滚

### 更新部署
```bash
# 重新部署
npm run build:worker
wrangler deploy

# 或使用 Pages
npx wrangler pages deploy pages --project-name=guangxi-travel-v2
```

### 回滚
```bash
# 列出历史部署
npx wrangler pages deployment list

# 回滚到指定部署
npx wrangler pages deployment rollback <deployment-id>
```
