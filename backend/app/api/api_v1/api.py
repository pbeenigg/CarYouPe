from fastapi import APIRouter
from app.api.api_v1.endpoints.admin import dashboard
from app.api.api_v1.endpoints.client import home

api_router = APIRouter()

# Admin Routes (Prefix: /admin)
api_router.include_router(dashboard.router, prefix="/admin/dashboard", tags=["admin"])

# Client/Mini-Program Routes (Prefix: /client)
api_router.include_router(home.router, prefix="/client/home", tags=["client"])

# Common Routes (if any)
# api_router.include_router(common.router, prefix="/common", tags=["common"])
