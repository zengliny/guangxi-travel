/**
 * v2.0 全局类型声明
 */

// D1 Database 类型扩展
interface D1Database {
    prepare(query: string): D1PreparedStatement;
    batch<T>(statements: D1PreparedStatement<T>[]): D1Result<T>[];
    execute<T>(query: string): D1Result<T>;
}

interface D1PreparedStatement<T = unknown> {
    bind(...values: any[]): D1PreparedStatement<T>;
    all(): Promise<D1Result<T>>;
    first(): Promise<D1Result<T> | null>;
    run(): Promise<D1Result<T>>;
}

interface D1Result<T = unknown> {
    success: boolean;
    results?: T[];
    count?: number;
    meta?: {
        duration: number;
        size: number;
    };
}

// 环境变量类型
interface Env {
    DB: D1Database;
    KV: KVNamespace;
    AUTH_SECRET: string;
    FEISHU_WEBHOOK: string;
    FEISHU_SECRET: string;
}

// 用户类型
interface User {
    id: number;
    phone: string;
    email?: string;
    openid?: string;
    nickname: string;
    avatar_url?: string;
    gender?: number;
    created_at: string;
}

// 认证类型
interface Session {
    id: string;
    userId: number;
    expiresAt: Date;
}

// API 响应类型
interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

interface PaginatedResponse<T = any> {
    items: T[];
    total: number;
    page: number;
    limit: number;
}

// 景点类型
interface Destination {
    id: number;
    name: string;
    slug: string;
    description: string;
    cover_image: string;
    images: string[];
    location: { lat: number; lng: number };
    address: string;
    phone: string;
    opening_hours: string;
    price_range: string;
    best_season: string;
    rating: number;
    view_count: number;
    created_at: string;
}

// 民宿类型
interface Property {
    id: number;
    owner_id: number;
    destination_id: number;
    name: string;
    slug: string;
    description: string;
    cover_image: string;
    images: string[];
    price: number;
    room_type: string;
    facilities: string[];
    rating: number;
    review_count: number;
    status: 'active' | 'inactive' | 'pending';
    created_at: string;
}

// 订单类型
interface Order {
    id: number;
    user_id: number;
    property_id: number | null;
    order_type: 'rental' | 'booking' | 'consultation';
    total_amount: number;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'refunded';
    created_at: string;
}
