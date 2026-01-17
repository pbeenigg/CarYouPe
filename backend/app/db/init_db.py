from sqlalchemy.orm import Session

from app import crud, schemas
from app.core.config import settings
from app.db import base  # noqa: F401
from app.db.session import engine

# make sure all SQL Alchemy models are imported (app.db.base) before initializing DB
# otherwise, SQL Alchemy might fail to initialize relationships properly
# 确保在初始化数据库之前导入所有 SQL Alchemy 模型 (app.db.base)
# 否则，SQL Alchemy 可能无法正确初始化关系
# for more details: https://github.com/tiangolo/full-stack-fastapi-postgresql/issues/28

def init_db(db: Session) -> None:
    """
    初始化数据库
    创建表和初始数据 (角色, 菜单, 分类, 超级管理员)
    """
    # Tables should be created with Alembic migrations
    # 表应该使用 Alembic 迁移创建
    # But if you don't want to use migrations, create the tables un-commenting the next line
    # 但如果你不想使用迁移，取消注释下一行以创建表
    base.Base.metadata.create_all(bind=engine)

    # 1. Create Roles (创建角色)
    roles = [
        {"name": "superuser", "description": "Roles.desc.superuser", "permissions": ["*"]},
        {"name": "admin", "description": "Roles.desc.admin", "permissions": ["user:read", "product:read", "order:read"]},
        {"name": "operation", "description": "Roles.desc.operation", "permissions": ["product:write", "order:read"]},
        {"name": "logistics", "description": "Roles.desc.logistics", "permissions": ["order:read", "order:ship"]},
        {"name": "dealer", "description": "Roles.desc.dealer", "permissions": ["product:read", "order:create"]},
        {"name": "agent", "description": "Roles.desc.agent", "permissions": ["dealer:read", "commission:read"]},
    ]
    
    for role_in in roles:
        role = crud.role.get_by_name(db, name=role_in["name"])
        if not role:
            role_create = schemas.RoleCreate(**role_in)
            crud.role.create(db, obj_in=role_create)

    # 2. Create Menus (创建菜单)
    menus = [
        {"title": "Sidebar.dashboard", "path": "/admin/dashboard", "icon": "LayoutDashboard", "order": 1, "children": []},
        {"title": "Sidebar.system", "path": "/admin/system", "icon": "Settings", "order": 99, "children": [
            {"title": "Sidebar.users", "path": "/admin/users", "icon": "Users", "order": 1},
            {"title": "Sidebar.roles", "path": "/admin/roles", "icon": "ShieldCheck", "order": 2},
            {"title": "Sidebar.menus", "path": "/admin/menus", "icon": "Menu", "order": 3},
        ]},
        {"title": "Sidebar.products", "path": "/admin/products", "icon": "Package", "order": 2, "children": []},
        {"title": "Sidebar.orders", "path": "/admin/orders", "icon": "ShoppingCart", "order": 3, "children": []},
    ]

    for menu_in in menus:
        # Check if menu exists by path (simplified)
        # 简单检查菜单是否存在
        # In real app, might need better check
        existing_menu = db.query(crud.menu.model).filter(crud.menu.model.path == menu_in["path"]).first()
        if not existing_menu:
            children = menu_in.pop("children", [])
            menu_create = schemas.MenuCreate(**menu_in)
            created_menu = crud.menu.create(db, obj_in=menu_create)
            
            for child in children:
                child["parent_id"] = created_menu.id
                child_create = schemas.MenuCreate(**child)
                crud.menu.create(db, obj_in=child_create)

    # 3. Create Categories (创建分类)
    categories = [
        {"name": "Car Mats", "children": []},
        {"name": "Seat Covers", "children": []},
        {"name": "Electronics", "children": []},
    ]
    
    for cat_in in categories:
        existing_cat = crud.category.get_root_categories(db)
        # Simple check by name not efficient for list, but fine for init
        if not any(c.name == cat_in["name"] for c in existing_cat):
            cat_create = schemas.CategoryCreate(name=cat_in["name"])
            crud.category.create(db, obj_in=cat_create)

    # 4. Create Superuser (创建超级管理员)
    user = crud.user.get_by_username(db, username="admin")
    if not user:
        user_in = schemas.UserCreate(
            username="admin",
            password="admin", # Change this in production! # 生产环境请修改！
            is_superuser=True,
            nickname="Super Admin",
        )
        user = crud.user.create(db, obj_in=user_in)
        
        # Assign superuser role
        # 分配超级管理员角色
        # We need a way to assign role. Since we don't have a direct CRUD for UserRole yet,
        # we can do it via relationship if setup, or manually.
        # Let's assume User model has roles relationship or we add to user_role table.
        # For now, let's create the UserRole entry directly if model supports it.
        # But wait, UserRole model exists in app.models.role.
        
        superuser_role = crud.role.get_by_name(db, name="superuser")
        if superuser_role:
             from app.models.role import UserRole
             user_role = UserRole(user_id=user.id, role_id=superuser_role.id)
             db.add(user_role)
             db.commit()
