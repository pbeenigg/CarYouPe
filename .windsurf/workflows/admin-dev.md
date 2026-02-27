---
description: 启动管理后台开发环境 (Start admin frontend dev server)
---

## 启动管理后台开发环境

1. 安装依赖
```bash
cd /Users/pbeenig/Work/CarYouPe/frontend_admin
npm install
```

2. 启动 Next.js 开发服务器
```bash
cd /Users/pbeenig/Work/CarYouPe/frontend_admin
npm run dev
```

3. 访问管理后台: http://localhost:3000

4. 确保后端 API 服务已运行在 http://localhost:8000 (管理后台依赖后端 API)

## 添加 Shadcn UI 组件

```bash
cd /Users/pbeenig/Work/CarYouPe/frontend_admin
npx shadcn@latest add <component-name>
```
