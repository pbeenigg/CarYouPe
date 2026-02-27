# CarYouPe (汽车用品之家) - 项目规则

## 项目概述

CarYouPe 是广州引领者汽车用品有限公司的全栈电商平台，涵盖官网展示、管理后台和多端小程序。
业务核心：汽车脚垫、座垫、座套等皮革制品的线上销售，含分销体系和多角色管理。

## 项目结构

| 目录 | 说明 | 技术栈 |
|---|---|---|
| `backend/` | 核心后端 API | Python FastAPI + SQLAlchemy + PostgreSQL |
| `frontend_admin/` | 管理后台 | Next.js 16 + React 19 + Shadcn UI + Tailwind v4 |
| `website/` | 官网展示站 | Next.js 14 + React 18 + Tailwind v3 + Framer Motion |
| `frontend_uniapp/` | 小程序端 | Uni-App + Vue 3 (微信/抖音/小红书) |
| `infra/` | 基础设施 | Docker Compose + Caddy + PostgreSQL + Redis + Gitea |
| `docs/` | 项目文档 | Markdown |

## 开发策略

遵循 **"管理后台优先 (Admin First)"** 策略：
1. 优先完成管理后台与后端核心 (Backend API → Admin UI)
2. 后置小程序开发 (Client API → Mini-Program UI)
3. 任何新功能按 `Backend API` → `Admin UI` → `Client API` → `Mini-Program UI` 顺序开发

## 通用规则

- **语言**: 代码注释和文档必须包含中文说明（业务注释用中文，代码标识符用英文）
- **Git 提交**: 遵循 `type(scope): subject` 格式 (feat/fix/docs/style/refactor/perf/test/chore)
- **分支**: main (可部署) / dev (日常开发) / feat/xxx / fix/xxx
- **注释要求**: 类/模块必须 Docstring，函数必须说明功能/参数/返回值，关键字段必须注释
- **不要删除或修改现有注释**，除非用户明确要求
