# 管理后台开发规则 (Frontend Admin - Next.js)

## 技术栈

- **框架**: Next.js 16 (App Router, RSC)
- **React**: 19 (含 React Compiler via babel-plugin-react-compiler)
- **UI 组件库**: Shadcn UI (new-york 风格, Radix UI 原语)
- **样式**: Tailwind CSS v4 + tw-animate-css
- **表单**: react-hook-form + zod (v4) + @hookform/resolvers
- **HTTP**: axios (封装于 `src/lib/axios.ts`)
- **国际化**: next-intl (zh-CN / en-US)
- **主题**: next-themes (light/dark/system)
- **通知**: sonner (Toast)
- **图标**: lucide-react
- **工具**: class-variance-authority, clsx, tailwind-merge

## 目录结构

```
frontend_admin/src/
├── app/
│   ├── [locale]/              # 国际化动态路由
│   │   ├── (auth)/            # 认证模块 (登录/注册) - 无需鉴权
│   │   ├── (platform)/        # 平台管理端 (admin)
│   │   ├── (dealer)/          # 经销商端 (dealer)
│   │   ├── (partner)/         # 合伙人端 (partner)
│   │   └── layout.tsx         # 根 Locale 布局 (含 ThemeProvider, NextIntlClientProvider)
│   └── globals.css            # 全局样式 (Tailwind v4)
├── components/
│   ├── ui/                    # Shadcn UI 组件 (Button, Card, Dialog, Input, Select, Table 等)
│   ├── layout/                # 布局组件 (Sidebar, Header)
│   ├── theme-provider.tsx     # 主题 Provider
│   ├── theme-toggle.tsx       # 主题切换
│   ├── language-toggle.tsx    # 语言切换
│   └── permission-guard.tsx   # 权限守卫组件
├── hooks/
│   └── use-request.ts         # 异步请求 Hook (loading/error/data 状态封装)
├── lib/
│   ├── axios.ts               # Axios 实例 (拦截器: Token 注入, 响应解包, 错误处理)
│   └── utils.ts               # cn() 工具函数 (clsx + tailwind-merge)
├── i18n/
│   └── request.ts             # next-intl 服务端配置
└── middleware.ts               # 路由中间件 (i18n locale 匹配)
```

## 编码规范

- **组件文件**: `PascalCase.tsx` (如 `UserProfile.tsx`)
- **Hook**: `use-camel-case.ts` (如 `use-request.ts`)
- **工具函数**: `camelCase.ts`
- **样式**: 优先使用 Tailwind Utility Classes，避免写自定义 CSS
- **组件定义**: 函数组件，使用 `function Component()` 或 `const Component = () =>`

## Shadcn UI 规范

- **配置**: `components.json` 定义 new-york 风格, CSS 变量模式, neutral 基色
- **路径别名**:
  - `@/components` → 组件
  - `@/components/ui` → UI 原子组件
  - `@/lib` → 工具库
  - `@/hooks` → Hooks
- **Table**: 必须包含分页、筛选、排序
- **Form**: 必须使用 react-hook-form + zod + Shadcn Form 组件
- **Dialog**: 弹窗必须支持 Esc 关闭

## API 交互模式

- 使用 `src/lib/axios.ts` 中的 `api` 实例发请求
- 拦截器自动: Token 注入 (localStorage)、响应解包 (data.data → data)、错误 Toast
- 组件中使用 `useRequest` Hook 封装异步请求状态
- baseURL: `http://localhost:8000/api/v1`

## 国际化 (i18n)

- 支持语言: `zh-CN` (默认), `en-US`
- 翻译文件: `messages/zh-CN.json`, `messages/en-US.json`
- 结构: 嵌套 JSON，按模块命名 (如 `Common.submit`, `Auth.loginTitle`)
- 路由: `[locale]` 动态段，middleware 自动匹配

## 主题色方案

- **Platform (平台管理)**: 默认 Zinc/Slate 主题
- **Dealer (经销商)**: 蓝色 Blue 主题
- **Partner (合伙人)**: 紫色 Violet 主题

## 权限控制

- 路由守卫: `middleware.ts` + `permission-guard.tsx`
- 角色路由: admin → `/admin/*`, dealer → `/dealer/*`, partner → `/partner/*`
- 组件复用: 业务组件通过 props 控制角色差异，放在 `components/business/`
