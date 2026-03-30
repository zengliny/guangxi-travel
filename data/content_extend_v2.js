/**
 * 广西旅游网站 - 内容扩展 v2
 * [P1|expire:2026-04-30] 内容扩展 - 2026-03-30
 */

// 扩展房屋托管
if (CONTENT.trust) {
    CONTENT.trust.items.push(
        {
            id: "trust-4",
            name: "民宿托管套餐A",
            description: "含民宿运营、客源对接、清洁维护，收益分成模式",
            tags: ["🏠 民宿运营", "📊 收益分成", "🧹 清洁维护"],
            highlight: "热门"
        },
        {
            id: "trust-5",
            name: "民宿托管套餐B",
            description: "全托管模式，业主只负责收钱，其他我们负责",
            tags: ["🔑 钥匙托管", "📞 24h响应", "💰 保底收益"],
            highlight: "省心"
        },
        {
            id: "trust-6",
            name: "长租托管服务",
            description: "房屋出租全程托管，筛选租客、维修协调、租金收取",
            tags: ["🔑 钥匙托管", "🔧 维修协调", "💵 月付租金"],
            highlight: "稳定"
        },
        {
            id: "trust-7",
            name: "资产托管计划",
            description: "多套房产统一管理，专业团队运营，适合投资型业主",
            tags: ["📈 资产配置", "👥 团队运营", "📊 月度报告"],
            highlight: "专业"
        }
    );
}

// 扩展拍卖房
if (CONTENT.auction) {
    CONTENT.auction.items.push(
        {
            id: "auction-4",
            name: "北海银海区法拍房",
            description: "银海区住宅，低于市场价30%，可贷款，已清场",
            tags: ["⚖️ 法拍", "💰 低于市价", "🏠 可贷款"],
            location: "北海银海区",
            priceRange: "¥45万起"
        },
        {
            id: "auction-5",
            name: "涠洲岛商业用地",
            description: "岛上稀缺商业用地，可做民宿、餐饮，永久产权",
            tags: ["🏝️ 稀缺", "📈 升值潜力", "🔑 永久产权"],
            location: "涠洲岛",
            priceRange: "¥180万起"
        },
        {
            id: "auction-6",
            name: "桂林学区房拍卖",
            description: "桂林中学旁学区房，优质教育资源，投资自住两宜",
            tags: ["📚 学区", "🏫 名校旁", "📈 保值"],
            location: "桂林秀峰区",
            priceRange: "¥65万起"
        },
        {
            id: "auction-7",
            name: "阳朔景区商铺",
            description: "西街旁商业铺面，人流量大，适合民宿或餐饮",
            tags: ["🎭 商业", "📍 西街旁", "💼 经营"],
            location: "阳朔西街",
            priceRange: "¥120万起"
        }
    );
}

// 扩展房屋置换
if (CONTENT.exchange) {
    CONTENT.exchange.items.push(
        {
            id: "exchange-4",
            name: "换购服务",
            description: "出售现有房产+补贴，换购目标房产，一站式服务",
            tags: ["🔄 卖旧买新", "💰 差价补贴", "📋 全程代办"],
            highlight: "便捷"
        },
        {
            id: "exchange-5",
            name: "换租服务",
            description: "短租换长租、长租换短租，灵活调配居住方式",
            tags: ["📅 灵活调配", "🔄 短租长租", "🏠 多种选择"],
            highlight: "灵活"
        },
        {
            id: "exchange-6",
            name: "跨城市置换",
            description: "广西房产置换到其他城市，或外地房产置换到广西",
            tags: ["🌍 跨城市", "🔗 资源对接", "📊 价值评估"],
            highlight: "全国"
        },
        {
            id: "exchange-7",
            name: "换房养老",
            description: "用城市房产置换养老房产，环境更好，配套更全",
            tags: ["🦅 养老", "🏞️ 环境好", "🏥 医疗配套"],
            highlight: "养老"
        }
    );
}

// 添加新的业务板块：本地生活
CONTENT.localLife = {
    title: "本地生活",
    description: "北海/涠洲岛本地美食、攻略、避坑指南",
    items: [
        {
            id: "local-1",
            name: "北海本地美食地图",
            description: "老街海鲜、侨港美食、本地人常去的店",
            tags: ["🍜 海鲜", "🐚 螺蛳粉", "📍 老街"],
            highlight: "必看"
        },
        {
            id: "local-2",
            name: "涠洲岛美食推荐",
            description: "香蕉猪、海鲜、岛民特色菜，必吃清单",
            tags: ["🍌 香蕉猪", "🦐 海鲜", "🏝️ 岛上"],
            highlight: "特色"
        },
        {
            id: "local-3",
            name: "防坑指南",
            description: "游客常踩的坑，这些事情不要做",
            tags: ["⚠️ 避坑", "💡 建议", "📵 警惕"],
            highlight: "实用"
        },
        {
            id: "local-4",
            name: "交通指南",
            description: "上岛船票、岛上租车、公交线路大全",
            tags: ["🚢 船票", "🛵 租车", "🚌 公交"],
            highlight: "必看"
        },
        {
            id: "local-5",
            name: "季节游玩攻略",
            description: "不同季节怎么玩，什么时候最好玩",
            tags: ["🌸 春", "☀️ 夏", "🍂 秋", "❄️ 冬"],
            highlight: "全年"
        }
    ]
};

console.log('✅ 内容扩展 v2 已加载');
