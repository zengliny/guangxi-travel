/**
 * 广西旅游网站 - SEO 增强
 * [P0] 核心 - 2026-03-30
 */

// SEO 配置
const SEO_CONFIG = {
    siteName: "广西旅游达人",
    siteDescription: "广西本地旅游达人，带你玩转涠洲岛、德天瀑布、阳朔。提供私人导游、特色民宿、租房、候鸟养老、旅游房产、房屋托管等服务。",
    keywords: "广西旅游,涠洲岛,德天瀑布,阳朔,民宿,租房,候鸟养老,旅游房产,房屋托管,北海旅游,广西民宿,广西租房",
    url: "https://guangxi-travel.pages.dev",
    author: "广西旅游达人",
    locale: "zh_CN",
    socialImage: "https://guangxi-travel.pages.dev/og-image.jpg"
};

// 生成 Article 结构化数据
function generateArticleSchema(article) {
    return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article.title,
        "description": article.description,
        "image": article.image || SEO_CONFIG.socialImage,
        "author": {
            "@type": "Person",
            "name": SEO_CONFIG.author
        },
        "datePublished": article.date,
        "dateModified": article.updated || article.date,
        "publisher": {
            "@type": "Organization",
            "name": SEO_CONFIG.siteName,
            "logo": {
                "@type": "ImageObject",
                "url": SEO_CONFIG.socialImage
            }
        }
    };
}

// 生成 FAQ 结构化数据
function generateFAQSchema(faqs) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };
}

// 生成 LocalBusiness 结构化数据
function generateLocalBusinessSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "TravelAgency",
        "name": SEO_CONFIG.siteName,
        "description": SEO_CONFIG.siteDescription,
        "url": SEO_CONFIG.url,
        "telephone": "+86-777-xxxxxxx",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "北海市",
            "addressRegion": "广西",
            "addressCountry": "CN"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "21.4733",
            "longitude": "109.1140"
        },
        "openingHours": "Mo-Su 08:00-22:00",
        "priceRange": "¥100-¥3000",
        "areaServed": {
            "@type": "State",
            "name": "广西壮族自治区"
        },
        "serviceType": [
            "旅游咨询",
            "民宿预订",
            "租房服务",
            "候鸟养老",
            "旅游房产",
            "房屋托管"
        ]
    };
}

// 生成 BreadcrumbList 结构化数据
function generateBreadcrumbSchema(categories) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": categories.map((cat, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": cat.name,
            "item": SEO_CONFIG.url + cat.url
        }))
    };
}

// 更新页面 SEO
function updatePageSEO(section) {
    const content = CONTENT[section];
    if (!content) return;
    
    // 更新标题
    document.title = `${content.title} | ${SEO_CONFIG.siteName}`;
    
    // 更新 meta 描述
    let desc = document.querySelector('meta[name="description"]');
    if (desc) {
        desc.setAttribute('content', content.description);
    }
    
    // 更新 Open Graph
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    
    if (ogTitle) ogTitle.setAttribute('content', `${content.title} | ${SEO_CONFIG.siteName}`);
    if (ogDesc) ogDesc.setAttribute('content', content.description);
}

// 初始化 SEO
function initSEO() {
    // 添加 LocalBusiness 结构化数据
    const localBusinessScript = document.createElement('script');
    localBusinessScript.type = 'application/ld+json';
    localBusinessScript.textContent = JSON.stringify(generateLocalBusinessSchema());
    document.head.appendChild(localBusinessScript);
    
    // 监听 section 切换更新 SEO
    if (typeof updateContent === 'function') {
        const originalUpdate = updateContent;
        window.updateContent = function(sectionId) {
            originalUpdate(sectionId);
            updatePageSEO(sectionId);
        };
    }
    
    console.log('✅ SEO 增强已加载');
}

// 初始化
document.addEventListener('DOMContentLoaded', initSEO);

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SEO_CONFIG, generateArticleSchema, generateFAQSchema, generateLocalBusinessSchema, generateBreadcrumbSchema };
}
