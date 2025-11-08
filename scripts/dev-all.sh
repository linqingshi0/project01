#!/usr/bin/env bash
set -e

ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
cd "$ROOT_DIR"

if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm 未安装，请先安装 pnpm" >&2
  exit 1
fi

echo "启动 API 与 Web 开发服务器..."
COREPACK_ENABLE_HOME="$HOME/.config/corepack" pnpm -r --parallel dev
