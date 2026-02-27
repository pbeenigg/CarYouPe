#!/bin/bash

# 本地构建并导出 website 镜像脚本
# 使用方法: ./build-and-export.sh [版本号]
# 如果不指定版本号，会从 .env.local 读取 VERSION 变量

set -e

# 从 .env.local 加载环境变量
if [ -f .env.local ]; then
    export $(grep -v '^#' .env.local | grep -v '^$' | xargs)
fi

# 优先使用命令行参数，其次使用环境变量，最后使用 latest
VERSION=${1:-${VERSION:-latest}}
IMAGE_NAME="caryoupe-website"
EXPORT_DIR="./docker-images"
EXPORT_FILE="${EXPORT_DIR}/${IMAGE_NAME}-${VERSION}.tar"

echo "=========================================="
echo "构建 CarYouPe Website Docker 镜像"
echo "版本: ${VERSION}"
echo "=========================================="

# 创建导出目录
mkdir -p ${EXPORT_DIR}

# 构建镜像
echo ""
echo "步骤 1/3: 构建 Docker 镜像（目标平台: linux/amd64）..."
docker build --platform linux/amd64 -t ${IMAGE_NAME}:${VERSION} -f Dockerfile .

# 如果版本不是 latest，也打上 latest 标签
if [ "${VERSION}" != "latest" ]; then
    echo ""
    echo "打标签: ${IMAGE_NAME}:latest"
    docker tag ${IMAGE_NAME}:${VERSION} ${IMAGE_NAME}:latest
fi

# 导出镜像
echo ""
echo "步骤 2/2: 导出镜像到 ${EXPORT_FILE}..."
docker save -o ${EXPORT_FILE} ${IMAGE_NAME}:${VERSION}

echo ""
echo "=========================================="
echo "✅ 构建完成！"
echo "=========================================="
echo "镜像文件: ${EXPORT_FILE}"
echo "文件大小: $(du -h ${EXPORT_FILE} | cut -f1)"
echo ""
echo "下一步："
echo "1. 上传镜像到服务器:"
echo "   scp ${EXPORT_FILE} user@server:/path/to/website/"
echo ""
echo "2. 在服务器上加载镜像:"
echo "   docker load -i ${IMAGE_NAME}-${VERSION}.tar"
echo ""
echo "3. 启动服务:"
echo "   docker compose up -d"
echo "=========================================="
