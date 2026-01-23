#!/bin/bash
set -e

echo "🔧 Starting Post-Attach Setup..."

# 1. 権限の修正
echo "🔑 Fixing permissions..."
sudo chown -R node:node /workspace /workspace/.pnpm-store

# 2. 依存関係のインストール
echo "📦 Installing dependencies..."
pnpm install

# 3. バックエンドのセットアップ
echo "🚀 Setting up Backend..."
cd /workspace/app/backend

# .envファイルのコピー（ファイルがない場合のみ）
if [ ! -f .env ]; then
  echo "📄 Copying .env from sample..."
  cp .env.sample .env
fi

# Prismaの生成とマイグレーション
echo "🗄️ Running Prisma generation and migration..."
pnpm prisma:gen
pnpm prisma:mig

echo "✅ Setup finished!"
