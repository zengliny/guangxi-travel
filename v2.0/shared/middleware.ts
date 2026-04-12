/**
 * v2.0 API 中间件
 * 处理请求验证、错误处理等
 */

import { ApiResponse } from '../global';

// 错误处理中间件
export function errorHandler(
    fn: (request: Request, env: any, ctx: any) => Promise<Response>
) {
    return async (request: Request, env: any, ctx: any) => {
        try {
            return await fn(request, env, ctx);
        } catch (error) {
            console.error('API Error:', error);
            return Response.json(
                { success: false, error: 'Internal Server Error' },
                { status: 500 }
            );
        }
    };
}

// JSON 响应辅助函数
export function json<T>(data: T, init?: ResponseInit): Response {
    return Response.json(data, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        ...init,
    });
}

// 成功响应
export function success<T>(data: T, message = 'Success'): Response {
    return json<ApiResponse<T>>({ success: true, data, message });
}

// 错误响应
export function error(message: string, status = 400, code = 'ERROR'): Response {
    return json<ApiResponse<null>>({ success: false, error: code, message }, { status });
}

// 未授权响应
export function unauthorized(message = 'Unauthorized'): Response {
    return error(message, 401, 'UNAUTHORIZED');
}

// 未找到响应
export function notFound(message = 'Not Found'): Response {
    return error(message, 404, 'NOT_FOUND');
}

// 验证请求体
export async function validateBody<T>(request: Request): Promise<T> {
    const contentType = request.headers.get('Content-Type');
    if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Content-Type must be application/json');
    }
    return await request.json();
}
