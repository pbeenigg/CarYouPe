from typing import Optional

from sqlalchemy.orm import Session

from app.core.security import get_password_hash, verify_password
from app.crud.base import CRUDBase
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate

class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    """
    用户 CRUD 操作
    """
    def get_by_username(self, db: Session, *, username: str) -> Optional[User]:
        """
        根据用户名获取用户
        """
        return db.query(User).filter(User.username == username).first()

    def create(self, db: Session, *, obj_in: UserCreate) -> User:
        """
        创建新用户 (自动处理密码哈希)
        """
        db_obj = User(
            username=obj_in.username,
            hashed_password=get_password_hash(obj_in.password),
            nickname=obj_in.nickname,
            is_superuser=obj_in.is_superuser,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def authenticate(self, db: Session, *, username: str, password: str) -> Optional[User]:
        """
        用户认证：验证用户名和密码
        """
        user = self.get_by_username(db, username=username)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    def is_superuser(self, user: User) -> bool:
        """
        检查用户是否为超级管理员
        """
        return user.is_superuser

user = CRUDUser(User)
