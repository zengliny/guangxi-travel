/**
 * 用户系统 - Lucia 身份认证集成
 * 适配 Cloudflare D1
 */

import { Lucia } from 'lucia'
import { D1Adapter } from '@lucia-auth/adapter-d1'
import { cookies } from 'next/headers'

export const authConfig = {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
  getUserAttributes: (attributes: any) => ({
    phone: attributes.phone,
    email: attributes.email,
    nickname: attributes.nickname,
    avatarUrl: attributes.avatar_url,
  }),
}

// 初始化 Lucia
export function createAuth(d1: D1Database) {
  const adapter = new D1Adapter(d1, {
    user: 'users',
    session: 'sessions',
  })

  const lucia = new Lucia(adapter, authConfig)

  return { lucia, adapter }
}

/**
 * 验证会话
 */
export async function validateSession(lucia: any, sessionId: string | null) {
  if (!sessionId) return null

  const session = await lucia.validateSession(sessionId)
  if (!session) return null

  return session
}

/**
 * 创建新用户
 */
export async function createUser(
  db: D1Database,
  data: {
    phone?: string
    email?: string
    openid?: string
    nickname?: string
    avatar_url?: string
    gender?: number
  }
) {
  const user = await db
    .prepare(
      `
      INSERT INTO users (phone, email, openid, nickname, avatar_url, gender)
      VALUES (?, ?, ?, ?, ?, ?)
      RETURNING id, phone, email, openid, nickname, avatar_url, gender, created_at
    `
    )
    .bind(
      data.phone || null,
      data.email || null,
      data.openid || null,
      data.nickname || null,
      data.avatar_url || null,
      data.gender || null
    )
    .run()

  return user.success ? user.results[0] : null
}

/**
 * 获取用户信息
 */
export async function getUser(db: D1Database, id: number) {
  const result = await db
    .prepare('SELECT * FROM users WHERE id = ?')
    .bind(id)
    .first()

  return result
}

/**
 * 获取用户资料
 */
export async function getUserProfile(db: D1Database, userId: number) {
  const result = await db
    .prepare('SELECT * FROM user_profiles WHERE user_id = ?')
    .bind(userId)
    .first()

  return result
}

/**
 * 更新用户资料
 */
export async function updateUserProfile(
  db: D1Database,
  userId: number,
  data: Partial<{
    real_name: string
    id_card: string
    address: string
    city: string
    preferences: Record<string, any>
  }>
) {
  const existing = await getUserProfile(db, userId)

  if (existing) {
    const query = `
      UPDATE user_profiles
      SET ${Object.keys(data)
        .map((key) => `${key} = ?`)
        .join(', ')}
      WHERE user_id = ?
    `
    const params = [...Object.values(data), userId]
    await db.prepare(query).bind(...params).run()
  } else {
    const query = `
      INSERT INTO user_profiles (user_id, ${Object.keys(data).join(', ')})
      VALUES (?, ${Object.keys(data).map(() => '?').join(', ')})
    `
    const params = [userId, ...Object.values(data)]
    await db.prepare(query).bind(...params).run()
  }
}

/**
 * 添加收藏
 */
export async function addFavorite(
  db: D1Database,
  userId: number,
  type: 'property' | 'destination',
  propertyId?: number,
  destinationId?: number
) {
  try {
    const result = await db
      .prepare(
        `
        INSERT INTO favorites (user_id, type, property_id, destination_id)
        VALUES (?, ?, ?, ?)
        RETURNING id
      `
      )
      .bind(userId, type, propertyId || null, destinationId || null)
      .run()

    return result.success ? result.results[0]?.id : null
  } catch (error) {
    // 已存在则忽略
    return null
  }
}

/**
 * 删除收藏
 */
export async function removeFavorite(
  db: D1Database,
  userId: number,
  type: 'property' | 'destination',
  propertyId?: number,
  destinationId?: number
) {
  const query = `
    DELETE FROM favorites
    WHERE user_id = ? AND type = ?
    AND property_id = ? AND destination_id = ?
  `
  await db.prepare(query).bind(userId, type, propertyId || null, destinationId || null).run()
}

/**
 * 获取用户收藏列表
 */
export async function getFavorites(db: D1Database, userId: number, type?: 'property' | 'destination') {
  let query = `
    SELECT f.*,
      p.name as property_name,
      p.cover_image as property_cover,
      p.price,
      d.name as destination_name,
      d.address as destination_address
    FROM favorites f
    LEFT JOIN properties p ON f.property_id = p.id
    LEFT JOIN destinations d ON f.destination_id = d.id
    WHERE f.user_id = ?
  `
  const params = [userId]

  if (type) {
    query += ' AND f.type = ?'
    params.push(type)
  }

  query += ' ORDER BY f.created_at DESC'

  const result = await db.prepare(query).bind(...params).all()
  return result.results || []
}

/**
 * 添加浏览记录
 */
export async function addBrowsingHistory(
  db: D1Database,
  userId: number,
  propertyId?: number,
  destinationId?: number
) {
  // 先删除旧记录
  await db
    .prepare(
      `DELETE FROM browsing_history WHERE user_id = ? AND property_id = ? AND destination_id = ?`
    )
    .bind(userId, propertyId || null, destinationId || null)
    .run()

  // 插入新记录
  await db
    .prepare(
      `INSERT INTO browsing_history (user_id, property_id, destination_id) VALUES (?, ?, ?)`
    )
    .bind(userId, propertyId || null, destinationId || null)
    .run()
}

/**
 * 获取浏览历史
 */
export async function getBrowsingHistory(db: D1Database, userId: number, limit: number = 20) {
  const result = await db
    .prepare(
      `
      SELECT * FROM browsing_history
      WHERE user_id = ?
      ORDER BY viewed_at DESC
      LIMIT ?
    `
    )
    .bind(userId, limit)
    .all()

  return result.results || []
}
