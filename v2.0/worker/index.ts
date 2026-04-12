/**
 * v2.0 Worker 入口文件
 * 处理所有 Cloudflare Worker 请求
 */

import { routes, findRoute, checkAuth } from '../shared/router';
import { handleFeishuWebhook } from './feishu-webhook';
import { success, error, unauthorized } from '../shared/middleware';

// CORS 头部
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// 预检请求处理
function handleOptions(): Response {
    return new Response(null, {
        headers: corsHeaders,
        status: 204,
    });
}

// API 路由处理器
async function handleApi(request: Request, env: any): Promise<Response> {
    const { route, params } = findRoute(request);

    if (!route) {
        return error('Not Found', 404);
    }

    // 检查认证
    if (route.auth) {
        const auth = await checkAuth(request);
        if (!auth.valid) {
            return unauthorized('请先登录');
        }
    }

    try {
        return await route.handler(request, env, { params });
    } catch (error) {
        console.error('API Error:', error);
        return error('Internal Server Error', 500);
    }
}

// 主处理函数
export default {
    async fetch(request: Request, env: any, ctx: any): Promise<Response> {
        // 处理预检请求
        if (request.method === 'OPTIONS') {
            return handleOptions();
        }

        const url = new URL(request.url);
        const pathname = url.pathname;

        // 飞书 Webhook
        if (pathname.includes('/feishu/webhook')) {
            return handleFeishuWebhook(request, env);
        }

        // API 路由
        if (pathname.startsWith('/api/')) {
            return handleApi(request, env);
        }

        // 静态文件服务 (从 Cloudflare Pages)
        if (pathname.startsWith('/v2.0/')) {
            const pagesPath = pathname.replace('/v2.0/', '/');
            try {
                return await fetch(new Request(`https://guangxi-travel.pages.dev${pagesPath}`, request));
            } catch {
                return error('Page not found', 404);
            }
        }

        // 默认返回 404
        return error('Not Found', 404);
    },
};

// 导出类型
export type Env = {
    DB: D1Database;
    KV: KVNamespace;
    AUTH_SECRET: string;
    FEISHU_WEBHOOK: string;
    FEISHU_SECRET: string;
};
