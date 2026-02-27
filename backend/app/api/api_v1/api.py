from fastapi import APIRouter
from app.api.api_v1.endpoints.admin import dashboard, auth as admin_auth, users as admin_users, products as admin_products, roles as admin_roles, menus as admin_menus, categories as admin_categories, orders as admin_orders, cars as admin_cars, addresses as admin_addresses, stores as admin_stores, distributions as admin_distributions, wallets as admin_wallets
from app.api.api_v1.endpoints.common import router as common_router
from app.api.api_v1.endpoints.client import home, auth as client_auth

api_router = APIRouter()

# Admin Routes (Prefix: /admin)
# 管理后台路由 (前缀: /admin)
api_router.include_router(dashboard.router, prefix="/admin/dashboard", tags=["admin"])
api_router.include_router(admin_auth.router, prefix="/admin/auth", tags=["admin-auth"])
api_router.include_router(admin_users.router, prefix="/admin/users", tags=["admin-users"])
api_router.include_router(admin_roles.router, prefix="/admin/roles", tags=["admin-roles"])
api_router.include_router(admin_menus.router, prefix="/admin/menus", tags=["admin-menus"])
api_router.include_router(admin_categories.router, prefix="/admin/categories", tags=["admin-categories"])
api_router.include_router(admin_products.router, prefix="/admin/products", tags=["admin-products"])
api_router.include_router(admin_orders.router, prefix="/admin/orders", tags=["admin-orders"])
api_router.include_router(admin_cars.router, prefix="/admin/cars", tags=["admin-cars"])
api_router.include_router(admin_addresses.router, prefix="/admin/addresses", tags=["admin-addresses"])
api_router.include_router(admin_stores.router, prefix="/admin/stores", tags=["admin-stores"])
api_router.include_router(admin_distributions.router, prefix="/admin/distributions", tags=["admin-distributions"])
api_router.include_router(admin_wallets.router, prefix="/admin/wallets", tags=["admin-wallets"])

# Client/Mini-Program Routes (Prefix: /client)
# 客户端/小程序路由 (前缀: /client)
api_router.include_router(home.router, prefix="/client/home", tags=["client"])
api_router.include_router(client_auth.router, prefix="/client/auth", tags=["client-auth"])

# Common Routes (if any)
# 通用路由
api_router.include_router(common_router, prefix="/common", tags=["common"])
