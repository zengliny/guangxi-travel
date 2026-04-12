/**
 * 飞书开放平台 API 客户端
 * 用于更高级的飞书功能（需要应用权限）
 */

interface FeishuConfig {
  appId: string
  appSecret: string
  verificationToken: string
}

interface FeishuAccessTokenResponse {
  code: number
  msg: string
  data: {
    access_token: string
    expire: number
  }
}

interface FeishuUserinfoResponse {
  code: number
  msg: string
  data: {
    open_id: string
    union_id: string
    email: string
    mobile: string
    name: string
    avatar: {
      avatar_72: string
      avatar_240: string
      avatar_640: string
      avatar_origin: string
    }
  }
}

export class FeishuOpenAPI {
  private baseUrl = 'https://open.feishu.cn'
  private appId: string
  private appSecret: string

  constructor(config: FeishuConfig) {
    this.appId = config.appId
    this.appSecret = config.appSecret
  }

  /**
   * 获取访问令牌
   * 缓存策略：令牌有效期通常为2小时，本地缓存1小时
   */
  async getAccessToken(): Promise<string> {
    const cacheKey = 'feishu_access_token'
    const cache = await caches.open('feishu-api')

    const cached = await cache.match(cacheKey)
    if (cached) {
      const data = await cached.json()
      if (data.expiresAt > Date.now()) {
        return data.accessToken
      }
    }

    const response = await fetch(
      `${this.baseUrl}/open-apis/auth/v3/app_access_token/internal`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          app_id: this.appId,
          app_secret: this.appSecret,
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.statusText}`)
    }

    const result: FeishuAccessTokenResponse = await response.json()
    if (result.code !== 0) {
      throw new Error(`Feishu API error: ${result.msg}`)
    }

    // 缓存令牌（提前1分钟过期）
    const expiresAt = Date.now() + (result.data.expire - 60) * 1000
    await cache.put(
      cacheKey,
      new Response(
        JSON.stringify({ accessToken: result.data.access_token, expiresAt }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    )

    return result.data.access_token
  }

  /**
   * 获取用户信息
   */
  async getUserInfo(accessToken: string, userId: string): Promise<FeishuUserinfoResponse['data']> {
    const response = await fetch(
      `${this.baseUrl}/open-apis/contact/v3/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to get user info: ${response.statusText}`)
    }

    const result: FeishuUserinfoResponse = await response.json()
    if (result.code !== 0) {
      throw new Error(`Feishu API error: ${result.msg}`)
    }

    return result.data
  }

  /**
   * 发送应用内消息
   */
  async sendMessage(
    accessToken: string,
    openId: string,
    msgType: 'text' | 'interactive' | 'post',
    content: string | object
  ): Promise<boolean> {
    const response = await fetch(
      `${this.baseUrl}/open-apis/message/v4/send/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          open_id: openId,
          msg_type,
          content: JSON.stringify(content),
        }),
      }
    )

    if (!response.ok) {
      console.error('Failed to send message:', await response.text())
      return false
    }

    const result = await response.json()
    return result.code === 0
  }

  /**
   * 创建群聊
   */
  async createChat(accessToken: string, userIds: string[]): Promise<string | null> {
    const response = await fetch(
      `${this.baseUrl}/open-apis/chat/v4/create`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_ids: userIds,
          name: '广西旅游咨询',
          description: '旅游服务群',
        }),
      }
    )

    if (!response.ok) {
      return null
    }

    const result = await response.json()
    return result.code === 0 ? result.data.chat_id : null
  }
}
