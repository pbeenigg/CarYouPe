"""
权限标识常量定义
Permission code constants for RBAC system.

格式: module:action
Format: module:action

在 Role.permissions JSON 列表中使用，例如:
["user:read", "user:write", "order:read"]
超级管理员自动拥有 "*" 全部权限。
"""

# ---- 用户管理 ----
USER_READ = "user:read"
USER_WRITE = "user:write"
USER_DELETE = "user:delete"

# ---- 角色管理 ----
ROLE_READ = "role:read"
ROLE_WRITE = "role:write"
ROLE_DELETE = "role:delete"

# ---- 菜单管理 ----
MENU_READ = "menu:read"
MENU_WRITE = "menu:write"
MENU_DELETE = "menu:delete"

# ---- 商品管理 ----
PRODUCT_READ = "product:read"
PRODUCT_WRITE = "product:write"
PRODUCT_DELETE = "product:delete"

# ---- 分类管理 ----
CATEGORY_READ = "category:read"
CATEGORY_WRITE = "category:write"
CATEGORY_DELETE = "category:delete"

# ---- 订单管理 ----
ORDER_READ = "order:read"
ORDER_WRITE = "order:write"
ORDER_DELETE = "order:delete"

# ---- 车型管理 ----
CAR_READ = "car:read"
CAR_WRITE = "car:write"
CAR_DELETE = "car:delete"

# ---- 地址管理 ----
ADDRESS_READ = "address:read"
ADDRESS_WRITE = "address:write"
ADDRESS_DELETE = "address:delete"

# ---- 店铺/合伙人管理 ----
STORE_READ = "store:read"
STORE_WRITE = "store:write"
STORE_AUDIT = "store:audit"
STORE_DELETE = "store:delete"

# ---- 分销管理 ----
DISTRIBUTION_READ = "distribution:read"
DISTRIBUTION_WRITE = "distribution:write"
DISTRIBUTION_DELETE = "distribution:delete"

# ---- 钱包/财务管理 ----
WALLET_READ = "wallet:read"
WALLET_WRITE = "wallet:write"

# ---- 仪表盘 ----
DASHBOARD_READ = "dashboard:read"


# 所有权限码汇总 (供前端权限配置页面使用)
ALL_PERMISSIONS = {
    "user": {"label": "用户管理", "codes": [USER_READ, USER_WRITE, USER_DELETE]},
    "role": {"label": "角色管理", "codes": [ROLE_READ, ROLE_WRITE, ROLE_DELETE]},
    "menu": {"label": "菜单管理", "codes": [MENU_READ, MENU_WRITE, MENU_DELETE]},
    "product": {"label": "商品管理", "codes": [PRODUCT_READ, PRODUCT_WRITE, PRODUCT_DELETE]},
    "category": {"label": "分类管理", "codes": [CATEGORY_READ, CATEGORY_WRITE, CATEGORY_DELETE]},
    "order": {"label": "订单管理", "codes": [ORDER_READ, ORDER_WRITE, ORDER_DELETE]},
    "car": {"label": "车型管理", "codes": [CAR_READ, CAR_WRITE, CAR_DELETE]},
    "address": {"label": "地址管理", "codes": [ADDRESS_READ, ADDRESS_WRITE, ADDRESS_DELETE]},
    "store": {"label": "店铺管理", "codes": [STORE_READ, STORE_WRITE, STORE_AUDIT, STORE_DELETE]},
    "distribution": {"label": "分销管理", "codes": [DISTRIBUTION_READ, DISTRIBUTION_WRITE, DISTRIBUTION_DELETE]},
    "wallet": {"label": "钱包管理", "codes": [WALLET_READ, WALLET_WRITE]},
    "dashboard": {"label": "仪表盘", "codes": [DASHBOARD_READ]},
}
