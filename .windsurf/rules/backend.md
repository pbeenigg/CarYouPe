# 后端开发规则 (Backend - FastAPI)

## 技术栈

- **框架**: FastAPI
- **ORM**: SQLAlchemy (同步模式, psycopg2-binary)
- **数据库**: PostgreSQL 14 (开发端口 15432)
- **迁移**: Alembic
- **认证**: JWT (python-jose) + bcrypt (passlib)
- **校验**: Pydantic + pydantic-settings
- **缓存**: fastapi-cache (开发用 InMemoryBackend，生产用 Redis)
- **运行**: uvicorn

## 分层架构

```
backend/app/
├── api/              # API 接口层
│   ├── api_v1/       # V1 版本路由
│   │   ├── endpoints/
│   │   │   ├── admin/    # 管理后台接口 (/api/v1/admin/*)
│   │   │   ├── client/   # 小程序端接口 (/api/v1/client/*)
│   │   │   └── common/   # 通用接口 (/api/v1/common/*)
│   │   └── api.py        # 路由注册
│   └── deps.py           # 依赖注入 (DB Session, 用户鉴权, 权限检查)
├── core/             # 核心配置
│   ├── config.py     # 环境配置 (Settings, .env)
│   ├── security.py   # JWT 创建/验证, 密码哈希
│   ├── exceptions.py # 自定义异常体系 (CustomException → Auth/Permission/NotFound/Validation)
│   ├── cache.py      # 缓存装饰器
│   └── decorators.py # 业务装饰器
├── crud/             # 数据库操作层
│   ├── base.py       # CRUDBase 泛型基类 (get/get_multi/create/update/remove)
│   └── crud_*.py     # 各模块 CRUD
├── models/           # SQLAlchemy ORM 模型
├── schemas/          # Pydantic DTO (Request/Response)
├── db/               # 数据库连接 (session.py, base_class.py)
└── main.py           # FastAPI 应用入口
```

## 编码规范

- **PEP 8**: 严格遵循，使用 black 格式化, isort 排序导入
- **类型提示**: 所有函数参数和返回值必须有 Type Hints
- **命名**:
  - 变量/函数: `snake_case` (如 `get_user_by_id`)
  - 类: `PascalCase` (如 `UserResponse`)
  - 常量: `UPPER_CASE` (如 `ACCESS_TOKEN_EXPIRE_MINUTES`)
  - 文件/模块: `snake_case` (如 `crud_user.py`)

## API 设计规则

- **路由分离**: `/admin/*` 管理端 (需 Admin 权限), `/client/*` 小程序端 (User 鉴权)
- **禁止**: 同一接口通过 if/else 同时服务两端，必须拆分独立接口
- **Schema 分离**: models (ORM) 与 schemas (DTO) 严格分离
  - Request: `XxxCreate`, `XxxUpdate`
  - Response: `XxxOut`
- **依赖注入**: 使用 `Depends` 处理 DB Session (`get_db`) 和用户获取 (`get_current_user`)
- **权限控制**: 使用 `check_permission("xxx:read")` 闭包工厂，超级管理员自动放行

## 异常处理

- 使用自定义异常体系，**不要**直接返回错误字典
- `CustomException` 基类，派生: `AuthException(401)`, `PermissionException(403)`, `NotFoundException(404)`, `ValidationException(422)`
- 业务逻辑错误返回 HTTP 200，通过 response body 的 `code` 字段区分
- 支持 i18n message_key 映射

## 统一响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": { ... }
}
```

## CRUD 模式

- 继承 `CRUDBase[ModelType, CreateSchemaType, UpdateSchemaType]` 泛型基类
- 基类提供: `get`, `get_multi`, `create`, `update`, `remove`
- 特殊业务逻辑在子类中扩展

## 数据库

- 连接串: `postgresql://postgres:postgres@localhost:15432/caryoupe`
- 配置通过 `pydantic-settings` + `.env` 文件管理
- 迁移: `alembic revision --autogenerate -m "xxx"` → `alembic upgrade head`

## 核心业务模型

- User, Role, UserRole (RBAC 权限)
- CarBrand, CarSeries, CarModel (车型层级)
- Product, ProductSKU, ProductCarCompatibility (商品与车型匹配)
- Order, OrderItem (订单)
- DistributionRelation, CommissionRecord (分销分佣)
- Wallet, WalletTransaction (钱包流水)
- Menu (动态菜单)
