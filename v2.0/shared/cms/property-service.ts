/**
 * CMS 后台 API - 民宿管理
 */

export interface Property {
  id: number
  owner_id: number
  destination_id: number
  name: string
  slug: string
  description: string
  cover_image: string
  images: string[]
  price: number
  room_type: string
  facilities: string[]
  rating: number
  review_count: number
  status: 'active' | 'inactive' | 'pending'
  created_at: string
  updated_at: string
}

/**
 * 获取民宿列表
 */
export async function getProperties(
  db: D1Database,
  params: {
    page?: number
    limit?: number
    status?: string
    destination_id?: number
    keyword?: string
    owner_id?: number
  }
): Promise<{ properties: Property[]; total: number }> {
  const page = params.page || 1
  const limit = params.limit || 20
  const offset = (page - 1) * limit

  let query = `
    SELECT id, owner_id, destination_id, name, slug, description, cover_image, images,
           price, room_type, facilities, rating, review_count, status, created_at, updated_at
    FROM properties
  `
  let countQuery = 'SELECT COUNT(*) as total FROM properties'

  const conditions: string[] = []
  const paramsList: any[] = []

  if (params.status) {
    conditions.push('status = ?')
    paramsList.push(params.status)
  }

  if (params.destination_id) {
    conditions.push('destination_id = ?')
    paramsList.push(params.destination_id)
  }

  if (params.owner_id) {
    conditions.push('owner_id = ?')
    paramsList.push(params.owner_id)
  }

  if (params.keyword) {
    conditions.push('(name LIKE ? OR description LIKE ?)')
    paramsList.push(`%${params.keyword}%`, `%${params.keyword}%`)
  }

  if (conditions.length > 0) {
    const whereClause = ' WHERE ' + conditions.join(' AND ')
    query += whereClause
    countQuery += whereClause
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'

  const countResult = await db.prepare(countQuery).bind(...paramsList).first()
  const total = countResult?.total || 0

  const result = await db.prepare(query).bind(...paramsList, limit, offset).all()

  return {
    properties: result.results || [],
    total,
  }
}

/**
 * 获取民宿详情
 */
export async function getProperty(db: D1Database, id: number): Promise<Property | null> {
  const result = await db
    .prepare(
      `
      SELECT id, owner_id, destination_id, name, slug, description, cover_image, images,
             price, room_type, facilities, rating, review_count, status, created_at, updated_at
      FROM properties WHERE id = ?
    `
    )
    .bind(id)
    .first()

  return result || null
}

/**
 * 创建民宿
 */
export async function createProperty(
  db: D1Database,
  data: Partial<Property>
): Promise<number | null> {
  const result = await db
    .prepare(
      `
      INSERT INTO properties (owner_id, destination_id, name, slug, description, cover_image,
                              images, price, room_type, facilities, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING id
    `
    )
    .bind(
      data.owner_id,
      data.destination_id,
      data.name,
      data.slug,
      data.description || '',
      data.cover_image || '',
      JSON.stringify(data.images || []),
      data.price || 0,
      data.room_type || '',
      JSON.stringify(data.facilities || []),
      data.status || 'active'
    )
    .run()

  return result.success ? result.results[0]?.id : null
}

/**
 * 更新民宿
 */
export async function updateProperty(
  db: D1Database,
  id: number,
  data: Partial<Property>
): Promise<boolean> {
  const fields = Object.keys(data).filter((k) => k !== 'id' && k !== 'created_at')
  if (fields.length === 0) return false

  const setClause = fields.map((f) => `${f} = ?`).join(', ')
  const values = fields.map((f) => {
    const v = data[f as keyof Property]
    return f === 'images' || f === 'facilities' ? JSON.stringify(v) : v
  })

  const result = await db
    .prepare(`UPDATE properties SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
    .bind(...values, id)
    .run()

  return result.success
}

/**
 * 删除民宿
 */
export async function deleteProperty(db: D1Database, id: number): Promise<boolean> {
  const result = await db
    .prepare('DELETE FROM properties WHERE id = ?')
    .bind(id)
    .run()

  return result.success
}

/**
 * 更新评分
 */
export async function updatePropertyRating(
  db: D1Database,
  id: number,
  newRating: number
): Promise<void> {
  await db
    .prepare('UPDATE properties SET rating = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .bind(newRating, id)
    .run()
}
