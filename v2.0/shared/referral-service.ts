/**
 * 邀请返利系统
 * 奖励规则：
 * - 邀请人：好友首次咨询 ¥50，成交订单 5%
 * - 被邀请人：首次咨询 ¥100 优惠券，首单 ¥200
 */

export const REWARD_RULES = {
  // 邀请人奖励
  referrer: {
    firstConsult: 50, // 首次咨询奖励
    commissionRate: 0.05, // 成交订单提成比例
  },
  // 被邀请人奖励
  referred: {
    firstConsultCoupon: 100, // 首次咨询优惠券
    firstOrderDiscount: 200, // 首单优惠
  },
}

/**
 * 生成邀请码
 */
export function generateReferralCode(userId: number): string {
  const timestamp = Date.now().toString(36).toUpperCase().slice(-6)
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `GXTL${userId.toString().padStart(4, '0')}${timestamp}${random}`
}

/**
 * 创建邀请码
 */
export async function createReferralCode(db: D1Database, userId: number): Promise<string | null> {
  // 检查是否已有邀请码
  const existing = await db
    .prepare('SELECT code FROM referral_codes WHERE user_id = ?')
    .bind(userId)
    .first()

  if (existing) return existing.code

  const code = generateReferralCode(userId)
  await db
    .prepare('INSERT INTO referral_codes (user_id, code) VALUES (?, ?)')
    .bind(userId, code)
    .run()

  return code
}

/**
 * 获取邀请码
 */
export async function getReferralCode(db: D1Database, userId: number): Promise<string | null> {
  const result = await db
    .prepare('SELECT code FROM referral_codes WHERE user_id = ?')
    .bind(userId)
    .first()

  return result?.code || null
}

/**
 * 记录邀请关系
 */
export async function recordReferral(
  db: D1Database,
  referrerId: number,
  referredId: number
): Promise<boolean> {
  // 检查是否已邀请
  const existing = await db
    .prepare('SELECT id FROM referrals WHERE referrer_id = ? AND referred_id = ?')
    .bind(referrerId, referredId)
    .first()

  if (existing) return false

  // 记录邀请
  await db
    .prepare(
      'INSERT INTO referrals (referrer_id, referred_id, reward_status) VALUES (?, ?, ?)'
    )
    .bind(referrerId, referredId, 'pending')
    .run()

  // 更新邀请码使用次数
  await db
    .prepare(
      `UPDATE referral_codes SET used_count = used_count + 1 WHERE user_id = ?`
    )
    .bind(referrerId)
    .run()

  return true
}

/**
 * 添加奖励记录
 */
export async function addReward(
  db: D1Database,
  userId: number,
  type: 'referrer_reward' | 'referred_reward' | 'commission',
  amount: number,
  description: string,
  relatedId?: number
): Promise<number | null> {
  const result = await db
    .prepare(
      `
      INSERT INTO rewards (user_id, type, amount, description, related_id, status)
      VALUES (?, ?, ?, ?, ?, ?)
      RETURNING id
    `
    )
    .bind(userId, type, amount, description, relatedId || null, 'pending')
    .run()

  return result.success ? result.results[0]?.id : null
}

/**
 * 完成邀请奖励
 */
export async function completeReferralReward(
  db: D1Database,
  referralId: number
): Promise<boolean> {
  const result = await db
    .prepare('SELECT * FROM referrals WHERE id = ?')
    .bind(referralId)
    .first()

  if (!result || result.reward_status === 'completed') return false

  // 更新邀请记录
  await db
    .prepare('UPDATE referrals SET reward_status = ? WHERE id = ?')
    .bind('completed', referralId)
    .run()

  // 添加邀请人奖励
  await addReward(
    db,
    result.referrer_id,
    'referrer_reward',
    REWARD_RULES.referrer.firstConsult,
    '好友首次咨询奖励',
    referralId
  )

  // 添加被邀请人奖励记录
  await addReward(
    db,
    result.referred_id,
    'referred_reward',
    0,
    '新用户注册奖励',
    referralId
  )

  return true
}

/**
 * 计算订单佣金
 */
export function calculateCommission(orderAmount: number): number {
  return Math.round(orderAmount * REWARD_RULES.referrer.commissionRate * 100) / 100
}

/**
 * 分配订单佣金
 */
export async function distributeCommission(
  db: D1Database,
  orderId: number,
  orderAmount: number
): Promise<void> {
  // 查找订单用户的邀请人
  const referral = await db
    .prepare(
      `
      SELECT r.referrer_id FROM referrals r
      JOIN orders o ON r.referred_id = o.user_id
      WHERE o.id = ?
    `
    )
    .bind(orderId)
    .first()

  if (referral) {
    const commission = calculateCommission(orderAmount)
    await addReward(
      db,
      referral.referrer_id,
      'commission',
      commission,
      `订单 #${orderId} 佣金`,
      orderId
    )
  }
}

/**
 * 获取用户奖励记录
 */
export async function getRewardRecords(
  db: D1Database,
  userId: number,
  status?: 'pending' | 'paid' | 'cancelled'
) {
  let query = 'SELECT * FROM rewards WHERE user_id = ?'
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
 * 获取邀请统计
 */
export async function getReferralStats(db: D1Database, userId: number) {
  const stats = await db
    .prepare(
      `
      SELECT
        (SELECT COUNT(*) FROM referrals WHERE referrer_id = ?) as total_referrals,
        (SELECT COUNT(*) FROM referrals WHERE referrer_id = ? AND reward_status = 'completed') as completed_referrals,
        (SELECT COALESCE(SUM(r.amount), 0) FROM rewards r WHERE r.user_id = ? AND r.type = 'referrer_reward' AND r.status = 'pending') as pending_rewards,
        (SELECT COALESCE(SUM(r.amount), 0) FROM rewards r WHERE r.user_id = ? AND r.type = 'referrer_reward' AND r.status = 'paid') as paid_rewards
      `
    )
    .bind(userId, userId, userId, userId)
    .first()

  return stats || {
    total_referrals: 0,
    completed_referrals: 0,
    pending_rewards: 0,
    paid_rewards: 0,
  }
}
