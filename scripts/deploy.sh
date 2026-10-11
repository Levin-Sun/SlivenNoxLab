#!/usr/bin/env bash
# 本地手动部署备通道：构建 → rsync 上传
# 用法：SERVER_HOST=root SERVER_ADDR=服务器IP ./scripts/deploy.sh
# 主通道是 GitHub Actions（push 即上线），此脚本用于服务器调试或 CI 不可用时
set -euo pipefail

SERVER_HOST="${SERVER_HOST:?请设置 SERVER_HOST，如 root}"
SERVER_ADDR="${SERVER_ADDR:?请设置 SERVER_ADDR，如 umax.dpdns.org}"
TARGET_DIR="${TARGET_DIR:-/var/www/slivennoxlab}"

echo "[1/2] 构建..."
npm run build

echo "[2/2] 同步到 ${SERVER_HOST}@${SERVER_ADDR}:${TARGET_DIR} ..."
rsync -az --delete dist/ "${SERVER_HOST}@${SERVER_ADDR}:${TARGET_DIR}/"

echo "完成。检查 https://${SERVER_ADDR}"
