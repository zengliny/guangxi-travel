/**
 * CMS 后台 API - 数据报表
 */

import { getOrders, getOrderStats } from './order-service'
import { getProperties, getProperty } from './property-service'
import { getDestinations, getDestination } from './destination-service'

/**
 * 获取综合统计
 */
export async function getDashboardStats(db: D1Database) {
  const [orderStats, userStats, engagementStats] = await Promise.all([
    getOrderStats(db),
    getUserStats(db),
    getEngagementStats(db),
  ])

  return {
    orders: orderStats,
    users: userStats,
    engagement: engagementStats,
    summary: {
      totalUsers: userStats.total_users,
      totalOrders: orderStats.total_orders,
      totalRevenue: orderStats.total_revenue,
      activeProperties: orderStats.confirmed_orders,
    },
  }
}

/**
 * 获取用户统计
 */
export async function getUserStats(db: D1Database) {
  const result = await db
    .prepare(
      `
      SELECT
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM users WHERE DATE(created_at) = DATE('now')) as today_registrations,
        (SELECT COUNT(DISTINCT user_id) FROM favorites) as total_favorites,
        (SELECT COUNT(DISTINCT user_id) FROM browsing_history) as active_visitors
      `
    )
    .all()

  return result.results?.[0] || {
    total_users: 0,
    today_registrations: 0,
    total_favorites: 0,
    active_visitors: 0,
  }
}

/**
 * 获取互动统计
 */
export async function getEngagementStats(db: D1Database) {
  const result = await db
    .prepare(
      `
      SELECT
        (SELECT COUNT(*) FROM browsing_history) as total_views,
        (SELECT COUNT(*) FROM favorites) as total_favorites,
        (SELECT COUNT(*) FROM tickets) as total_tickets,
        (SELECT COUNT(*) FROM customer_messages) as total_messages,
        (SELECT COALESCE(AVG(score), 0) FROM agent_ratings) as avg_rating
      `
    )
    .all()

  return result.results?.[0] || {
    total_views: 0,
    total_favorites: 0,
    total_tickets: 0,
    total_messages: 0,
    avg_rating: 0,
  }
}

/**
 * 获取热门景点
 */
export async function getPopularDestinations(db: D1Database, limit: number = 10) {
  const result = await db
    .prepare(
      `
      SELECT id, name, slug, cover_image, view_count, rating
      FROM destinations
      ORDER BY view_count DESC
      LIMIT ?
    `
    )
    .bind(limit)
    .all()

  return result.results || []
}

/**
 * 获取热门民宿
 */
export async function getPopularProperties(db: D1Database, limit: number = 10) {
  const result = await db
    .prepare(
      `
      SELECT id, name, slug, cover_image, price, rating, review_count
      FROM properties
      WHERE status = 'active'
      ORDER BY rating DESC, review_count DESC
      LIMIT ?
    `
    )
    .bind(limit)
    .all()

  return result.results || []
}

/**
 * 获取用户行为分析
 */
export async function getUserBehaviorStats(db: D1Database) {
  const result = await db
    .prepare(
      `
      SELECT
        (SELECT COUNT(*) FROM browsing_history WHERE viewed_at >= datetime('now', '-7 days')) as weekly_views,
        (SELECT COUNT(*) FROM favorites WHERE created_at >= datetime('now', '-7 days')) as weekly_favorites,
        (SELECT COUNT(*) FROM tickets WHERE created_at >= datetime('now', '-7 days')) as weekly_tickets,
        (SELECT COUNT(*) FROM orders WHERE created_at >= datetime('now', '-30 days')) as monthly_orders,
        (SELECT COUNT(*) FROM users WHERE created_at >= datetime('now', '-30 days')) as monthly_users
      `
    )
    .all()

  return result.results?.[0] || {
    weekly_views: 0,
    weekly_favorites: 0,
    weekly_tickets: 0,
    monthly_orders: 0,
    monthly_users: 0,
  }
}
