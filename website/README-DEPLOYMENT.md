# Website 部署说明

本项目使用 infra 目录中的公共 Caddy 代理服务。

## 部署方式

本项目采用**本地构建 + 镜像导入**的方式部署，避免在服务器上构建时的网络依赖问题。

### 工作流程

```
本地开发机 → 构建镜像 → 导出 tar → 上传服务器 → 加载镜像 → 启动容器
```

### 跨平台支持

**重要**：本地 Mac（ARM64）构建的镜像需要在 x86_64 云服务器上运行。

- 构建脚本已配置 `--platform linux/amd64`，自动构建 x86_64 架构镜像
- Docker Compose 已配置 `platform: linux/amd64`，确保使用正确架构
- Mac M1/M2/M3 芯片会自动使用 Rosetta 模拟构建 x86_64 镜像

## 本地构建镜像

### 0. 配置版本号

在 `.env.local` 文件中设置版本号：

```bash
# .env.local
VERSION=v1.0.0
```

此版本号用于：

1. **构建时**：`build-and-export.sh` 脚本导出镜像的标签
2. **部署时**：`docker-compose.yml` 启动容器时使用的镜像版本

这样确保构建和部署使用相同的版本号。

### 1. 构建并导出镜像

在本地开发机上执行：

```bash
cd /Users/pbeenig/Work/CarYouPe/website

# 方式 1: 使用 .env.local 中配置的版本号（推荐）
./build-and-export.sh

# 方式 2: 手动指定版本号（会覆盖 .env.local 中的配置）
./build-and-export.sh v1.0.1

# 方式 3: 构建 latest 版本
./build-and-export.sh latest
```

**版本号优先级**：命令行参数 > .env.local 中的 VERSION > latest

构建完成后，镜像文件保存在 `docker-images/` 目录：

- 如果版本号是 `v1.0.0`，生成 `caryoupe-website-v1.0.0.tar`
- 如果版本号是 `latest`，生成 `caryoupe-website-latest.tar`

### 2. 上传镜像到服务器

```bash
# 上传镜像文件到服务器
scp docker-images/caryoupe-website-latest.tar user@your-server:/path/to/website/

# 同时上传必要的配置文件
scp docker-compose.yml user@your-server:/path/to/website/
scp .env.local user@your-server:/path/to/website/
scp load-image.sh user@your-server:/path/to/website/
```

## 服务器部署

### 1. 加载镜像

在服务器上执行：

```bash
cd /path/to/website

# 加载镜像
chmod +x load-image.sh
./load-image.sh caryoupe-website-latest.tar

# 验证镜像已加载
docker images | grep caryoupe-website
```

### 2. 启动 infra 基础设施

```bash
cd /path/to/infra
docker compose up -d
```

这会创建 `caryoupe` Docker 网络和启动 Caddy、PostgreSQL、Redis、Gitea 服务。

### 3. 启动 website 服务

```bash
cd /path/to/website
docker compose up -d
```

website 服务会自动加入 infra 创建的 `caryoupe` 网络。

## 网络架构

```
┌─────────────────────────────────────────┐
│  infra/docker-compose.yml               │
│  ┌────────────────────────────────────┐ │
│  │  Caddy (公共代理)                   │ │
│  │  - caryoupe.top → website:3000     │ │
│  │  - git.caryoupe.top → gitea:3000   │ │
│  └────────────────────────────────────┘ │
│  ┌────────────────────────────────────┐ │
│  │  PostgreSQL, Redis, Gitea          │ │
│  └────────────────────────────────────┘ │
│                                         │
│  Network: caryoupe (external: false)   │
└─────────────────────────────────────────┘
                    ↑
                    │ 加入网络
                    │
┌─────────────────────────────────────────┐
│  website/docker-compose.yml             │
│  ┌────────────────────────────────────┐ │
│  │  caryoupe-website (Next.js)        │ │
│  │  - 端口: 3000                       │ │
│  └────────────────────────────────────┘ │
│                                         │
│  Network: caryoupe (external: true)    │
└─────────────────────────────────────────┘
```

## 域名配置

- **主站**: https://caryoupe.top, https://www.caryoupe.top
- **Git**: https://git.caryoupe.top

所有域名通过 infra 的 Caddy 统一管理，自动 HTTPS。

## 常用命令

### 查看所有服务状态

```bash
docker ps
```

### 查看 website 日志

```bash
cd /Users/pbeenig/Work/CarYouPe/website
docker compose logs -f
```

### 重启 website

```bash
cd /Users/pbeenig/Work/CarYouPe/website
docker compose restart
```

### 重新构建并启动

```bash
cd /Users/pbeenig/Work/CarYouPe/website
docker compose up -d --build
```

### 停止所有服务

```bash
# 先停止 website
cd /Users/pbeenig/Work/CarYouPe/website
docker compose down

# 再停止 infra（会停止 Caddy 等基础服务）
cd /Users/pbeenig/Work/CarYouPe/infra
docker compose down
```

## 镜像管理

### 查看本地镜像

```bash
docker images | grep caryoupe-website
```

### 清理旧镜像

```bash
# 删除未使用的镜像
docker image prune -a

# 删除特定版本
docker rmi caryoupe-website:v1.0.0
```

### 镜像文件管理

```bash
# 查看导出的镜像文件
ls -lh docker-images/

# 清理本地镜像文件（释放磁盘空间）
rm -rf docker-images/*.tar
```

## 注意事项

1. **启动顺序很重要**: 必须先启动 infra，再启动 website
2. **网络依赖**: website 依赖 infra 创建的 `caryoupe` 网络
3. **Caddy 配置**: 所有域名代理配置在 `infra/Caddyfile` 中统一管理
4. **端口冲突**: 确保 80 和 443 端口未被占用
5. **镜像版本**: 使用版本号管理镜像，便于回滚
6. **环境变量**: 确保 `.env.local` 文件已正确配置并上传到服务器

## 故障排查

### website 无法访问

1. 检查 infra 是否正常运行：

```bash
cd /Users/pbeenig/Work/CarYouPe/infra
docker compose ps
```

2. 检查 Caddy 日志：

```bash
docker logs caddy-infra
```

3. 检查网络连接：

```bash
docker network inspect caryoupe
```

### 更新 Caddy 配置

修改 `infra/Caddyfile` 后重启 Caddy：

```bash
cd /path/to/infra
docker compose restart caddy
```
