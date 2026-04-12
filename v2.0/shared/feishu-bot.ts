/**
 * 飞书机器人集成模块 - 免费客服系统
 * 使用飞书开放平台 Webhook 机器人
 */

interface FeishuMessage {
  msg_type: 'text' | 'image' | 'interactive' | 'card'
  content: string | FeishuCard
  timestamp?: number
  sign?: string
}

interface FeishuCard {
  config: {
    wide_screen_mode: boolean
    enable_forward: boolean
  }
  elements: FeishuCardElement[]
}

interface FeishuCardElement {
  tag: 'text' | 'div' | 'img' | 'button'
  text?: {
    content: string
    tag?: 'l_md' | 'l_strik' | 'l_md' | 'l_lg'
    text_list?: { content: string; tag: 'l_md' }[]
  }
  img_key?: string
  button?: {
    tag: 'primary' | 'secondary'
    text: {
      content: string
      tag: 'l_md'
    }
    url?: string
    value?: string
    type?: 'primary' | 'secondary'
  }
}

export class FeishuBot {
  private webhook: string
  private secret: string

  constructor(webhook: string, secret?: string) {
    this.webhook = webhook
    this.secret = secret
  }

  /**
   * 生成签名
   */
  private generateSignature(timestamp: number): string {
    if (!this.secret) return ''

    const stringToSign = `${timestamp}\n${this.secret}`
    const encoder = new TextEncoder()
    const data = encoder.encode(stringToSign)

    // 使用 Web Crypto API
    return crypto.subtle.digest('SHA-256', data).then((hash) => {
      const bytes = new Uint8Array(hash)
      return Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
    })
  }

  /**
   * 发送文本消息
   */
  async sendText(message: string): Promise<boolean> {
    const payload: FeishuMessage = {
      msg_type: 'text',
      content: JSON.stringify({ text: message })
    }

    return this.sendMessage(payload)
  }

  /**
   * 发送卡片消息
   */
  async sendCard(card: FeishuCard): Promise<boolean> {
    const payload: FeishuMessage = {
      msg_type: 'interactive',
      content: JSON.stringify(card)
    }

    return this.sendMessage(payload)
  }

  /**
   * 发送消息
   */
  private async sendMessage(payload: FeishuMessage): Promise<boolean> {
    try {
      const response = await fetch(this.webhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        console.error('Feishu bot send failed:', await response.text())
        return false
      }

      return true
    } catch (error) {
      console.error('Feishu bot error:', error)
      return false
    }
  }

  /**
   * 验证回调签名
   */
  verifySignature(timestamp: string, sign: string): boolean {
    if (!this.secret) return true // 无密钥时跳过验证

    const expectedSign = crypto.subtle.digest('SHA-256',
      new TextEncoder().encode(`${timestamp}\n${this.secret}`)
    ).then(hash => {
      const bytes = new Uint8Array(hash)
      return Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
    })

    return expectedSign === sign
  }

  /**
   * 发送工单通知
   */
  async sendTicketNotification(ticket: {
    id: string
    user: string
    phone: string
    type: '咨询' | '投诉' | '建议' | '其他'
    content: string
    status: '待处理' | '处理中' | '已解决'
  }): Promise<boolean> {
    const card: FeishuCard = {
      config: {
        wide_screen_mode: true,
        enable_forward: true,
      },
      elements: [
        {
          tag: 'div',
          text: {
            content: `**#${ticket.id} ${ticket.type}工单**\n${ticket.content}`,
            tag: 'l_md',
          },
        },
        {
          tag: 'div',
          text: {
            text_list: [
              { content: '用户: ', tag: 'l_md' },
              { content: ticket.user, tag: 'l_md' },
              { content: ' | 电话: ', tag: 'l_md' },
              { content: ticket.phone, tag: 'l_md' },
            ],
          },
        },
        {
          tag: 'div',
          text: {
            text_list: [
              { content: '状态: ', tag: 'l_md' },
              { content: ticket.status, tag: 'l_md' },
            ],
          },
        },
        {
          tag: 'button',
          text: {
            content: '查看详情',
            tag: 'l_md',
          },
          type: 'primary',
          value: JSON.stringify({ action: 'view_ticket', id: ticket.id }),
        },
      ],
    }

    return this.sendCard(card)
  }

  /**
   * 发送优惠券通知
   */
  async sendCouponNotification(
    userId: string,
    coupon: { code: string; amount: number; description: string }
  ): Promise<boolean> {
    const card: FeishuCard = {
      config: {
        wide_screen_mode: true,
        enable_forward: true,
      },
      elements: [
        {
          tag: 'text',
          text: {
            content: `🎉 恭喜！你获得了一张优惠券`,
            tag: 'l_md',
          },
        },
        {
          tag: 'div',
          text: {
            content: `**面额: ¥${coupon.amount}**\n${coupon.description}`,
            tag: 'l_md',
          },
        },
        {
          tag: 'div',
          text: {
            text_list: [
              { content: '优惠码: ', tag: 'l_md' },
              { content: coupon.code, tag: 'l_md' },
            ],
          },
        },
      ],
    }

    return this.sendCard(card)
  }
}

// 全局实例
let feishuBotInstance: FeishuBot | null = null

export function getFeishuBot(): FeishuBot | null {
  if (!feishuBotInstance) {
    const webhook = import.meta.env.FEISHU_BOT_WEBHOOK
    const secret = import.meta.env.FEISHU_BOT_SECRET

    if (webhook) {
      feishuBotInstance = new FeishuBot(webhook, secret)
    }
  }
  return feishuBotInstance
}
