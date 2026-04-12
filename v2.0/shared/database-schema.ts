/**
 * 数据库模型 - D1 Schema
 * 适配 Cloudflare D1 (免费)
 */

export const schema = `
-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phone VARCHAR(11) UNIQUE,
  email VARCHAR(100) UNIQUE,
  openid VARCHAR(64) UNIQUE,
  unionid VARCHAR(64),
  nickname VARCHAR(50),
  avatar_url TEXT,
  gender SMALLINT,
  real_name VARCHAR(50),
  id_card VARCHAR(18),
  address TEXT,
  city VARCHAR(50),
  preferences JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 用户资料表
CREATE TABLE IF NOT EXISTS user_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  real_name VARCHAR(50),
  id_card VARCHAR(18),
  address TEXT,
  city VARCHAR(50),
  preferences JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 收藏表
CREATE TABLE IF NOT EXISTS favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  property_id INTEGER,
  destination_id INTEGER,
  type TEXT CHECK(type IN ('property', 'destination')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, property_id, destination_id, type)
);

-- 浏览记录表
CREATE TABLE IF NOT EXISTS browsing_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  property_id INTEGER,
  destination_id INTEGER,
  viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 邀请码表
CREATE TABLE IF NOT EXISTS referral_codes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  code VARCHAR(10) UNIQUE NOT NULL,
  used_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 邀请记录表
CREATE TABLE IF NOT EXISTS referrals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  referrer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  referred_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  reward_status TEXT DEFAULT 'pending' CHECK(reward_status IN ('pending', 'completed')),
  reward_amount DECIMAL(10,2),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 奖励记录表
CREATE TABLE IF NOT EXISTS rewards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type TEXT CHECK(type IN ('referrer_reward', 'referred_reward', 'commission')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'paid', 'cancelled')),
  related_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 景点表
CREATE TABLE IF NOT EXISTS destinations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  cover_image TEXT,
  images JSON,
  location POINT,
  address TEXT,
  phone VARCHAR(20),
  opening_hours VARCHAR(200),
  price_range VARCHAR(50),
  best_season VARCHAR(100),
  rating DECIMAL(3,2) DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 民宿表
CREATE TABLE IF NOT EXISTS properties (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  destination_id INTEGER REFERENCES destinations(id) ON DELETE SET NULL,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  cover_image TEXT,
  images JSON,
  price DECIMAL(10,2) NOT NULL,
  room_type VARCHAR(50),
  facilities JSON,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'pending')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 订单表
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  property_id INTEGER REFERENCES properties(id) ON DELETE SET NULL,
  order_type TEXT CHECK(order_type IN ('rental', 'booking', 'consultation')),
  total_amount DECIMAL(10,2),
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'completed', 'cancelled', 'refunded')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 客服消息表
CREATE TABLE IF NOT EXISTS customer_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  agent_id INTEGER,
  content TEXT NOT NULL,
  msg_type TEXT DEFAULT 'text' CHECK(msg_type IN ('text', 'image', 'file')),
  is_from_agent BOOLEAN DEFAULT 0,
  read_status BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 工单表
CREATE TABLE IF NOT EXISTS tickets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  type TEXT CHECK(type IN ('咨询', '投诉', '建议', '其他')),
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'processing', 'resolved', 'closed')),
  priority TEXT DEFAULT 'normal' CHECK(priority IN ('low', 'normal', 'high')),
  response_count INTEGER DEFAULT 0,
  resolved_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 客服评价表
CREATE TABLE IF NOT EXISTS agent_ratings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticket_id INTEGER REFERENCES tickets(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  agent_id INTEGER,
  score INTEGER CHECK(score BETWEEN 1 AND 5),
  comment TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 短信验证码表
CREATE TABLE IF NOT EXISTS sms_codes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phone VARCHAR(11) NOT NULL,
  code VARCHAR(6) NOT NULL,
  used BOOLEAN DEFAULT 0,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 消息通知表
CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  type TEXT CHECK(type IN ('system', 'order', 'promotion', 'ticket')),
  is_read BOOLEAN DEFAULT 0,
  link_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`

// 索引优化
export const indexes = `
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_openid ON users(openid);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_browsing_user ON browsing_history(user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred ON referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_user ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
`

// 视图
export const views = `
-- 用户统计视图
CREATE VIEW IF NOT EXISTS user_stats AS
SELECT
  u.id,
  u.phone,
  u.created_at,
  COUNT(DISTINCT f.id) as favorite_count,
  COUNT(DISTINCT b.id) as view_count,
  COUNT(DISTINCT o.id) as order_count
FROM users u
LEFT JOIN favorites f ON u.id = f.user_id
LEFT JOIN browsing_history b ON u.id = b.user_id
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id;

-- 景点统计视图
CREATE VIEW IF NOT EXISTS destination_stats AS
SELECT
  d.id,
  d.name,
  d.slug,
  d.view_count,
  COUNT(DISTINCT p.id) as property_count,
  AVG(p.rating) as avg_rating
FROM destinations d
LEFT JOIN properties p ON d.id = p.destination_id
GROUP BY d.id;

-- 订单统计视图
CREATE VIEW IF NOT EXISTS order_stats AS
SELECT
  DATE(o.created_at) as date,
  COUNT(o.id) as total_orders,
  SUM(CASE WHEN o.status = 'confirmed' THEN o.total_amount ELSE 0 END) as confirmed_amount,
  SUM(CASE WHEN o.status = 'completed' THEN o.total_amount ELSE 0 END) as completed_amount
FROM orders o
GROUP BY DATE(o.created_at);
`