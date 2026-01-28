# CarYou Pe - 汽车用品之家官网

> 一键匹配爱车的每个细节

## 项目简介

这是广州引领者汽车用品有限公司的品牌官网,采用现代化暗黑奢华设计风格,展示企业形象、产品系列和合作咨询入口。

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **图标**: Lucide React
- **邮件服务**: EmailJS

## 项目结构

```
website/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # 根布局
│   ├── page.tsx             # 首页
│   └── globals.css          # 全局样式
├── components/
│   ├── sections/            # 页面区块组件
│   │   ├── HeroSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── ProductsSection.tsx
│   │   ├── ShowcaseSection.tsx
│   │   ├── AboutSection.tsx
│   │   └── ContactSection.tsx
│   ├── ui/                  # UI 组件
│   │   ├── Navigation.tsx
│   │   └── Footer.tsx
│   └── animations/          # 动画组件
│       ├── FadeInView.tsx
│       └── ParallaxBanner.tsx
├── lib/
│   ├── types.ts             # TypeScript 类型定义
│   ├── data.ts              # 数据导出模块
│   └── email.ts             # EmailJS 集成
├── config/
│   └── site-data.json       # 网站内容配置
└── public/
    └── images/              # 图片资源
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 EmailJS (可选)

如果需要使用联系表单功能:

1. 在 [EmailJS](https://www.emailjs.com/) 注册账号
2. 创建邮件服务和模板
3. 复制 `.env.local.example` 为 `.env.local`
4. 填入您的 EmailJS 配置:

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看网站

## 构建部署

### 构建静态网站

```bash
npm run build
```

构建完成后,静态文件将生成在 `out` 目录。

### 部署到服务器

将 `out` 目录的内容上传到您的 Web 服务器即可。

推荐配置:
- 启用 GZIP 压缩
- 配置 CDN 加速
- 设置合理的缓存策略

## 内容管理

所有网站内容都在 `config/site-data.json` 中集中管理,包括:

- 品牌信息
- 导航菜单
- Hero Banner 内容
- 核心优势
- 产品列表
- 效果展示
- 关于我们
- 联系方式

修改该文件后重新构建即可更新网站内容。

## 设计特色

### 配色方案
- 主色调: 深空黑 (#0A0A0A, #1A1A1A)
- 强调色: 奢侈橙 (#DC2626, #F97316)
- 辅助色: 金属银 (#C0C0C0, #9CA3AF)

### 动画效果
- 视差滚动背景 (Hero Banner)
- 淡入动画 (模块进入视口)
- 悬停效果 (产品卡片、按钮)
- 平滑滚动 (锚点跳转)

### 响应式设计
- Mobile: < 640px (单列布局)
- Tablet: 640px - 1024px (双列布局)
- Desktop: > 1024px (三/四列布局)

## 开发命令

```bash
# 开发模式
npm run dev

# 类型检查
npm run build

# ESLint 检查
npm run lint
```

## 浏览器支持

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)

## 许可证

© 2024 广州引领者汽车用品有限公司 版权所有

## 联系方式

- 官网: [CarYou Pe](https://www.caryoupe.top)
- 邮箱: caryoup@163.com
- 电话: 400-xxx-xxxx
