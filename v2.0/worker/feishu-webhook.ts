/**
 * v2.0 飞书机器人 Webhook 处理
 * 接收飞书消息并回复
 */

import { ChatBot } from '../shared/chatbot';

interface FeishuEvent {
    code: string;
    event: {
        type: string;
        sub_type: string;
        event_time: string;
        challenge?: string;
        verify_token?: string;
        body?: {
            message?: {
                message_id: string;
                create_time: string;
                chat_id: string;
                msg_type: string;
                content: string;
            };
        };
    };
}

export async function handleFeishuWebhook(
    request: Request,
    env: any
): Promise<Response> {
    const event: FeishuEvent = await request.json();

    // 频道验证
    if (event.event.type === 'url_verification') {
        return new Response(
            JSON.stringify({ challenge: event.event.challenge }),
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }

    // 消息处理
    if (event.event.type === 'im.message.v1') {
        const message = event.event.body?.message;
        if (message?.msg_type === 'text') {
            const content = JSON.parse(message.content);
            const text = content.text || '';

            // 获取聊天机器人
            const bot = new ChatBot();

            // 回复消息
            const reply = await bot.reply(text);

            return new Response(
                JSON.stringify({
                    code: 0,
                    msg: 'success',
                }),
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }
    }

    return new Response('OK', { status: 200 });
}
