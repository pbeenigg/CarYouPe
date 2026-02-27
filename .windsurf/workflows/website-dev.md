---
description: 启动官网开发环境 (Start website dev server)
---

## 启动官网开发环境

1. 安装依赖
```bash
cd /Users/pbeenig/Work/CarYouPe/website
npm install
```

2. 启动 Next.js 开发服务器
```bash
cd /Users/pbeenig/Work/CarYouPe/website
npm run dev
```

3. 访问官网: http://localhost:3000

## 修改网站内容

- 产品/案例/公司信息: 编辑 `config/site-data.json`
- 主题颜色: 同时修改 `config/theme.ts` 和 `app/globals.css` 中的 CSS 变量
- 新增图片: 放入 `public/images/` 对应子目录

## 构建 Docker 镜像

```bash
cd /Users/pbeenig/Work/CarYouPe/website
docker build -t caryoupe-website:latest .
```
