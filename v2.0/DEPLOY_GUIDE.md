# 部署指南

## 前置要求

1. Cloudflare 账号
2. Wrangler CLI (`npm install -g wrangler`)
3. Git 仓库

## 部署步骤

### 1. 创建 Cloudflare 项目

```bash
# 登录 Cloudflare
wrangler login

# 创建 Workers KV 命名空间
wrangler kv:namespace create "GUANGXI_KV"

# 创建 D1 数据库
wrangler d1 create guangxi-travel-db
```

### 2. 配置环境变量

```bash
# 设置环境变量
wrangler secret put JWT_SECRET
wrangler secret put FEISHU_BOT_WEBHOOK
wrangler secret put FEISHU_BOT_SECRET
```

### 3. 配置 wrangler.toml

```toml
name = "guangxi-travel-api"
main = "dist/worker.js"
compatibility_date = "2024-05-12"

kv_namespaces = [
  { binding = "GUANGXI_KV", id = "YOUR_KV_NAMESPACE_ID" }
]

durable_objects = {
  bindings = [
    { name = "GUANGXI_DURABLE", class_name = "DatabaseDurableObject", script_name = "guangxi-travel-api" }
  ]
}

workers_dev = true
```

### 4. 构建和部署

```bash
# 构建 Worker
npm run build:worker

# 部署到 Cloudflare
wrangler deploy

# 配置 Pages 部署
wrangler pages deploy pages --project-name=guangxi-travel-v2
```

## GitHub Actions 自动部署

创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Cloudflare
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy pages --project-name=guangxi-travel-v2
```

## 域名配置

1. 在 Cloudflare Pages 项目中绑定自定义域名
2. 配置 DNS 记录：
   ```
   A     @         192.0.2.1
   CNAME www       your-project.pages.dev
   ```
3. 等待 DNS 生效（通常 5-10 分钟）

## HTTPS 配置

Cloudflare Pages 自动提供 HTTPS：
1. 在项目设置中启用 Auto HTTPS
2. 选择 Full (Strict) 模式
3. 等待证书颁发（约 5 分钟）

## 监控和日志

```bash
# 查看 Worker 日志
wrangler logs

# 查看 Pages 部署日志
wrangler pages deployment list
```

## 回滚

```bash
# 列出历史部署
wrangler pages deployment list

# 回滚到指定部署
wrangler pages deployment rollback <deployment-id>
```
