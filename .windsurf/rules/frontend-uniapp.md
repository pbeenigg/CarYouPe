# 小程序端开发规则 (Frontend UniApp)

## 技术栈

- **框架**: Uni-App (Vue 3 Composition API)
- **样式**: SCSS (推荐 UnoCSS 或 Tailwind 兼容方案)
- **组件库**: uView Plus (Vue3) 或 Uni-UI
- **目标平台**: 微信小程序、抖音小程序、小红书小程序

## 目录结构

```
frontend_uniapp/
├── pages/              # 主包页面 (TabBar + 核心高频页)
├── pages_admin/        # 分包: 管理端功能
├── pages_marketing/    # 分包: 营销活动
├── static/             # 静态资源
│   ├── common/         # 通用资源
│   ├── mp-weixin/      # 微信专用资源
│   ├── mp-douyin/      # 抖音专用资源
│   └── mp-xhs/         # 小红书专用资源
├── uni_modules/        # 插件市场组件
├── utils/              # 工具类 (request.js, platform.js)
├── api/                # 接口定义
├── locale/             # 多语言资源
└── manifest.json       # 多端配置 (各平台 AppID)
```

## 多端适配规则

### 条件编译 (必须遵守)

**严禁**在业务逻辑中写死特定平台代码，必须使用条件编译：

```html
<!-- #ifdef MP-WEIXIN -->
<view>仅微信小程序可见</view>
<!-- #endif -->

<!-- #ifdef MP-TOUTIAO -->
<view>仅抖音小程序可见</view>
<!-- #endif -->
```

### 平台差异化

- **登录**: 各平台 `uni.login` 返回字段不同，在 `services/auth.js` 通过条件编译分别处理
- **支付**: 封装统一 `PaymentService`，内部条件编译处理微信/抖音差异
- **样式**: 统一使用 `rpx`，禁止 `px`；避免不兼容的 CSS 伪类，优先 Flex 布局

## API 交互

- 后端接口前缀: `/api/v1/client/*`
- 认证: Bearer Token (JWT)
- 可通过 UniCloud 作为 BFF 层中转，也可直连 FastAPI

## 分包策略

- 主包仅放 TabBar 页面和核心高频页，控制主包大小
- 功能模块按业务拆分到 `pages_admin/`, `pages_marketing/` 等分包
