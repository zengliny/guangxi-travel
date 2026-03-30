/**
 * 广西旅游网站 - 内容数据
 * 
 * 更新方式：直接修改此文件的JSON数据即可，无需动HTML
 * 格式：板块ID => { title, description, items: [] }
 * 
 * [P0] 核心配置 - 2026-03-30
 */

// 导航配置
const NAV_CONFIG = {
    logo: "🏝️ 广西旅游",
    items: [
        { id: "destinations", label: "景点攻略", icon: "🗺️" },
        { id: "homestay", label: "民宿推荐", icon: "🏠" },
        { id: "rental", label: "租房信息", icon: "🏡" },
        { id: "elderly", label: "候鸟养老", icon: "🦅" },
        { id: "property", label: "旅游房产", icon: "🏘️" },
        { id: "托管", label: "房屋托管", icon: "🤝" },
        { id: "auction", label: "拍卖房", icon: "⚖️" },
        { id: "exchange", label: "房屋置换", icon: "🔄" },
        { id: "contact", label: "联系我们", icon: "📞" }
    ]
};

// 站点SEO配置
const SEO_CONFIG = {
    siteName: "广西旅游达人",
    siteDescription: "广西本地旅游达人，带你玩转涠洲岛、德天瀑布、阳朔。提供私人导游、特色民宿、租房、候鸟养老、旅游房产、房屋托管等服务。",
    keywords: "广西旅游,涠洲岛,德天瀑布,阳朔,民宿,租房,候鸟养老,旅游房产,房屋托管,北海旅游,广西民宿,广西租房",
    author: "广西旅游达人",
    baseUrl: "https://guangxi-travel.pages.dev"
};

// ==================== 板块内容配置 ====================

// 1. 热门景点
CONTENT.destinations = {
    title: "热门景点",
    description: "广西热门旅游景点攻略，涠洲岛、德天瀑布、阳朔西街等",
    items: [
        {
            id: "weizhou",
            name: "涠洲岛",
            description: "中国最大火山岛，鳄鱼山、贝壳沙滩、滴水丹屏，看日出日落最佳目的地",
            tags: ["🚢 上岛需乘船", "🏖️ 海岛风光", "🌅 日落绝美"],
            highlight: "必去",
            price: "上岛费98元",
            season: "全年适宜，5-10月最佳"
        },
        {
            id: "detian",
            name: "德天瀑布",
            description: "亚洲第一、世界第四大跨国瀑布，与越南板约瀑布相连",
            tags: ["🌊 瀑布奇观", "🇻🇳 边境游", "🎬 仙剑取景地"],
            highlight: "壮观",
            price: "门票80元",
            season: "全年适宜，7-9月水量最大"
        },
        {
            id: "yangshuo",
            name: "阳朔西街",
            description: "漓江畔的地球村，洋人街、啤酒鱼、田螺酿，夜晚最热闹",
            tags: ["🎭 夜生活", "🍜 美食天堂", "🚴 骑行圣地"],
            highlight: "网红",
            price: "免费",
            season: "全年适宜，4-10月天气最好"
        },
        {
            id: " Guilin",
            name: "桂林象山",
            description: "桂林山水甲天下，象鼻山是桂林山水的象征",
            tags: ["🏔️ 山水甲天下", "📸 地标", "🎋 漓江精华"],
            highlight: "经典",
            price: "门票55元",
            season: "全年适宜"
        }
    ]
};

// 2. 民宿推荐
CONTENT.homestay = {
    title: "民宿推荐",
    description: "北海、涠洲岛、阳朔等地优质民宿推荐，海景房、亲子游、情侣度假",
    items: [
        {
            id: "homestay-1",
            name: "涠洲岛·南湾海景民宿",
            description: "直面大海，步行可达沙滩，阳台看日出，管家式服务",
            tags: ["🌊 海景房", "🧘 休闲度假", "👨‍👩‍👧 亲子"],
            location: "涠洲岛南湾街",
            price: "¥280-680/晚",
            features: ["海景阳台", "早餐免费", "接送服务"]
        },
        {
            id: "homestay-2",
            name: "北海·银滩壹号海景公寓",
            description: "银滩旁一线海景，步行3分钟到沙滩，厨房可做饭",
            tags: ["🏖️ 银滩旁", "👨‍👩‍👧‍👦 家庭", "🍳 可做饭"],
            location: "北海银海区",
            price: "¥188-450/晚",
            features: ["一线海景", "厨房", "停车位"]
        },
        {
            id: "homestay-3",
            name: "阳朔·遇龙河畔民宿",
            description: "遇龙河畔田园风格，骑行十里画廊，品当地农家菜",
            tags: ["🚴 骑行", "🌾 田园", "🍜 美食"],
            location: "阳朔遇龙河",
            price: "¥220-500/晚",
            features: ["田园风光", "自行车免费", "旅游攻略"]
        }
    ]
};

// 3. 租房信息
CONTENT.rental = {
    title: "租房信息",
    description: "北海、涠洲岛长短租房源，月租、季租、年租，拎包入住",
    items: [
        {
            id: "rental-1",
            name: "北海银滩·海景两室",
            description: "银滩旁精装两房，季度起租，家具家电齐全，拎包入住",
            tags: ["🏖️ 海景", "📅 季度租", "🛋️ 拎包入住"],
            location: "北海银海区",
            price: "¥1800-2800/月",
            features: ["海景", "电梯", "物业"]
        },
        {
            id: "rental-2",
            name: "涠洲岛·岛上小院",
            description: "岛上独栋小院，年租优先，自带菜地，适合长居养老",
            tags: ["🏡 小院", "🌱 菜地", "🦅 养老"],
            location: "涠洲岛",
            price: "¥1200-2000/月",
            features: ["独栋", "菜地", "安静"]
        },
        {
            id: "rental-3",
            name: "北海市区·高铁站旁公寓",
            description: "高铁站旁，交通便利，一室一厅，适合候鸟中转",
            tags: ["🚄 交通便利", "📍 高铁站", "👔 商旅"],
            location: "北海火车站旁",
            price: "¥1200-1800/月",
            features: ["交��便利", "配套完善", "安保"]
        }
    ]
};

// 4. 候鸟养老
CONTENT.elderly = {
    title: "候鸟养老",
    description: "北海过冬养老优势分析，气候、物价、医疗配套，候鸟老人首选",
    items: [
        {
            id: "elderly-1",
            name: "北海过冬优势",
            description: "年均气温23°C，冬季温暖，空气质量全国前列，物价适中",
            tags: ["🌡️ 温暖", "🍃 空气好", "💰 物价低"],
            highlight: "优势"
        },
        {
            id: "elderly-2",
            name: "医疗配套",
            description: "北海市人民医院、人民医院等三甲医院，候鸟老人医保异地备案",
            tags: ["🏥 医疗", "📋 医保", "🚑 急诊"],
            highlight: "配套"
        },
        {
            id: "elderly-3",
            name: "养老社区推荐",
            description: "银海区、铁山港区等区域候鸟老人聚集社区，生活配套成熟",
            tags: ["👥 聚集区", "🛒 配套", "🎵 活动"],
            highlight: "社区"
        },
        {
            id: "elderly-4",
            name: "过冬租房攻略",
            description: "10月-次年3月为旺季，建议9月前预订，避开节假日高峰期",
            tags: ["📅 最佳时间", "💡 预订技巧", "⚠️ 注意事项"],
            highlight: "攻略"
        }
    ]
};

// 5. 旅游房产
CONTENT.property = {
    title: "旅游房产",
    description: "北海、涠洲岛、阳朔旅游地产投资分析，民宿经营价值，升值潜力",
    items: [
        {
            id: "property-1",
            name: "北海银滩海景房",
            description: "一线海景房，民宿经营首选，旺季租金回报率高，投资自住两宜",
            tags: ["💎 一线海景", "📈 投资", "🏠 民宿"],
            location: "北海银滩",
            priceRange: "¥8000-15000/㎡"
        },
        {
            id: "property-2",
            name: "涠洲岛稀缺地块",
            description: "岛上土地稀缺，景区旁民宿用地，永久产权，未来可期",
            tags: ["🏝️ 稀缺", "📈 升值", "🔑 永久产权"],
            location: "涠洲岛",
            priceRange: "面议"
        },
        {
            id: "property-3",
            name: "阳朔遇龙河景区房",
            description: "遇龙河畔民宿集群，景区内商业配套完善，投资回报稳定",
            tags: ["🎯 景区", "📊 回报稳定", "🏨 民宿集群"],
            location: "阳朔遇龙河",
            priceRange: "¥12000-20000/㎡"
        }
    ]
};

// 6. 房屋托管
CONTENT.trust = {
    title: "房屋托管",
    description: "北海、涠洲岛房屋托管服务，帮你省心做房东，收益稳定",
    items: [
        {
            id: "trust-1",
            name: "民宿托管",
            description: "专业民宿运营团队，帮你装修、运营、收益分成，省心省力",
            tags: ["🏠 民宿", "📊 收益分成", "🔧 装修"],
            service: ["专业装修", "平台运营", "24h客服", "保洁布草"]
        },
        {
            id: "trust-2",
            name: "长租托管",
            description: "房屋出租托管，帮你招租、维修、收租，适合异地房东",
            tags: ["📅 长租", "🔧 维修", "💰 收租"],
            service: ["招租", "维修", "收租", "法律咨询"]
        },
        {
            id: "trust-3",
            name: "资产托管",
            description: "房屋资产全面管理，定期维护、保险、增值服务，适合投资客",
            tags: ["📈 增值", "🛡️ 保险", "🔍 定期维护"],
            service: ["定期维护", "保险", "增值服务", "出售代理"]
        }
    ]
};

// 7. 拍卖房
CONTENT.auction = {
    title: "拍卖房",
    description: "北海法拍房、法院拍卖房信息，手续代办，清场交付",
    items: [
        {
            id: "auction-1",
            name: "北海法拍房",
            description: "法院拍卖房源，价格低于市场价20-30%，可贷款，产权清晰",
            tags: ["⚖️ 法拍", "💰 低于市价", "🏦 可贷款"],
            note: "需了解案件背景，避坑指南请咨询"
        },
        {
            id: "auction-2",
            name: "不良资产处置",
            description: "银行不良资产处置房源低于市场价，笋盘推荐，专业评估",
            tags: ["🏦 银行", "📉 笋盘", "🔍 评估"],
            note: "专业尽调，规避风险"
        },
        {
            id: "auction-3",
            name: "拍卖手续代办",
            description: "全流程代办：竞拍指导、贷款、过户、清场，省心无忧",
            tags: ["📋 代办", "🔑 过户", "🧹 清场"],
            service: ["竞拍指导", "贷款协调", "过户办理", "清场交付"]
        }
    ]
};

// 8. 房屋置换
CONTENT.exchange = {
    title: "房屋置换",
    description: "房屋置换服务，换购、换租，帮你找到理想房源",
    items: [
        {
            id: "exchange-1",
            name: "换购服务",
            description: "现有房屋换购更大、更好位置房源，差价补齐，一站式服务",
            tags: ["🏠 换大", "📈 升级", "🔄 一站式"],
            process: ["评估报价", "配对房源", "签约过户", "交房入住"]
        },
        {
            id: "exchange-2",
            name: "换租服务",
            description: "短租换长租、长租换短租，季节性灵活调整，租金差价互补",
            tags: ["📅 灵活", "💹 差价互补", "📱 便捷"],
            process: ["需求登记", "匹配房源", "签约入住"]
        },
        {
            id: "exchange-3",
            name: "跨城市置换",
            description: "广西区内城市间置换，北海、桂林、南宁、柳州等城市联动",
            tags: ["🏙️ 多城", "🔗 联动", "📊 评估"],
            process: ["多城联动", "价格评估", "流程代办", "无忧入住"]
        }
    ]
};

// 9. 联系方式
CONTENT.contact = {
    title: "联系我们",
    description: "添加微信/电话咨询，获取免费旅游攻略、房源推荐",
    items: [
        {
            id: "wechat",
            name: "微信咨询",
            description: "添加微信，获取一对一服务",
            value: "扫码添加",
            qrcode: "images/wechat-qr.jpg"
        },
        {
            id: "phone",
            name: "电话咨询",
            description: "工作日9:00-18:00",
            value: "1XX-XXXX-XXXX"
        },
        {
            id: "location",
            name: "办公地址",
            description: "广西北海市银海区",
            value: "具体地址详询"
        }
    ]
};

// ==================== 导出配置 ====================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NAV_CONFIG, SEO_CONFIG, CONTENT };
}