# API 接口定义文档 (API Definition)

## 1. 概述
本 API 基于 RESTful 风格设计，使用 JSON 作为数据交互格式。
- Base URL: `/api/v1`
- 认证方式: Bearer Token (JWT)

## 2. 接口列表

### 2.1 认证模块 (Auth)

*   `POST /auth/login/wechat`
    *   描述: 微信小程序授权登录
    *   参数: `code` (微信临时登录凭证)
    *   返回: `access_token`, `user_info`

*   `POST /auth/login/phone`
    *   描述: 手机号验证码登录
    *   参数: `phone`, `code`

*   `POST /auth/bind/phone`
    *   描述: 绑定手机号 (需登录)
    *   参数: `encryptedData`, `iv` (微信手机号解密参数)

### 2.2 用户模块 (User)

*   `GET /user/profile`
    *   描述: 获取个人信息 (含会员等级、角色身份)

*   `PUT /user/profile`
    *   描述: 更新个人资料 (昵称、头像)

*   `POST /user/apply/store`
    *   描述: 申请成为门店
    *   参数: `store_name`, `license_img`, `address`, `location`

*   `POST /user/apply/partner`
    *   描述: 申请成为合伙人
    *   参数: `region_code`, `type` (个人/企业)

### 2.3 商品与车型 (Product & Car)

*   `GET /cars/brands`
    *   描述: 获取汽车品牌列表

*   `GET /cars/series`
    *   描述: 获取车系列表
    *   参数: `brand_id`

*   `GET /cars/models`
    *   描述: 获取车型列表
    *   参数: `series_id`

*   `GET /products/categories`
    *   描述: 获取商品分类树

*   `GET /products`
    *   描述: 获取商品列表 (支持筛选)
    *   参数: `category_id`, `car_model_id` (核心筛选: 按车型), `sort`

*   `GET /products/{id}`
    *   描述: 获取商品详情 (含SKU信息)

### 2.4 订单模块 (Order)

*   `POST /orders`
    *   描述: 创建订单 (下单)
    *   参数: `items` ([{sku_id, count}]), `address_id`, `coupon_id`

*   `POST /orders/{id}/pay`
    *   描述: 发起支付
    *   参数: `pay_method` (wechat, points)
    *   返回: 支付参数 (如微信支付的 timeStamp, nonceStr 等)

*   `GET /orders`
    *   描述: 获取订单列表
    *   参数: `status`

### 2.5 分销与团队 (Distribution)

*   `GET /distribution/team`
    *   描述: 获取我的团队 (下级)
    *   参数: `level` (1级/2级)

*   `GET /distribution/commissions`
    *   描述: 获取分佣记录
    *   参数: `status`

*   `GET /distribution/poster`
    *   描述: 获取推广海报 (带参数二维码)

### 2.6 钱包模块 (Wallet)

*   `GET /wallet/balance`
    *   描述: 获取钱包余额与积分

*   `GET /wallet/transactions`
    *   描述: 获取资金/积分流水

*   `POST /wallet/withdraw`
    *   描述: 申请提现
    *   参数: `amount`

### 2.7 AI 预览 (AI Preview)

*   `POST /ai/preview/mat`
    *   描述: 生成脚垫预览图
    *   参数: `car_model_id`, `color_id`, `material_id`
    *   返回: `image_url`

## 3. 错误码规范
*   200: 成功
*   400: 参数错误
*   401: 未认证
*   403: 权限不足
*   500: 服务器内部错误
