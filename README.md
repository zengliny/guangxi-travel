# 广西旅游网站 - 内容更新指南

## 🚀 快速开始

### 方式一：直接修改数据文件
编辑 `data/content.js`，修改对应的板块内容即可：

```javascript
// 例如修改民宿推荐
CONTENT.homestay = {
    title: "民宿推荐",
    description: "新描述",
    items: [
        {
            id: "homestay-new",
            name: "新民宿名称",
            description: "民宿描述",
            tags: ["🏠 新标签"],
            location: "位置",
            price: "¥xxx/晚",
            features: ["特点1", "特点2"]
        }
    ]
};
```

### 方式二：通过 URL 参数指定板块
- `index.html#homestay` - 民宿板块
- `index.html#rental` - 租房板块
- `index.html#elderly` - 候鸟养老板块
- `index.html#property` - 旅游房产板块
- `index.html#trust` - 房屋托管板块
- `index.html#auction` - 拍卖房板块
- `index.html#exchange` - 房屋置换板块

---

## 📝 内容板块说明

| 板块ID | 名称 | 说明 |
|--------|------|------|
| destinations | 热门景点 | 涠洲岛、德天瀑布、阳朔等 |
| homestay | 民宿推荐 | 民宿信息、特点、价格 |
| rental | 租房信息 | 长短租房源 |
| elderly | 候鸟养老 | 北海过冬养老 |
| property | 旅游房产 | 投资分析 |
| trust | 房屋托管 | 托管服务 |
| auction | 拍卖房 | 法拍房信息 |
| exchange | 房屋置换 | 换购换租 |

---

## 🔧 数据结构说明

### 通用字段（所有板块）
```javascript
{
    id: "唯一标识",           // 必填，用于URL锚点
    name: "名称",             // 必填，标题
    description: "描述",      // 必填，详细描述
    tags: ["标签1", "标签2"], // 可选，标签
    highlight: "高亮",        // 可选，如"必去"、"热门"
}
```

### 民宿/租房专用
```javascript
{
    location: "位置",
    price: "价格",
    features: ["特点1", "特点2"]
}
```

### 房产专用
```javascript
{
    priceRange: "价格区间"
}
```

### 托管/置换专用
```javascript
{
    service: ["服务1", "服务2"]
}
```

---

## 🔍 SEO 优化说明

### 自动 SEO 功能
1. **动态 Title**：根据当前板块自动生成 `<title>`
2. **Meta 描述**：自动生成板块描述和关键词
3. **结构化数据**：自动生成 JSON-LD BreadcrumbList
4. **Open Graph**：社交媒体分享卡片
5. **Canonical 标签**：防止重复内容

### SEO 配置
在 `data/content.js` 中修改 `SEO_CONFIG`：

```javascript
const SEO_CONFIG = {
    siteName: "广西旅游达人",
    siteDescription: "站点描述",
    keywords: "关键词1,关键词2",
    baseUrl: "https://your-domain.pages.dev"
};
```

---

## 🚢 部署

### Cloudflare Pages（推荐）
1. 访问 https://pages.cloudflare.com
2. 连接 GitHub 仓库 `zengliny/guangxi-travel`
3. 构建命令留空
4. 输出目录填写 `.`
5. 点击部署

### 自定义域名
部署后在 Cloudflare 后台添加自定义域名即可。

---

## 📱 移动端适配
- 响应式布局，适配手机/平板
- 移动端汉堡菜单
- 平滑滚动
- 点击导航自动更新 SEO

---

## 📄 文件结构
```
guangxi-travel/
├── index.html      # 主页面
├── styles.css      # 样式文件
├── data/
│   └── content.js  # 内容数据（编辑这个文件即可更新内容）
└── README.md       # 说明文档
```

---

## ✅ 检查清单
- [x] 板块化内容架构（8个板块）
- [x] SEO 优化（Title、Meta、Schema、OG）
- [x] 动态内容加载（只需改 data/content.js）
- [x] 移动端适配
- [x] URL 锚点支持
- [x] 结构化数据（BreadcrumbList）