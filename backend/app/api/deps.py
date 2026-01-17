from typing import Generator, Optional, List

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app import models, schemas, crud
from app.core import security
from app.core.config import settings
from app.db.session import SessionLocal
from app.core.exceptions import AuthException, PermissionException

# 定义 OAuth2 密码模式的 Token URL
reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/admin/auth/login/access-token"
)

def get_db() -> Generator:
    """
    获取数据库会话生成器。
    在每个请求中创建新的 Session，并在请求结束时关闭。
    """
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(reusable_oauth2)
) -> models.User:
    """
    从 Token 中解析并获取当前登录用户。
    如果 Token 无效或用户不存在/未激活，抛出 AuthException。
    """
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = schemas.TokenPayload(**payload)
    except (JWTError, ValidationError):
        raise AuthException(message="Could not validate credentials")
        
    user = crud.user.get(db, id=token_data.sub)
    if not user:
        raise AuthException(message="User not found")
    if not user.is_active:
        raise AuthException(message="Inactive user")
    return user

def get_current_active_superuser(
    current_user: models.User = Depends(get_current_user),
) -> models.User:
    """
    获取当前活跃的超级管理员用户。
    如果权限不足，抛出 PermissionException。
    """
    if not crud.user.is_superuser(current_user):
        raise PermissionException(message="The user doesn't have enough privileges")
    return current_user

def check_permission(permission: str):
    """
    依赖项工厂：检查当前用户是否拥有指定权限。
    
    使用闭包返回实际的依赖函数 _check_permission。
    支持通配符权限 '*'。
    
    Args:
        permission (str): 需要检查的权限标识符（如 'user:read'）
        
    Returns:
        Callable: FastAPI 依赖函数
    """
    def _check_permission(
        db: Session = Depends(get_db),
        current_user: models.User = Depends(get_current_user)
    ) -> models.User:
        # 超级管理员直接放行
        if crud.user.is_superuser(current_user):
            return current_user
            
        # 手动查询用户角色与权限（后续可优化为缓存或预加载）
        from app.models.role import UserRole, Role
        user_roles = db.query(UserRole).filter(UserRole.user_id == current_user.id).all()
        role_ids = [ur.role_id for ur in user_roles]
        roles = db.query(Role).filter(Role.id.in_(role_ids)).all()
        
        has_perm = False
        for role in roles:
            if role.permissions and ("*" in role.permissions or permission in role.permissions):
                has_perm = True
                break
        
        if not has_perm:
            raise PermissionException(message=f"Permission denied: {permission} required")
            
        return current_user
        
    return _check_permission
