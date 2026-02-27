---
description: 新增全栈功能的标准流程 (Standard workflow for adding a new full-stack feature)
---

## 新增全栈功能标准流程

遵循 "Admin First" 策略，按以下顺序开发：

### Step 1: 后端 - 数据模型

1. 在 `backend/app/models/` 新增或修改 ORM 模型
2. 在 `backend/app/models/__init__.py` 中导入新模型
3. 生成 Alembic 迁移:
```bash
cd /Users/pbeenig/Work/CarYouPe/backend
alembic revision --autogenerate -m "add xxx table"
```
// turbo
4. 执行迁移:
```bash
cd /Users/pbeenig/Work/CarYouPe/backend
alembic upgrade head
```

### Step 2: 后端 - Schema & CRUD

1. 在 `backend/app/schemas/` 新增 Pydantic DTO (XxxCreate, XxxUpdate, XxxOut)
2. 在 `backend/app/schemas/__init__.py` 中导入
3. 在 `backend/app/crud/` 新增 CRUD 类 (继承 CRUDBase)
4. 在 `backend/app/crud/__init__.py` 中导出实例

### Step 3: 后端 - API 端点

1. 在 `backend/app/api/api_v1/endpoints/admin/` 新增路由文件
2. 使用 `Depends(get_current_user)` 或 `Depends(check_permission("xxx:read"))` 鉴权
3. 在 `backend/app/api/api_v1/api.py` 中注册路由
4. 测试: 访问 http://localhost:8000/docs 验证接口

### Step 4: 管理后台 - 页面

1. 在 `frontend_admin/src/app/[locale]/(platform)/admin/xxx/page.tsx` 新增页面
2. 在 `frontend_admin/src/components/business/` 中添加业务组件 (如需)
3. 更新翻译文件 `messages/zh-CN.json` 和 `messages/en-US.json`
4. 如需新 UI 组件: `npx shadcn@latest add <component>`

### Step 5: (后续) 小程序端 - Client API + UI

1. 在 `backend/app/api/api_v1/endpoints/client/` 新增客户端接口
2. 在 `frontend_uniapp/api/` 新增接口定义
3. 在 `frontend_uniapp/pages/` 新增页面
