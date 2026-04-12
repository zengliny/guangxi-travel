# Cloudflare D1 数据库使用指南

## 创建 D1 数据库

```bash
# 创建数据库
npx wrangler d1 create guangxi-travel-db

# 查看数据库列表
npx wrangler d1 list
```

## 推送 Schema

```bash
# 推送 schema 到数据库
npx wrangler d1 execute guangxi-travel-db --file=shared/database-schema.ts

# 或者直接执行 SQL
npx wrangler d1 execute guangxi-travel-db --command="SELECT * FROM users;"
```

## 在 Worker 中使用

```typescript
// worker/index.ts
export default {
  async fetch(request, env) {
    // env.DB 是 D1Database 实例
    const result = await env.DB.prepare('SELECT * FROM users').all()
    return Response.json(result.results)
  },
}
```

## 数据库表清单

### 用户相关
- `users` - 用户表
- `user_profiles` - 用户资料表
- `favorites` - 收藏表
- `browsing_history` - 浏览记录

### 营销相关
- `referral_codes` - 邀请码表
- `referrals` - 邀请记录表
- `rewards` - 奖励记录表

### 内容相关
- `destinations` - 景点表
- `properties` - 民宿表

### 订单相关
- `orders` - 订单表

### 客服相关
- `customer_messages` - 客服消息表
- `tickets` - 工单表
- `agent_ratings` - 客服评价表

### 系统相关
- `sms_codes` - 短信验证码表
- `notifications` - 消息通知表

## 查询示例

```typescript
// 获取用户收藏
const favorites = await env.DB
  .prepare('SELECT * FROM favorites WHERE user_id = ?')
  .bind(userId)
  .all()

// 分页查询
const properties = await env.DB
  .prepare('SELECT * FROM properties LIMIT ? OFFSET ?')
  .bind(limit, offset)
  .all()

// 统计查询
const stats = await env.DB
  .prepare('SELECT COUNT(*) as total FROM users')
  .all()
```

## 本地测试

```bash
# 本地运行 Worker（连接 D1）
npx wrangler dev --d1=guangxi-travel-db

# 或使用 Pages 本地开发
npx wrangler pages dev pages --d1=guangxi-travel-db
```

## 配额限制（免费版）

| 操作 | 配额 | 备注 |
|------|------|------|
| 读取 | 500 万行/月 | 超出后按量付费 |
| 写入 | 50 万行/月 | 超出后按量付费 |
| 存储 | 1 GB | 足够小型项目 |

## 备份和导出

```bash
# 导出数据库
npx wrangler d1 execute guangxi-travel-db --file=backup.sql

# 导入数据库
npx wrangler d1 execute guangxi-travel-db --file=backup.sql
```
