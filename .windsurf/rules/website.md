# 官网展示站开发规则 (Website - Next.js)

## 技术栈

- **框架**: Next.js 14.2 (App Router, standalone 输出模式)
- **React**: 18
- **样式**: Tailwind CSS v3.4
- **动画**: Framer Motion 12
- **图标**: lucide-react
- **邮件**: @emailjs/browser + nodemailer
- **TypeScript**: 严格模式

## 目录结构

```
website/
├── app/
│   ├── api/               # API Routes (如联系表单邮件发送)
│   ├── fonts/             # 自定义字体
│   ├── layout.tsx         # 根布局 (lang="zh-CN", SEO metadata)
│   ├── page.tsx           # 首页 (单页面应用，锚点导航)
│   └── globals.css        # 全局样式 + CSS 变量 + Tailwind 工具类
├── components/
│   ├── sections/          # 页面区块 (Hero, Features, Products, Showcase, About, Contact)
│   ├── animations/        # 动画组件 (Framer Motion 封装)
│   └── ui/                # UI 组件 (Navigation, Footer)
├── config/
│   ├── site-data.json     # 站点数据 (产品、案例、公司信息 - JSON 驱动)
│   └── theme.ts           # 主题配置 (颜色、渐变、阴影、动画)
└── public/
    └── images/            # 静态图片资源
```

## 设计风格

- **主题**: 深色科技感（深空黑底 #0A0A0A + 爱马仕红强调色 #DC143C）
- **品牌色**: 
  - 主色: `#DC143C` (爱马仕红)
  - 亮色: `#FF1744`
  - 光晕: `#FF0000`
  - 明亮: `#FF5252`
- **背景**: 渐变深黑 (`#0A0A0A` → `#1A1A1A`)
- **文字**: 白色主文字 + `#9CA3AF` 次要 + `#6B7280` 三级
- **卡片**: 毛玻璃效果 (glass-card), hover 上浮动画 (hover-lift)
- **字体**: PingFang SC 为主, -apple-system 回退

## CSS 变量体系

所有颜色通过 CSS 变量定义于 `globals.css` 的 `:root`，同时在 `config/theme.ts` 中导出 JS 常量。
修改主题色时需**同时更新两处**。

## 数据驱动

- 产品、案例、公司信息等内容全部集中在 `config/site-data.json`
- 组件从 JSON 读取数据渲染，修改内容只需改 JSON 文件
- 新增产品/案例: 在 JSON 中添加条目 + 对应图片放入 `public/images/`

## 动画规范

- 使用 Framer Motion 实现滚动进入、悬浮等动画
- 动画组件封装在 `components/animations/`
- 预定义工具类: `.hover-lift`, `.glass-card`, `.gradient-text`, `.btn-primary`, `.btn-secondary`

## 部署

- **Docker**: 多阶段构建 (deps → builder → runner), standalone 模式
- **容器**: `caryoupe-website`, 暴露 3000 端口
- **反向代理**: Caddy (通过 infra 网络)
- **构建**: `npm run build` → `node server.js`

## SEO

- 完整 Metadata (title, description, keywords, openGraph)
- 语义化 HTML 结构
- `lang="zh-CN"`
