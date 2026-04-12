/**
 * CMS 后台 API - 订单管理
 */

export interface Order {
  id: number
  user_id: number
  property_id: number | null
  order_type: 'rental' | 'booking' | 'consultation'
  total_amount: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'refunded'
  created_at: string
  updated_at: string
}

/**
 * 获取订单列表
 */
export async function getOrders(
  db: D1Database,
  params: {
    page?: number
    limit?: number
    status?: string
    order_type?: string
    keyword?: string
  }
): Promise<{ orders: Order[]; total: number }> {
  const page = params.page || 1
  const limit = params.limit || 20
  const offset = (page - 1) * limit

  let query = `
    SELECT id, user_id, property_id, order_type, total_amount, status, created_at, updated_at
    FROM orders
  `
  let countQuery = 'SELECT COUNT(*) as total FROM orders'

  const conditions: string[] = []
  const paramsList: any[] = []

  if (params.status) {
    conditions.push('status = ?')
    paramsList.push(params.status)
  }

  if (params.order_type) {
    conditions.push('order_type = ?')
    paramsList.push(params.order_type)
  }

  if (params.keyword) {
    conditions.push('id = ? OR user_id = ?')
    paramsList.push(params.keyword, params.keyword)
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
    orders: result.results || [],
    total,
  }
}

/**
 * 获取订单详情
 */
export async function getOrder(db: D1Database, id: number): Promise<Order | null> {
  const result = await db
    .prepare(
      `
      SELECT id, user_id, property_id, order_type, total_amount, status, created_at, updated_at
      FROM orders WHERE id = ?
    `
    )
    .bind(id)
    .first()

  return result || null
}

/**
 * 创建订单
 */
export async function createOrder(
  db: D1Database,
  data: {
    user_id: number
    property_id?: number
    order_type: 'rental' | 'booking' | 'consultation'
    total_amount: number
  }
): Promise<number | null> {
  const result = await db
    .prepare(
      `
      INSERT INTO orders (user_id, property_id, order_type, total_amount, status)
      VALUES (?, ?, ?, ?, ?)
      RETURNING id
    `
    )
    .bind(
      data.user_id,
      data.property_id || null,
      data.order_type,
      data.total_amount,
      'pending'
    )
    .run()

  return result.success ? result.results[0]?.id : null
}

/**
 * 更新订单状态
 */
export async function updateOrderStatus(
  db: D1Database,
  id: number,
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'refunded'
): Promise<boolean> {
  const result = await db
    .prepare(
      'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    )
    .bind(status, id)
    .run()

  return result.success
}

/**
 * 删除订单
 */
export async function deleteOrder(db: D1Database, id: number): Promise<boolean> {
  const result = await db
    .prepare('DELETE FROM orders WHERE id = ?')
    .bind(id)
    .run()

  return result.success
}

/**
 * 获取订单统计
 */
export async function getOrderStats(db: D1Database) {
  const stats = await db
    .prepare(
      `
      SELECT
        (SELECT COUNT(*) FROM orders) as total_orders,
        (SELECT COUNT(*) FROM orders WHERE status = 'pending') as pending_orders,
        (SELECT COUNT(*) FROM orders WHERE status = 'confirmed') as confirmed_orders,
        (SELECT COUNT(*) FROM orders WHERE status = 'completed') as completed_orders,
        (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status = 'completed') as total_revenue,
        (SELECT COUNT(*) FROM orders WHERE order_type = 'rental') as rental_orders,
        (SELECT COUNT(*) FROM orders WHERE order_type = 'booking') as booking_orders,
        (SELECT COUNT(*) FROM orders WHERE order_type = 'consultation') as consultation_orders
      `
    )
    .all()

  return stats.results?.[0] || {
    total_orders: 0,
    pending_orders: 0,
    confirmed_orders: 0,
    completed_orders: 0,
    total_revenue: 0,
    rental_orders: 0,
    booking_orders: 0,
    consultation_orders: 0,
  }
}

/**
 * 获取每日订单统计
 */
export async function getDailyOrderStats(
  db: D1Database,
  startDate: string,
  endDate: string
) {
  const result = await db
    .prepare(
      `
      SELECT DATE(created_at) as date,
             COUNT(*) as orders,
             SUM(CASE WHEN status = 'confirmed' THEN total_amount ELSE 0 END) as confirmed_amount,
             SUM(CASE WHEN status = 'completed' THEN total_amount ELSE 0 END) as completed_amount
      FROM orders
      WHERE DATE(created_at) >= ? AND DATE(created_at) <= ?
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `
    )
    .bind(startDate, endDate)
    .all()

  return result.results || []
}
