#!/bin/bash
echo "Deploy script running."

# 获取脚本所在目录并切换到上一级目录
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
cd "$script_dir/.." || { echo "无法切换到目录: $script_dir/.."; exit 1; }
# 在此处添加部署命令
echo "当前工作目录: $(pwd)"

docker run -v "$(pwd)":/app -w /app node:latest bash -c "
  echo 'Installing dependencies...'
  npm install
  echo 'Building project...'
  npm run build"