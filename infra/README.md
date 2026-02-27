# CarYouPe 基础设施部署文档

本目录包含 Gitea、PostgreSQL、Redis 和 Caddy 的 Docker Compose 一键部署配置。

## 架构说明

- **Caddy**: 反向代理服务器，自动 HTTPS
- **PostgreSQL**: Gitea 数据库
- **Redis**: Gitea 缓存和会话存储
- **Gitea**: Git 代码托管服务

## 服务配置

| 服务       | 容器名      | 端口        | 域名                     |
| ---------- | ----------- | ----------- | ------------------------ |
| Caddy      | caddy-infra | 80, 443     | -                        |
| PostgreSQL | postgres    | 5432 (内部) | -                        |
| Redis      | redis       | 6379 (内部) | -                        |
| Gitea      | gitea       | 3000 (内部) | https://git.caryoupe.top |

## 统一配置

- **Docker Network**: `caryoupe`
- **数据库密码**: `Caryoupe!123@456`
- **Redis 密码**: `Caryoupe!123@456`

## 部署方式

本项目采用**本地拉取 + 镜像导入**的方式部署，避免在服务器上拉取镜像时的网络问题。

### 工作流程

```
本地开发机 → 拉取镜像 → 导出 tar → 上传服务器 → 加载镜像 → 启动容器
```

### 跨平台支持

**重要**：本地 Mac（ARM64）拉取的镜像需要在 x86_64 云服务器上运行。

- 拉取脚本已配置 `--platform linux/amd64`，自动拉取 x86_64 架构镜像
- Docker Compose 已配置 `platform: linux/amd64` 和 `pull_policy: never`
- Mac M1/M2/M3 芯片会自动拉取正确的 amd64 版本

## 本地拉取镜像

### 1. 拉取并导出所有镜像

在本地开发机上执行：

```bash
cd /Users/pbeenig/Work/CarYouPe/infra

# 拉取并导出所有镜像（Caddy、PostgreSQL、Redis、Gitea）
chmod +x pull-and-export.sh
./pull-and-export.sh
```

导出的镜像文件保存在 `docker-images/` 目录：

- `caddy.tar`
- `postgres.tar`
- `redis.tar`
- `gitea.tar`

### 2. 上传镜像到服务器

```bash
# 上传所有镜像文件
scp docker-images/*.tar user@your-server:/path/to/infra/docker-images/

# 同时上传必要的配置文件
scp docker-compose.yml user@your-server:/path/to/infra/
scp Caddyfile user@your-server:/path/to/infra/
scp .env user@your-server:/path/to/infra/
scp load-images.sh user@your-server:/path/to/infra/
```

## 服务器部署

### 1. 确保 DNS 解析配置

确保域名 `git.caryoupe.top` 已解析到服务器 IP。

### 2. 加载所有镜像

在服务器上执行：

```bash
cd /path/to/infra

# 加载所有镜像
chmod +x load-images.sh
./load-images.sh

# 验证镜像已加载
docker images | grep -E "caddy|postgres|redis|gitea"
```

### 3. 启动服务

```bash
docker compose up -d
```

### 4. 查看服务状态

```bash
docker compose ps
docker compose logs -f
```

### 5. 初始化 Gitea

访问 https://git.caryoupe.top 进行初始化配置：

- 数据库类型: PostgreSQL
- 主机: postgres:5432
- 用户名: gitea
- 密码: Caryoupe!123@456
- 数据库名: gitea

**注意**: 其他配置已通过环境变量自动设置，无需手动修改。

## 数据持久化

所有数据存储在 Docker volumes 中：

- `caddy_data`: Caddy 数据（包括 SSL 证书）
- `caddy_config`: Caddy 配置
- `postgres_data`: PostgreSQL 数据库
- `redis_data`: Redis 数据
- `gitea_data`: Gitea 仓库和配置

## 常用命令

### 停止服务

```bash
docker compose down
```

### 重启服务

```bash
docker compose restart
```

### 查看日志

```bash
# 查看所有服务日志
docker compose logs -f

# 查看特定服务日志
docker compose logs -f gitea
docker compose logs -f postgres
docker compose logs -f redis
docker compose logs -f caddy
```

### 备份数据

```bash
# 备份 PostgreSQL
docker exec postgres pg_dump -U gitea gitea > backup_$(date +%Y%m%d).sql

# 备份 Gitea 数据目录
docker run --rm -v gitea_data:/data -v $(pwd):/backup alpine tar czf /backup/gitea_backup_$(date +%Y%m%d).tar.gz /data
```

### 恢复数据

```bash
# 恢复 PostgreSQL
cat backup.sql | docker exec -i postgres psql -U gitea gitea

# 恢复 Gitea 数据
docker run --rm -v gitea_data:/data -v $(pwd):/backup alpine tar xzf /backup/gitea_backup.tar.gz -C /
```

## 阿里云私有镜像仓库（可选）

如需使用阿里云私有镜像仓库部署自定义镜像：

### 登录阿里云 Container Registry

```bash
docker login --username=pbeenigg crpi-36u1mweyj9f0cz6e.cn-guangzhou.personal.cr.aliyuncs.com
# 密码: Pbeenig!123@456
```

### 推送镜像

```bash
# 标记镜像
docker tag [ImageId] crpi-36u1mweyj9f0cz6e.cn-guangzhou.personal.cr.aliyuncs.com/caryoupe/[服务名]:[版本号]

# 推送镜像
docker push crpi-36u1mweyj9f0cz6e.cn-guangzhou.personal.cr.aliyuncs.com/caryoupe/[服务名]:[版本号]
```

### 拉取镜像

```bash
docker pull crpi-36u1mweyj9f0cz6e.cn-guangzhou.personal.cr.aliyuncs.com/caryoupe/[服务名]:[版本号]
```

## 故障排查

### Gitea 无法连接数据库

检查 PostgreSQL 是否健康：

```bash
docker compose ps postgres
docker compose logs postgres
```

### Redis 连接失败

检查 Redis 是否正常运行：

```bash
docker compose ps redis
docker exec redis redis-cli -a Caryoupe!123@456 ping
```

### Caddy HTTPS 证书问题

查看 Caddy 日志：

```bash
docker compose logs caddy
```

确保：

- 域名 DNS 解析正确
- 服务器 80/443 端口开放
- 邮箱地址正确（用于 Let's Encrypt 通知）

## 安全建议

1. **修改默认密码**: 部署后立即修改 `.env` 文件中的密码
2. **防火墙配置**: 仅开放 80 和 443 端口，其他端口仅允许内部访问
3. **定期备份**: 设置定时任务定期备份数据库和 Gitea 数据
4. **更新镜像**: 定期更新 Docker 镜像以获取安全补丁

## 监控

建议配置监控服务监控以下指标：

- 容器运行状态
- 磁盘使用率
- 数据库连接数
- Redis 内存使用
- Caddy 访问日志

## 技术支持

如遇问题，请查看：

- Gitea 文档: https://docs.gitea.io
- Caddy 文档: https://caddyserver.com/docs
- PostgreSQL 文档: https://www.postgresql.org/docs
- Redis 文档: https://redis.io/docs
