#!/bin/bash

# v2.0 快速部署脚本
# 使用前请先配置好环境变量

set -e

echo "=================================="
echo "广西旅游 v2.0 部署脚本"
echo "=================================="

# 检查依赖
if ! command -v wrangler &> /dev/null; then
    echo "❌ 请先安装 wrangler: npm install -g wrangler"
    exit 1
fi

# 检查环境变量
if [ ! -f ".env" ]; then
    echo "⚠️  未找到 .env 文件"
    read -p "是否创建 .env 文件? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cp .env.example .env
        echo "✅ 已创建 .env 文件，请编辑填入必要配置"
        exit 0
    fi
fi

# 读取环境变量
if [ -f ".env" ]; then
    export $(grep -v '^#' .env | xargs)
fi

# 选择操作
echo ""
echo "请选择操作:"
echo "1. 部署到 Cloudflare Workers"
echo "2. 部署到 Cloudflare Pages"
echo "3. 本地开发测试"
echo "4. 退出"
echo ""

read -p "请输入选项 (1-4): " option

case $option in
    1)
        echo "🚀 正在部署到 Cloudflare Workers..."
        npm run build:worker
        wrangler deploy
        echo "✅ 部署完成！"
        ;;
    2)
        echo "🚀 正在部署到 Cloudflare Pages..."
        npm run build:pages
        npx wrangler pages deploy pages --project-name=guangxi-travel-v2
        echo "✅ 部署完成！"
        ;;
    3)
        echo "🚀 正在启动本地开发服务器..."
        npx wrangler pages dev pages --kv=GUANGXI_KV --durable=GUANGXI_DURABLE
        ;;
    4)
        echo "👋 退出"
        ;;
    *)
        echo "❌ 无效选项"
        ;;
esac
