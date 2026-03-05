#!/bin/bash

# 本地拉取并导出 infra 所需的所有镜像
# 使用方法: ./pull-and-export.sh

set -e

EXPORT_DIR="./docker-images"
PLATFORM="linux/amd64"

# 定义所有需要的镜像（格式: "名称:镜像"）
IMAGES=(
    "caddy:caddy:2.11.1"
    "postgres:postgres:14.22"
    "redis:redis:8.6"
    "gitea:gitea/gitea:1.25.4"
    "portainer:6053537/portainer-ce:2.33.6"
)

echo "=========================================="
echo "拉取并导出 Infra 镜像"
echo "目标平台: ${PLATFORM}"
echo "=========================================="

# 创建导出目录
mkdir -p ${EXPORT_DIR}

# 拉取并导出每个镜像
for item in "${IMAGES[@]}"; do
    name="${item%%:*}"
    image="${item#*:}"
    filename="${EXPORT_DIR}/${name}.tar"
    
    echo ""
    echo "----------------------------------------"
    echo "处理镜像: ${image}"
    echo "----------------------------------------"
    
    # 拉取指定平台的镜像
    echo "步骤 1/2: 拉取镜像..."
    docker pull --platform ${PLATFORM} ${image}
    
    # 导出镜像
    echo "步骤 2/2: 导出镜像到 ${filename}..."
    docker save -o ${filename} ${image}
    
    echo "✓ 完成: ${filename} ($(du -h ${filename} | cut -f1))"
done

echo ""
echo "=========================================="
echo "✅ 所有镜像导出完成！"
echo "=========================================="
echo "导出目录: ${EXPORT_DIR}"
echo ""
echo "文件列表:"
ls -lh ${EXPORT_DIR}/*.tar
echo ""
echo "下一步："
echo "1. 上传所有镜像到服务器:"
echo "   scp ${EXPORT_DIR}/*.tar user@server:/path/to/infra/docker-images/"
echo ""
echo "2. 在服务器上加载镜像:"
echo "   ./load-images.sh"
echo ""
echo "3. 启动服务:"
echo "   docker compose up -d"
echo "=========================================="
