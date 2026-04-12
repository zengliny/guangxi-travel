/**
 * Worker API 路由
 * 处理所有后端 API 请求
 */

import { createAuth, getUser } from '../shared/user-service'
import { createReferralCode, getReferralStats } from '../shared/referral-service'
import { createTicket, addCustomerMessage, getCustomerServiceStats } from '../shared/customer-service'
import { getDestinations, createDestination, updateDestination, deleteDestination } from './cms/destination-service'
import { getProperties, createProperty, updateProperty, deleteProperty } from './cms/property-service'
import { getOrders, createOrder, updateOrderStatus, getOrderStats } from './cms/order-service'
import { getDashboardStats } from './cms/dashboard-service'

// API 路由处理器
interface RouteHandler {
  (request: Request, env: any, ctx: any): Promise<Response>
}

// 路由表
const routes: Record<string, Record<string, RouteHandler>> = {
  '/api/auth': {
    GET: async (request, env) => {
      // 获取当前用户
      const sessionId = request.headers.get('Cookie')?.split('session=')[1]?.split(';')[0]
      if (!sessionId) {
        return Response.json({ error: '未登录' }, { status: 401 })
      }
      // TODO: 验证 session
      return Response.json({ message: 'auth endpoint' })
    },
  },

  '/api/user': {
    GET: async (request, env) => {
      // 获取用户信息
      return Response.json({ message: 'user endpoint' })
    },
    POST: async (request, env) => {
      // 更新用户信息
      return Response.json({ message: 'user updated' })
    },
  },

  '/api/favorites': {
    GET: async (request, env) => {
      // 获取收藏列表
      return Response.json({ message: 'favorites endpoint' })
    },
    POST: async (request, env) => {
      // 添加收藏
      return Response.json({ message: 'favorite added' })
    },
    DELETE: async (request, env) => {
      // 删除收藏
      return Response.json({ message: 'favorite deleted' })
    },
  },

  '/api/referral': {
    GET: async (request, env) => {
      // 获取邀请码和统计
      const code = await createReferralCode(env.DB, 1)
      const stats = await getReferralStats(env.DB, 1)
      return Response.json({ code, stats })
    },
  },

  '/api/customer-service': {
    GET: async (request, env) => {
      // 获取客服统计
      const stats = await getCustomerServiceStats(env.DB)
      return Response.json(stats)
    },
  },

  '/api/tickets': {
    GET: async (request, env) => {
      // 获取工单列表
      return Response.json({ message: 'tickets endpoint' })
    },
    POST: async (request, env) => {
      // 创建工单
      const data = await request.json()
      const ticketId = await createTicket(env.DB, 1, data)
      return Response.json({ id: ticketId })
    },
  },

  '/api/messages': {
    POST: async (request, env) => {
      // 发送消息
      const data = await request.json()
      const messageId = await addCustomerMessage(env.DB, data.ticketId, 1, data.content)
      return Response.json({ id: messageId })
    },
  },

  '/api/destinations': {
    GET: async (request, env) => {
      // 获取景点列表
      const url = new URL(request.url)
      const page = parseInt(url.searchParams.get('page') || '1')
      const limit = parseInt(url.searchParams.get('limit') || '20')
      const result = await getDestinations(env.DB, { page, limit })
      return Response.json(result)
    },
    POST: async (request, env) => {
      // 创建景点
      const data = await request.json()
      const id = await createDestination(env.DB, data)
      return Response.json({ id })
    },
    PUT: async (request, env) => {
      // 更新景点
      const data = await request.json()
      const updated = await updateDestination(env.DB, data.id, data)
      return Response.json({ updated })
    },
    DELETE: async (request, env) => {
      // 删除景点
      const url = new URL(request.url)
      const id = parseInt(url.searchParams.get('id') || '0')
      const deleted = await deleteDestination(env.DB, id)
      return Response.json({ deleted })
    },
  },

  '/api/properties': {
    GET: async (request, env) => {
      // 获取民宿列表
      const url = new URL(request.url)
      const page = parseInt(url.searchParams.get('page') || '1')
      const result = await getProperties(env.DB, { page })
      return Response.json(result)
    },
    POST: async (request, env) => {
      // 创建民宿
      const data = await request.json()
      const id = await createProperty(env.DB, data)
      return Response.json({ id })
    },
  },

  '/api/orders': {
    GET: async (request, env) => {
      // 获取订单列表
      const url = new URL(request.url)
      const page = parseInt(url.searchParams.get('page') || '1')
      const result = await getOrders(env.DB, { page })
      return Response.json(result)
    },
    POST: async (request, env) => {
      // 创建订单
      const data = await request.json()
      const id = await createOrder(env.DB, data)
      return Response.json({ id })
    },
    PUT: async (request, env) => {
      // 更新订单状态
      const data = await request.json()
      const updated = await updateOrderStatus(env.DB, data.id, data.status)
      return Response.json({ updated })
    },
  },

  '/api/dashboard': {
    GET: async (request, env) => {
      // 获取仪表盘数据
      const stats = await getDashboardStats(env.DB)
      return Response.json(stats)
    },
  },
}

// 主处理函数
export async function handleApiRequest(request: Request, env: any, ctx: any): Promise<Response> {
  const url = new URL(request.url)
  const pathname = url.pathname
  const method = request.method

  // 查找匹配的路由
  for (const [routePath, methods] of Object.entries(routes)) {
    if (pathname.startsWith(routePath)) {
      if (methods[method]) {
        try {
          return await methods[method](request, env, ctx)
        } catch (error) {
          console.error('API Error:', error)
          return Response.json({ error: 'Internal Server Error' }, { status: 500 })
        }
      }
      break
    }
  }

  return Response.json({ error: 'Not Found' }, { status: 404 })
}
