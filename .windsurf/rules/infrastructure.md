# 基础设施与部署规则 (Infrastructure & Deployment)

## 基础设施组件

| 组件 | 镜像 | 用途 |
|---|---|---|
| Caddy 2 | `caddy:2-alpine` | 反向代理, HTTPS 自动证书, HTTP/3 |
| PostgreSQL | `postgres:14-alpine` | 主数据库 |
| Redis 7 | `redis:7-alpine` | 缓存, Session, 队列 |
| Gitea | `gitea/gitea:1.25.4` | 自托管 Git 仓库 |

## Docker 网络

- 网络名: `caryoupe` (infra 层定义)
- Website 等应用容器通过 `infra_caryoupe` external 网络接入
- 所有容器统一 `linux/amd64` 平台

## 环境变量管理

- 基础设施: `infra/.env` (DB_USER, DB_PASSWORD, DB_NAME, REDIS_PASSWORD, GITEA_*)
- Website: `website/.env.local`
- Backend: `backend/.env` (通过 pydantic-settings 加载)
- **绝对禁止**将密钥硬编码到代码中

## 部署模式

### Website (官网)
- 多阶段 Docker 构建: `node:22-alpine`
- 构建产物: Next.js standalone 模式
- 运行: `node server.js` (端口 3000)
- 通过 Caddy 反向代理暴露

### Backend (后端)
- 运行: `uvicorn app.main:app --reload` (开发)
- 生产: uvicorn + gunicorn 多 worker
- 端口: 8000

### Frontend Admin (管理后台)
- 开发: `npm run dev` (端口 3000)
- 生产: Next.js build + standalone 或 SSR 部署

## 数据库

- 开发端口: `15432` (避免与系统 PostgreSQL 冲突)
- 数据库名: `caryoupe`
- 迁移工具: Alembic
- 数据持久化: Docker Volume (`./data/postgres`)

## 监控与日志

- 生产环境异常应记录日志 (当前 main.py 中 print，需升级为正式 logging)
- Redis 和 PostgreSQL 均配置 healthcheck
