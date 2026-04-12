/**
 * 飞书机器人 Webhook 处理
 * 接收飞书消息并回复
 */

import { ChatBot, getChatBot } from '../shared/chatbot'
import { addCustomerMessage, createTicket } from '../shared/customer-service'

interface FeishuEvent {
  code: string
  config: {
    events: string[]
  }
  event: {
    code: string
    event_id: string
    event_time: string
    tenant_key: string
    challenge: string
    verify_token: string
    type: string
    sub_type: string
    app_id: string
    operator: {
      operator_id: string
      operator_type: string
    }
    body?: {
      message?: {
        message_id: string
        create_time: string
        chat_id: string
        msg_type: string
        content: string
      }
    }
  }
}

export async function handleFeishuWebhook(request: Request): Promise<Response> {
  const event: FeishuEvent = await request.json()

  // 验证 token
  if (event.event.verify_token !== import.meta.env.FEISHU_BOT_SECRET) {
    return new Response('Invalid token', { status: 403 })
  }

  // 频道验证
  if (event.event.type === 'url_verification') {
    return new Response(
      JSON.stringify({ challenge: event.event.challenge }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }

  // 消息处理
  if (event.event.type === 'im.message.v1') {
    const message = event.event.body?.message
    if (message?.msg_type === 'text') {
      const content = JSON.parse(message.content)
      const text = content.text || ''

      // 获取聊天机器人
      const bot = getChatBot()

      // 回复消息
      const reply = await bot.reply(text)

      // 如果是工单相关消息，创建工单
      if (text.includes('工单') || text.includes('投诉') || text.includes('建议')) {
        await createTicket(
          (global as any).DB, // 从环境获取数据库连接
          0, // 临时用户 ID
          {
            title: `飞书消息: ${text.substring(0, 50)}`,
            content: text,
            type: text.includes('投诉') ? '投诉' : text.includes('建议') ? '建议' : '咨询',
            priority: 'normal',
          }
        )
      }

      return new Response(
        JSON.stringify({
          code: 0,
          msg: 'success',
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }
  }

  return new Response('OK', { status: 200 })
}
