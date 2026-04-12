/**
 * v2.0 路由注册
 * 统一管理所有 API 路由
 */

import { errorHandler, success, error, unauthorized, notFound } from '../middleware';

// 路由类型定义
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
type RouteHandler = (request: Request, env: any, ctx: any) => Promise<Response>;

interface Route {
    path: string;
    method: HttpMethod;
    handler: RouteHandler;
    auth?: boolean; // 是否需要认证
}

// 路由注册表
export const routes: Route[] = [];

// 注册路由辅助函数
export function get(path: string, handler: RouteHandler, auth = false) {
    routes.push({ path, method: 'GET', handler, auth });
}

export function post(path: string, handler: RouteHandler, auth = false) {
    routes.push({ path, method: 'POST', handler, auth });
}

export function put(path: string, handler: RouteHandler, auth = false) {
    routes.push({ path, method: 'PUT', handler, auth });
}

export function del(path: string, handler: RouteHandler, auth = false) {
    routes.push({ path, method: 'DELETE', handler, auth });
}

// 路由匹配函数
export function findRoute(request: Request): { route: Route | null; params: Record<string, string> } {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const method = request.method;

    for (const route of routes) {
        // 简单路径匹配
        if (route.method !== method) continue;

        // 检查路径匹配
        if (pathname === route.path) {
            return { route, params: {} };
        }

        // 支持参数化路径 (如 /api/users/:id)
        const routeParts = route.path.split('/');
        const pathParts = pathname.split('/');
        const params: Record<string, string> = {};

        if (routeParts.length === pathParts.length) {
            let match = true;
            for (let i = 0; i < routeParts.length; i++) {
                if (routeParts[i].startsWith(':')) {
                    params[routeParts[i].substring(1)] = pathParts[i];
                } else if (routeParts[i] !== pathParts[i]) {
                    match = false;
                    break;
                }
            }
            if (match) {
                return { route, params };
            }
        }
    }

    return { route: null, params: {} };
}

// 认证检查中间件
export async function checkAuth(request: Request): Promise<{ valid: boolean; userId?: number }> {
    // 从 Cookie 或 Header 获取 token
    const authHeader = request.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        // TODO: 验证 token
        return { valid: true, userId: 1 }; // 示例
    }

    // 从 Cookie 获取 session
    const cookie = request.headers.get('Cookie');
    if (cookie?.includes('session=')) {
        // TODO: 验证 session
        return { valid: true, userId: 1 }; // 示例
    }

    return { valid: false };
}
