# 广西旅游获客网站

一个整合旅游+导游+民宿的获客落地页。

## 功能模块

- 🏝️ **热门景点** - 涠洲岛、德天瀑布、阳朔西街、南宁中山路
- 👨‍🏫 **导游服务** - 定制行程、包车接送、美食向导、拍照陪玩
- 🏨 **民宿推荐** - 合作民宿，会员价免费升级
- 📱 **获客转化** - 微信扫码/点击添加企业微信

## 部署方式

### 方式1：GitHub + Cloudflare（推荐）

```bash
# 1. 初始化 Git 仓库
cd guangxi-travel
git init
git add .
git commit -m "Initial: 广西旅游获客网站"

# 2. 推送到 GitHub（需要先在 GitHub 创建空仓库）
git remote add origin https://github.com/你的用户名/guangxi-travel.git
git branch -M main
git push -u origin main

# 3. Cloudflare 部署
# 登录 cloudflare.com → Pages → 创建项目 → 连接 GitHub → 选择仓库 → 自动部署
```

### 方式2：直接上传

将 `index.html` 和 `styles.css` 上传到你的服务器或托管平台即可。

## 自定义修改

| 文件 | 修改内容 |
|------|----------|
| `index.html` | 微信号、企业微信链接、电话号码 |
| `styles.css` | 配色方案、图片 |

## 预览

部署后访问你的 Cloudflare 域名即可预览。

---
*本项目用于获客咨询，非OTA平台*