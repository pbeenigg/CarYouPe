#!/bin/bash

# 服务器端加载所有 infra 镜像
# 使用方法: ./load-images.sh

set -e

IMAGES_DIR="./docker-images"

if [ ! -d "${IMAGES_DIR}" ]; then
    echo "错误: 镜像目录不存在: ${IMAGES_DIR}"
    echo "请先上传镜像文件到此目录"
    exit 1
fi

echo "=========================================="
echo "加载 Infra Docker 镜像"
echo "=========================================="

# 统计镜像文件数量
image_count=$(ls ${IMAGES_DIR}/*.tar 2>/dev/null | wc -l)

if [ ${image_count} -eq 0 ]; then
    echo "错误: 在 ${IMAGES_DIR} 中未找到 .tar 镜像文件"
    exit 1
fi

echo "找到 ${image_count} 个镜像文件"
echo ""

# 加载所有镜像
for image_file in ${IMAGES_DIR}/*.tar; do
    echo "----------------------------------------"
    echo "加载: $(basename ${image_file})"
    echo "----------------------------------------"
    docker load -i "${image_file}"
    echo "✓ 完成"
    echo ""
done

echo "=========================================="
echo "✅ 所有镜像加载完成！"
echo "=========================================="
echo ""
echo "已加载的镜像:"
docker images | grep -E "caddy|postgres|redis|gitea" | head -10
echo ""
echo "下一步: 启动服务"
echo "  docker compose up -d"
echo "=========================================="
