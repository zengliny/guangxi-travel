/**
 * Worker 入口文件
 * 处理所有 Cloudflare Worker 请求
 */

import { handleApiRequest } from './api-routes'

// CORS 头部
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// 预检请求处理
function handleOptions(request: Request): Response {
  if (
    request.headers.get('Origin') !== null &&
    request.headers.get('Access-Control-Request-Method') !== null &&
    request.headers.get('Access-Control-Request-Headers') !== null
  ) {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    })
  }
  return new Response(null, { status: 404 })
}

// 主处理函数
export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    // 处理预检请求
    if (request.method === 'OPTIONS') {
      return handleOptions(request)
    }

    // API 路由
    if (request.url.includes('/api/')) {
      return handleApiRequest(request, env, ctx)
    }

    // 静态文件服务 (从 Cloudflare Pages)
    if (request.url.includes('/pages/')) {
      const url = new URL(request.url)
      const path = url.pathname.replace('/pages/', '/')
      return fetch(new Request(`https://guangxi-travel.pages.dev${path}`, request))
    }

    // 默认返回 404
    return new Response('Not Found', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  },
}
