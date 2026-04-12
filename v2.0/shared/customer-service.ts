/**
 * 在线客服系统
 * 集成飞书机器人 + 工单系统
 */

import { FeishuBot, getFeishuBot } from '../shared/feishu-bot'

/**
 * 创建工单
 */
export async function createTicket(
  db: D1Database,
  userId: number,
  data: {
    title: string
    content: string
    type: '咨询' | '投诉' | '建议' | '其他'
    priority?: 'low' | 'normal' | 'high'
  }
): Promise<number | null> {
  const result = await db
    .prepare(
      `
      INSERT INTO tickets (user_id, title, content, type, priority)
      VALUES (?, ?, ?, ?, ?)
      RETURNING id
    `
    )
    .bind(
      userId,
      data.title,
      data.content,
      data.type,
      data.priority || 'normal'
    )
    .run()

  if (!result.success) return null

  const ticketId = result.results[0]?.id

  // 发送工单通知到飞书
  const bot = getFeishuBot()
  if (bot) {
    await bot.sendTicketNotification({
      id: ticketId.toString(),
      user: '用户',
      phone: '未知',
      type: data.type,
      content: data.content,
      status: '待处理',
    })
  }

  return ticketId
}

/**
 * 获取工单列表
 */
export async function getUserTickets(
  db: D1Database,
  userId: number,
  status?: 'pending' | 'processing' | 'resolved' | 'closed'
) {
  let query = 'SELECT * FROM tickets WHERE user_id = ?'
  const params: any[] = [userId]

  if (status) {
    query += ' AND status = ?'
    params.push(status)
  }

  query += ' ORDER BY created_at DESC'

  const result = await db.prepare(query).bind(...params).all()
  return result.results || []
}

/**
 * 获取工单详情
 */
export async function getTicketDetail(db: D1Database, ticketId: number) {
  const result = await db
    .prepare('SELECT * FROM tickets WHERE id = ?')
    .bind(ticketId)
    .first()

  if (!result) return null

  // 获取消息记录
  const messages = await db
    .prepare(
      'SELECT * FROM customer_messages WHERE ticket_id = ? ORDER BY created_at ASC'
    )
    .bind(ticketId)
    .all()

  return {
    ...result,
    messages: messages.results || [],
  }
}

/**
 * 添加客服消息
 */
export async function addCustomerMessage(
  db: D1Database,
  ticketId: number,
  userId: number,
  content: string,
  isFromAgent: boolean = false
): Promise<number | null> {
  // 更新工单状态
  if (!isFromAgent) {
    await db
      .prepare('UPDATE tickets SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .bind('processing', ticketId)
      .run()
  }

  const result = await db
    .prepare(
      `
      INSERT INTO customer_messages (ticket_id, user_id, content, is_from_agent)
      VALUES (?, ?, ?, ?)
      RETURNING id
    `
    )
    .bind(ticketId, userId, content, isFromAgent)
    .run()

  return result.success ? result.results[0]?.id : null
}

/**
 * 解决工单
 */
export async function resolveTicket(
  db: D1Database,
  ticketId: number,
  userId: number
): Promise<boolean> {
  const result = await db
    .prepare(
      `
      UPDATE tickets
      SET status = 'resolved',
          resolved_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `
    )
    .bind(ticketId, userId)
    .run()

  return result.success
}

/**
 * 关闭工单
 */
export async function closeTicket(db: D1Database, ticketId: number): Promise<boolean> {
  const result = await db
    .prepare(
      'UPDATE tickets SET status = ? WHERE id = ?'
    )
    .bind('closed', ticketId)
    .run()

  return result.success
}

/**
 * 评价客服
 */
export async function rateAgent(
  db: D1Database,
  ticketId: number,
  userId: number,
  score: number,
  comment: string
): Promise<boolean> {
  // 检查工单是否已解决
  const ticket = await db
    .prepare('SELECT id, status FROM tickets WHERE id = ? AND user_id = ?')
    .bind(ticketId, userId)
    .first()

  if (!ticket || ticket.status !== 'resolved') return false

  // 检查是否已评价
  const existing = await db
    .prepare('SELECT id FROM agent_ratings WHERE ticket_id = ? AND user_id = ?')
    .bind(ticketId, userId)
    .first()

  if (existing) return false

  const result = await db
    .prepare(
      'INSERT INTO agent_ratings (ticket_id, user_id, score, comment) VALUES (?, ?, ?, ?)'
    )
    .bind(ticketId, userId, score, comment)
    .run()

  return result.success
}

/**
 * 发送消息到飞书
 */
export async function sendToFeishu(
  content: string,
  type: 'text' | 'ticket' = 'text'
): Promise<boolean> {
  const bot = getFeishuBot()
  if (!bot) return false

  if (type === 'ticket') {
    // 解析工单信息并发送卡片
    const ticketInfo = JSON.parse(content)
    return bot.sendTicketNotification({
      id: ticketInfo.id,
      user: ticketInfo.user || '未知',
      phone: ticketInfo.phone || '未知',
      type: ticketInfo.type || '咨询',
      content: ticketInfo.content || '',
      status: '待处理',
    })
  }

  return bot.sendText(content)
}

/**
 * 获取客服统计
 */
export async function getCustomerServiceStats(db: D1Database) {
  const stats = await db
    .prepare(
      `
      SELECT
        (SELECT COUNT(*) FROM tickets WHERE status = 'pending') as pending_tickets,
        (SELECT COUNT(*) FROM tickets WHERE status = 'processing') as processing_tickets,
        (SELECT COUNT(*) FROM tickets WHERE status = 'resolved') as resolved_tickets,
        (SELECT COUNT(*) FROM tickets WHERE status = 'closed') as closed_tickets,
        (SELECT COUNT(*) FROM customer_messages WHERE is_from_agent = 0) as user_messages,
        (SELECT COUNT(*) FROM agent_ratings) as total_ratings,
        (SELECT COALESCE(AVG(score), 0) FROM agent_ratings) as avg_rating
      `
    )
    .all()

  return stats.results?.[0] || {
    pending_tickets: 0,
    processing_tickets: 0,
    resolved_tickets: 0,
    closed_tickets: 0,
    user_messages: 0,
    total_ratings: 0,
    avg_rating: 0,
  }
}
