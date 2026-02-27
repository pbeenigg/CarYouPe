#!/bin/bash

# 服务器端加载镜像脚本
# 使用方法: ./load-image.sh [镜像文件路径]

set -e

IMAGE_FILE=${1}

if [ -z "${IMAGE_FILE}" ]; then
    echo "错误: 请指定镜像文件路径"
    echo "使用方法: ./load-image.sh <镜像文件.tar>"
    exit 1
fi

if [ ! -f "${IMAGE_FILE}" ]; then
    echo "错误: 文件不存在: ${IMAGE_FILE}"
    exit 1
fi

echo "=========================================="
echo "加载 CarYouPe Website Docker 镜像"
echo "=========================================="

# 加载镜像
echo ""
echo "加载镜像到 Docker..."
docker load -i "${IMAGE_FILE}"

echo ""
echo "=========================================="
echo "✅ 镜像加载完成！"
echo "=========================================="
echo ""
echo "查看已加载的镜像:"
docker images | grep caryoupe-website
echo ""
echo "下一步: 启动服务"
echo "  docker compose up -d"
echo "=========================================="
