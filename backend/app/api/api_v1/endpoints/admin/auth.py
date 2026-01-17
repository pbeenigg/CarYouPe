from datetime import timedelta
from typing import Any, List

from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app import schemas, models, crud
from app.core import security
from app.api import deps
from app.core.config import settings
from app.schemas.response import ResponseSuccess
from app.core.exceptions import CustomException, AuthException

router = APIRouter()

class UserInfoResponse(BaseModel):
    user: schemas.User
    roles: List[str]
    permissions: List[str]
    menus: List[schemas.Menu]

@router.post("/login/access-token", response_model=ResponseSuccess[schemas.Token])
def login_access_token(
    db: Session = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 兼容的 Token 登录，获取访问令牌
    OAuth2 compatible token login, get an access token for future requests
    """
    user = crud.user.authenticate(
        db, username=form_data.username, password=form_data.password
    )
    if not user:
        raise AuthException(message="Incorrect username or password") # 用户名或密码错误
    elif not user.is_active:
        raise AuthException(message="Inactive user") # 用户未激活
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return ResponseSuccess(data={
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    })

@router.get("/info", response_model=ResponseSuccess[UserInfoResponse])
def get_user_info(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    获取当前用户信息、角色、权限和菜单
    Get current user info, roles, permissions and menus
    """
    # 1. 获取角色 (Get Roles)
    # Since we don't have explicit User-Role relation in models yet (UserRole is separate table but not linked in ORM properly maybe),
    # we need to query UserRole.
    # Wait, in models/role.py UserRole is defined. But User model doesn't have `roles` relationship.
    # For now, let's query UserRole manually.
    from app.models.role import UserRole, Role
    
    user_roles_links = db.query(UserRole).filter(UserRole.user_id == current_user.id).all()
    role_ids = [ur.role_id for ur in user_roles_links]
    roles = db.query(Role).filter(Role.id.in_(role_ids)).all()
    
    role_names = [r.name for r in roles]
    permissions = []
    for r in roles:
        if r.permissions:
            if "*" in r.permissions:
                permissions = ["*"]
                break
            permissions.extend(r.permissions)
    
    # 2. 获取菜单 (Get Menus)
    # If superuser or has "*", return all menus.
    # Otherwise, filter based on permissions? 
    # For now, let's return all menus for everyone as requested "initialization".
    # Real implementation would filter by role-menu assignment.
    
    all_menus = crud.menu.get_root_menus(db)
    # Recursively fetch children is handled by relationship in model + schema, 
    # but crud.menu.get_root_menus only fetches roots.
    # If `lazy='joined'` was set, it would be fine. 
    # `Menu` model: `parent = relationship("Menu", remote_side=[id], backref="children")`
    # Default is lazy=select. So accessing .children will trigger query. Pydantic will handle it if `from_attributes=True`.
    
    return ResponseSuccess(data={
        "user": current_user,
        "roles": role_names,
        "permissions": list(set(permissions)),
        "menus": all_menus
    })

@router.post("/logout", response_model=ResponseSuccess)
def logout():
    """
    退出登录 (前端应丢弃 Token)
    Logout (frontend should discard token)
    """
    return ResponseSuccess(message="Successfully logged out")
