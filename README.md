# CarYouPe (汽车用品之家)

> 广州引领者汽车用品有限公司 — 汽车脚垫 · 座垫 · 座套等皮革制品全栈电商平台

![Python](https://img.shields.io/badge/Python-FastAPI-009688?logo=fastapi)
![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-4169E1?logo=postgresql)
![Vue](https://img.shields.io/badge/Vue-3-4FC08D?logo=vue.js)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)

---

## 项目简介

CarYouPe 是一个面向汽车用品行业的多端电商平台，覆盖 **官网展示 → 管理后台 → 小程序商城** 完整链路。

- **企业**：广州引领者汽车用品有限公司（成立于 2020 年，7000㎡ 标准化生产车间）
- **产品线**：全包围皮革脚垫、四季座套、后备箱垫、航空软包脚垫、手缝方向盘等
- **开发策略**：Admin First — 后端 API → 管理后台 UI → 客户端 API → 小程序 UI

---

## 项目结构

| 目录                   | 说明                        | 技术栈                                             |
| :--------------------- | :-------------------------- | :------------------------------------------------- |
| **`backend/`**         | 核心后端 API 服务           | Python FastAPI + SQLAlchemy + Alembic + PostgreSQL  |
| **`frontend_admin/`**  | 管理后台 SPA                | Next.js 16 + React 19 + Shadcn UI + Tailwind v4    |
| **`website/`**         | 企业官网                    | Next.js 14 + React 18 + Tailwind v3 + Framer Motion|
| **`frontend_uniapp/`** | 小程序端 (微信/抖音/小红书) | Uni-App + Vue 3                                    |
| **`infra/`**           | 基础设施 & 部署             | Docker Compose + Caddy 2 + PostgreSQL 14 + Redis 7 |
| **`docs/`**            | 项目文档                    | Markdown                                           |

---

## 技术栈详情

### Backend (`backend/`)

| 类别     | 技术                                                        |
| :------- | :---------------------------------------------------------- |
| 框架     | FastAPI + Uvicorn                                           |
| ORM      | SQLAlchemy + Alembic (数据库迁移)                           |
| 数据库   | PostgreSQL 14 (开发端口 `15432`)                            |
| 认证     | JWT (`python-jose`) + Passlib bcrypt                        |
| 缓存     | FastAPI-Cache (Redis / InMemory 开发回退)                   |
| 校验     | Pydantic + Pydantic-Settings (`.env` 配置)                  |

### Admin 管理后台 (`frontend_admin/`)

| 类别     | 技术                                                        |
| :------- | :---------------------------------------------------------- |
| 框架     | Next.js 16 + React 19 (React Compiler)                     |
| UI 组件  | Shadcn UI (new-york) + Radix UI + Lucide Icons              |
| 样式     | Tailwind CSS v4 + tw-animate-css                            |
| 国际化   | next-intl 4 (zh-CN / en-US)                                |
| 状态/请求| Axios 拦截器 (自动 Token 注入 + 响应解包) + useRequest Hook |
| 表单     | React Hook Form + Zod v4                                    |
| 主题     | next-themes (亮色/暗色)                                     |

### 企业官网 (`website/`)

| 类别     | 技术                                                        |
| :------- | :---------------------------------------------------------- |
| 框架     | Next.js 14 + React 18                                      |
| 样式     | Tailwind CSS v3 (深色科技感，品牌色 #DC143C 爱马仕红)       |
| 动效     | Framer Motion 12                                            |
| 数据驱动 | `config/site-data.json` 集中管理所有展示内容                |
| 邮件     | EmailJS + Nodemailer                                        |
| 域名     | `caryoupe.top`                                              |

### 小程序端 (`frontend_uniapp/`)

| 类别     | 技术                                                        |
| :------- | :---------------------------------------------------------- |
| 框架     | Uni-App + Vue 3                                             |
| 目标平台 | 微信小程序 · 抖音小程序 · 小红书小程序                      |
| 状态     | 规划中                                                      |

### 基础设施 (`infra/`)

| 服务       | 镜像               | 用途                      |
| :--------- | :------------------ | :------------------------ |
| Caddy 2    | `caddy:2-alpine`    | 反向代理 + 自动 HTTPS     |
| PostgreSQL | `postgres:14-alpine`| 数据库                    |
| Redis 7    | `redis:7-alpine`    | 缓存 & 会话               |
| Gitea      | `gitea/gitea:1.25`  | 自托管 Git (git.caryoupe.top) |

---

## 系统架构

```
┌─────────────┐  ┌──────────────┐  ┌─────────────────┐
│  小程序端    │  │  管理后台     │  │    企业官网      │
│  Uni-App     │  │  Next.js 16  │  │    Next.js 14   │
└──────┬───────┘  └──────┬───────┘  └────────┬────────┘
       │                 │                    │
       └────────┬────────┘                    │
                ▼                             │
  ┌──────────────────────────┐                │
  │   FastAPI Backend        │                │
  │  /api/v1/admin/*         │     site-data.json (静态)
  │  /api/v1/client/*        │                │
  │  /api/v1/common/*        │                │
  └──────────┬───────────────┘                │
             │                                │
     ┌───────┴───────┐                        │
     ▼               ▼                        │
 PostgreSQL       Redis                   Caddy (HTTPS)
```

### 后端分层

```
API Endpoints (admin/ | client/ | common/)
    ↓
CRUD Layer (CRUDBase 泛型 + 业务子类)
    ↓
Models (SQLAlchemy ORM)
    ↓
Schemas (Pydantic 请求/响应)
```

### 权限体系 (RBAC)

- **权限码格式**：`module:action`（如 `user:read`, `order:write`）
- **角色**：Role 模型含 `permissions` JSON 列表，超级管理员拥有 `*` 全部权限
- **校验**：`check_permission()` 闭包工厂 + FastAPI `Depends` 依赖注入
- **前端守卫**：`PermissionGuard` 组件 + `AuthProvider` 上下文

### 异常体系

`CustomException` 基类 → `AuthException (401)` / `PermissionException (403)` / `NotFoundException (404)` / `ValidationException (422)`，支持 i18n 消息键。

---

## 业务模块

| 模块         | 后端 Model                              | 管理后台页面     |
| :----------- | :-------------------------------------- | :--------------- |
| 仪表盘       | —                                       | ✅ dashboard     |
| 用户管理     | `User`                                  | ✅ users         |
| 角色管理     | `Role`, `UserRole`                      | ✅ roles         |
| 菜单管理     | `Menu`                                  | ✅ menus         |
| 商品管理     | `Product`, `ProductSKU`, `Category`     | ✅ products, categories |
| 车型管理     | `CarBrand`, `CarSeries`, `CarModel`     | ✅ cars          |
| 订单管理     | `Order`, `OrderItem`                    | ✅ orders        |
| 地址管理     | `Address`                               | ✅ (后端已实现)  |
| 店铺/合伙人  | `Store`                                 | ✅ stores        |
| 分销管理     | `DistributionRelation`, `CommissionRecord` | ✅ distributions |
| 钱包/财务    | `Wallet`, `WalletTransaction`           | ✅ wallets       |
| 系统设置     | —                                       | ✅ settings      |

---

## 快速开始

### 环境要求

- **Python** ≥ 3.10
- **Node.js** ≥ 18
- **PostgreSQL** 14（开发端口 `15432`）

### 1. Backend

```bash
# 创建虚拟环境 & 安装依赖
cd backend
python -m venv ../venv
source ../venv/bin/activate
pip install -r requirements.txt

# 配置环境变量（复制并编辑 .env）
# 关键变量: POSTGRES_SERVER, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB

# 数据库迁移
alembic upgrade head

# 启动开发服务器 (默认 http://localhost:8000)
uvicorn app.main:app --reload --port 8000
```

API 文档：启动后访问 `http://localhost:8000/api/v1/openapi.json`

### 2. Admin 管理后台

```bash
cd frontend_admin
npm install
npm run dev
# 访问 http://localhost:3000
```

- 默认语言：zh-CN
- 支持语言切换：zh-CN / en-US
- 支持暗色/亮色主题切换

### 3. Website 企业官网

```bash
cd website
npm install
npm run dev
# 访问 http://localhost:3000
```

### 4. Mini-Program 小程序端

使用 **HBuilderX** 打开 `frontend_uniapp/` 目录进行开发和运行。

---

## 部署

生产环境基于 Docker Compose 部署，详见 [infra/README.md](infra/README.md)。

```
本地开发机 → 拉取 amd64 镜像 → 导出 tar → 上传服务器 → 加载镜像 → docker compose up
```

| 域名                | 服务     |
| :------------------ | :------- |
| `caryoupe.top`      | 企业官网 |
| `git.caryoupe.top`  | Gitea    |

---

## 项目文档

| 文档                                                        | 说明             |
| :---------------------------------------------------------- | :--------------- |
| [需求规格说明](docs/requirements_spec.md)                   | 产品需求与功能规划 |
| [架构设计](docs/architecture_design.md)                     | 系统架构设计文档   |
| [数据库设计](docs/database_schema.md)                       | 数据表结构定义     |
| [API 定义](docs/api_definition.md)                          | 接口规范与约定     |
| [开发规范](docs/development_standards.md)                   | 编码规范与目录结构 |
| [项目路线图](docs/project_roadmap.md)                       | 开发计划与里程碑   |

---

## 开发规范

- 详细开发规范请参考 [docs/development_standards.md](docs/development_standards.md)
- IDE 规则配置位于 `.windsurf/rules/` 目录（含 backend / frontend-admin / website / coding-style 等）
- 开发工作流位于 `.windsurf/workflows/`（backend-dev / admin-dev / website-dev / add-feature）
