# 开发规范文档 (Development Standards)

本文档旨在统一 **CarYouPe** 项目的开发规范，确保代码风格一致、易于维护和协作。

## 1. 通用规范 (General)

### 1.1 Git 提交规范 (Conventional Commits)

提交信息应遵循 `type(scope): subject` 格式。

- **Type**:
  - `feat`: 新功能
  - `fix`: 修复 Bug
  - `docs`: 文档修改
  - `style`: 代码格式修改（不影响逻辑）
  - `refactor`: 代码重构
  - `perf`: 性能优化
  - `test`: 测试用例
  - `chore`: 构建/工具链修改
- **Example**: `feat(auth): implement wechat login`

### 1.2 分支管理

- `main`: 主分支，随时可部署。
- `dev`: 开发分支，日常开发合并处。
- `feat/xxx`: 功能分支，从 dev 切出。
- `fix/xxx`: 修复分支。

---

## 2. 后端开发规范 (Backend - FastAPI)

### 2.1 代码风格

- 遵循 **PEP 8** 规范。
- **工具**: 强制使用 `black` 格式化，`isort` 排序导入，`flake8` 检查语法。
- **类型提示**: 所有函数参数和返回值必须添加 Type Hints。

### 2.2 命名规范

- **变量/函数**: `snake_case` (e.g., `user_id`, `get_user_by_id`)
- **类名**: `PascalCase` (e.g., `User`, `UserResponse`)
- **常量**: `UPPER_CASE` (e.g., `ACCESS_TOKEN_EXPIRE_MINUTES`)
- **文件/模块**: `snake_case` (e.g., `user_model.py`)

### 2.3 项目结构

为了清晰区分**后台管理端**与**小程序端**的业务逻辑，API 层级应进行明确拆分：

```
backend/app/
├── api/
│   └── api_v1/
│       ├── api.py          # 路由汇总
│       └── endpoints/
│           ├── admin/      # 管理后台专用接口 (需要管理员权限)
│           │   ├── users.py
│           │   └── products.py
│           ├── client/     # 小程序/用户端专用接口 (需要会员权限)
│           │   ├── auth.py
│           │   └── home.py
│           └── common/     # 公共接口 (如文件上传、回调)
├── core/                   # 核心配置
├── db/                     # 数据库
├── models/                 # ORM 模型
├── schemas/                # Pydantic Schemas
│   ├── admin/              # 管理端专用 Schema (如 UserCreateAdmin)
│   ├── client/             # 客户端专用 Schema (如 UserProfile)
│   └── common/             # 通用 Schema
└── services/               # 业务逻辑层
```

### 2.4 最佳实践

- **API 分离原则**:
  - `/api/v1/admin/*`: 仅供管理后台调用，通常需要 `Superuser` 或 `Admin` 角色权限。
  - `/api/v1/client/*`: 供小程序端调用，基于 `User` 角色鉴权。
  - 避免同一个接口通过 `if/else` 同时服务两端，应拆分为两个独立的接口以隔离业务变化。
- **Schema 分离**: 数据库模型 (`models`) 与 交互模型 (`schemas`) 严格分离。
  - Request: `UserCreate`, `UserUpdate`
  - Response: `UserOut`
- **依赖注入**: 使用 FastAPI 的 `Depends` 处理数据库会话和当前用户获取。
- **异步**: 优先使用 `async def`，数据库操作使用异步驱动 (如需)。_注：目前使用同步 psycopg2，后续可升级 asyncpg_。
- **错误处理**: 统一抛出 `HTTPException`，不要直接返回错误字典。

---

## 3. 管理后台开发规范 (Frontend Admin - Next.js)

### 3.1 技术栈

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Shadcn UI (组件库)
- Zustand (状态管理)

### 3.2 命名规范

- **组件文件**: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
- **Hook**: `useCamelCase.ts` (e.g., `useAuth.ts`)
- **工具函数**: `camelCase.ts`
- **Interface/Type**: `IPascalCase` 或 `PascalCaseType`

### 3.3 代码风格

- 使用 **ESLint** + **Prettier**。
- **组件定义**: 优先使用 `const Component: React.FC<Props> = (...) => ...` 或 `function Component(...)`.
- **样式**: 优先使用 Tailwind Utility Classes，避免写 CSS 文件。

### 3.4 目录结构 (App Router)

针对**平台管理员、经销商、区域代理**三种不同角色的业务视图，建议使用 Next.js 的 **Route Groups** 进行逻辑隔离，以便于权限控制和布局管理。

```
frontend_admin/src/
├── app/
│   ├── (auth)/             # 认证模块 (登录/注册/找回密码) - 无需鉴权
│   │   └── login/
│   ├── (platform)/         # 平台管理端 (Platform Admin)
│   │   ├── admin/          # 路由前缀 /admin
│   │   │   ├── dashboard/
│   │   │   └── settings/
│   │   └── layout.tsx      # 平台管理员专用布局 (紫色主题侧边栏)
│   ├── (dealer)/           # 经销商端 (Dealer Portal)
│   │   ├── dealer/         # 路由前缀 /dealer
│   │   │   ├── orders/
│   │   │   └── goods/
│   │   └── layout.tsx      # 经销商专用布局 (蓝色主题侧边栏)
│   └── (partner)/          # 合伙人端 (Partner Portal)
│       ├── partner/        # 路由前缀 /partner
│       └── layout.tsx      # 合伙人专用布局
├── components/
│   ├── business/           # 业务组件 (可复用的表格、表单)
│   └── layout/             # 布局组件 (Sidebar, Header)
├── lib/                    # 工具函数
└── middleware.ts           # 路由中间件 (处理角色路由守卫)
```

### 3.5 权限控制最佳实践

- **路由守卫**: 使用 `middleware.ts` 拦截请求，根据 Token 中的 `role` 字段重定向到对应模块。
  - `role=admin` -> `/admin/dashboard`
  - `role=store` -> `/dealer/dashboard`
- **组件复用**: 虽然路由分离，但底层业务组件（如`OrderTable`, `ProductForm`）应在 `components/business` 中复用，通过 props 控制显示差异。

### 3.6 国际化规范 (i18n)

- **库选型**: `next-intl` 或 `react-i18next`。
- **资源文件**:
  ```
  frontend_admin/messages/
  ├── zh-CN.json
  └── en-US.json
  ```
- **结构规范**: 采用嵌套 JSON 结构，按模块命名。
  ```json
  {
    "Common": {
      "submit": "提交",
      "cancel": "取消"
    },
    "Auth": {
      "loginTitle": "登录系统"
    }
  }
  ```

### 3.7 UI/UX 设计规范 (Shadcn Admin)

管理后台必须严格遵循 **Shadcn Admin** 风格，保持简洁、现代、统一的视觉体验。

- **布局 (Layout)**:
  - **Sidebar**: 左侧可折叠菜单，支持深色/浅色模式切换。
  - **Header**: 顶部导航栏，包含面包屑 (Breadcrumb)、用户头像、通知铃铛、语言切换。
  - **Main Content**: 内容区域使用 `Card` 组件包裹，保持统一内边距 (p-4 或 p-6)。
- **组件使用**:
  - **Table**: 使用 `shadcn/ui` 的 DataTable，必须包含分页、筛选、排序功能。
  - **Form**: 使用 `react-hook-form` + `zod` + `shadcn/ui` Form 组件，统一错误提示样式。
  - **Dialog**: 弹窗表单或确认框，必须支持键盘 `Esc` 关闭。
- **主题色**:
  - **Platform (平台)**: 默认主题 (Zinc/Slate)，强调专业与中立。
  - **Dealer (经销商)**: 蓝色主题 (Blue)，强调商业与信任。
  - **Partner (合伙人)**: 紫色主题 (Violet)，强调尊贵与权益。

---

## 4. 小程序开发规范 (Frontend UniApp)

### 4.1 技术栈

- Uni-App (Vue 3 语法)
- SCSS (推荐使用 Tailwind 兼容方案或 UnoCSS)
- uView Plus (Vue3 版本) 或 Uni-UI

### 4.2 多端适配策略 (WeChat / Douyin / XHS)

本项目需同时发布到 **微信、抖音、小红书**，必须严格遵循以下适配规范：

#### 4.2.1 条件编译 (Conditional Compilation)

严禁在业务逻辑中写死特定平台的代码，必须使用条件编译：

```html
<!-- #ifdef MP-WEIXIN -->
<view>仅微信小程序可见</view>
<!-- #endif -->

<!-- #ifdef MP-TOUTIAO -->
<view>仅抖音小程序可见</view>
<!-- #endif -->

<!-- #ifdef MP-XHS -->
<view>仅小红书小程序可见</view>
<!-- #endif -->
```

#### 4.2.2 平台差异化处理

- **登录流程**: 不同平台的 `login` 接口返回字段不同，需在 `services/auth.js` 中通过条件编译分别处理 `uni.login` 的逻辑。
- **支付支付**: 抖音和微信的支付 API 存在差异，需封装统一的 `PaymentService`。
- **样式兼容**:
  - 避免使用 `px`，统一使用 `rpx`。
  - 注意小红书小程序对某些 CSS 伪类的支持可能不完善，尽量使用 Flex 布局。

### 4.3 目录结构

```
frontend_uniapp/
├── pages/              # 主包页面 (TabBar页面 + 核心高频页)
├── pages_admin/        # 分包: 管理端功能 (如门店管理)
├── pages_marketing/    # 分包: 营销活动
├── static/             # 静态资源
│   ├── common/         # 通用资源
│   ├── mp-weixin/      # 微信专用资源
│   ├── mp-douyin/      # 抖音专用资源
│   └── mp-xhs/         # 小红书专用资源
├── uni_modules/        # 插件市场组件
├── utils/              # 工具类 (request.js, platform.js)
├── api/                # 接口定义
└── manifest.json       # 多端配置 (需分别为不同平台配置 AppID)
```
