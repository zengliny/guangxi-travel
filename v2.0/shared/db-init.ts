/**
 * v2.0 数据库初始化和迁移
 */

import { schema, indexes, views } from './database-schema';

/**
 * 推送 Schema 到 D1 数据库
 */
export async function pushSchema(db: D1Database): Promise<void> {
    try {
        // 执行主 schema
        await db.exec(schema);

        // 执行索引
        await db.exec(indexes);

        // 执行视图
        await db.exec(views);

        console.log('✅ Schema 推送成功');
    } catch (error) {
        console.error('❌ Schema 推送失败:', error);
        throw error;
    }
}

/**
 * 检查表是否存在
 */
export async function tableExists(db: D1Database, tableName: string): Promise<boolean> {
    const result = await db
        .prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`)
        .bind(tableName)
        .first();

    return !!result;
}

/**
 * 获取数据库统计信息
 */
export async function getDbStats(db: D1Database) {
    const tables = [
        'users', 'favorites', 'referrals', 'destinations', 'properties', 'orders'
    ];

    const stats: Record<string, number> = {};

    for (const table of tables) {
        const result = await db
            .prepare(`SELECT COUNT(*) as count FROM ${table}`)
            .first();

        stats[table] = result?.count || 0;
    }

    return stats;
}

/**
 * 初始化示例数据
 */
export async function seedData(db: D1Database): Promise<void> {
    console.log('🌱 开始填充示例数据...');

    // 示例景点
    const destinations = [
        {
            name: '涠洲岛',
            slug: 'weizhou',
            description: '中国最大、最年轻的火山岛，拥有独特的火山岩地貌和美丽的海滩',
            cover_image: '/images/destination1.jpg',
            images: JSON.stringify(['/images/destination1-1.jpg', '/images/destination1-2.jpg']),
            location: JSON.stringify({ lat: 21.55, lng: 109.12 }),
            address: '广西北海市涠洲岛',
            phone: '0779-1234567',
            opening_hours: '全天开放',
            price_range: '门票115元',
            best_season: '5-10月',
        },
        {
            name: '德天瀑布',
            slug: 'detian',
            description: '中国最大的跨国瀑布，位于中越边境，气势磅礴',
            cover_image: '/images/destination2.jpg',
            images: JSON.stringify(['/images/destination2-1.jpg']),
            location: JSON.stringify({ lat: 22.35, lng: 105.33 }),
            address: '广西崇左市大新县',
            phone: '0771-7890123',
            opening_hours: '08:00-18:00',
            price_range: '门票115元',
            best_season: '5-10月',
        },
        {
            name: '阳朔',
            slug: 'yangshuo',
            description: '以喀斯特地貌和田园风光闻名，是骑行和徒步的理想之地',
            cover_image: '/images/destination3.jpg',
            images: JSON.stringify(['/images/destination3-1.jpg']),
            location: JSON.stringify({ lat: 24.88, lng: 110.48 }),
            address: '广西桂林市阳朔县',
            phone: '0773-8888888',
            opening_hours: '全天开放',
            price_range: '免费',
            best_season: '4-10月',
        },
    ];

    for (const dest of destinations) {
        await db
            .prepare(
                `
                INSERT INTO destinations (name, slug, description, cover_image, images, location, address, phone, opening_hours, price_range, best_season)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(slug) DO NOTHING
            `
            )
            .bind(
                dest.name,
                dest.slug,
                dest.description,
                dest.cover_image,
                dest.images,
                dest.location,
                dest.address,
                dest.phone,
                dest.opening_hours,
                dest.price_range,
                dest.best_season
            )
            .run();
    }

    console.log('✅ 示例数据填充完成');
}
