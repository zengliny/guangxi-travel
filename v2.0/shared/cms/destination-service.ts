/**
 * CMS 后台 API - 景点管理
 */

export interface Destination {
  id: number
  name: string
  slug: string
  description: string
  cover_image: string
  images: string[]
  location: {
    lat: number
    lng: number
  }
  address: string
  phone: string
  opening_hours: string
  price_range: string
  best_season: string
  rating: number
  view_count: number
  created_at: string
  updated_at: string
}

/**
 * 获取景点列表
 */
export async function getDestinations(
  db: D1Database,
  params: {
    page?: number
    limit?: number
    status?: string
    keyword?: string
  }
): Promise<{ destinations: Destination[]; total: number }> {
  const page = params.page || 1
  const limit = params.limit || 20
  const offset = (page - 1) * limit

  let query = `
    SELECT id, name, slug, description, cover_image, images, location, address, phone,
           opening_hours, price_range, best_season, rating, view_count, created_at, updated_at
    FROM destinations
  `
  let countQuery = 'SELECT COUNT(*) as total FROM destinations'

  const conditions: string[] = []
  const paramsList: any[] = []

  if (params.status) {
    conditions.push('status = ?')
    paramsList.push(params.status)
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

  // 获取总数
  const countResult = await db.prepare(countQuery).bind(...paramsList).first()
  const total = countResult?.total || 0

  // 获取数据
  const result = await db.prepare(query).bind(...paramsList, limit, offset).all()

  return {
    destinations: result.results || [],
    total,
  }
}

/**
 * 获取景点详情
 */
export async function getDestination(db: D1Database, id: number): Promise<Destination | null> {
  const result = await db
    .prepare(
      `
      SELECT id, name, slug, description, cover_image, images, location, address, phone,
             opening_hours, price_range, best_season, rating, view_count, created_at, updated_at
      FROM destinations WHERE id = ?
    `
    )
    .bind(id)
    .first()

  return result || null
}

/**
 * 创建景点
 */
export async function createDestination(
  db: D1Database,
  data: Partial<Destination>
): Promise<number | null> {
  const result = await db
    .prepare(
      `
      INSERT INTO destinations (name, slug, description, cover_image, images, location,
                                address, phone, opening_hours, price_range, best_season)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING id
    `
    )
    .bind(
      data.name,
      data.slug,
      data.description || '',
      data.cover_image || '',
      JSON.stringify(data.images || []),
      JSON.stringify(data.location || { lat: 0, lng: 0 }),
      data.address || '',
      data.phone || '',
      data.opening_hours || '',
      data.price_range || '',
      data.best_season || ''
    )
    .run()

  return result.success ? result.results[0]?.id : null
}

/**
 * 更新景点
 */
export async function updateDestination(
  db: D1Database,
  id: number,
  data: Partial<Destination>
): Promise<boolean> {
  const fields = Object.keys(data).filter((k) => k !== 'id' && k !== 'created_at')
  if (fields.length === 0) return false

  const setClause = fields.map((f) => `${f} = ?`).join(', ')
  const values = fields.map((f) => {
    const v = data[f as keyof Destination]
    return f === 'images' || f === 'location' ? JSON.stringify(v) : v
  })

  const result = await db
    .prepare(`UPDATE destinations SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
    .bind(...values, id)
    .run()

  return result.success
}

/**
 * 删除景点
 */
export async function deleteDestination(db: D1Database, id: number): Promise<boolean> {
  const result = await db
    .prepare('DELETE FROM destinations WHERE id = ?')
    .bind(id)
    .run()

  return result.success
}

/**
 * 增加浏览量
 */
export async function incrementViewCount(db: D1Database, id: number): Promise<void> {
  await db
    .prepare('UPDATE destinations SET view_count = view_count + 1 WHERE id = ?')
    .bind(id)
    .run()
}
