from typing import Optional

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.role import Role
from app.schemas.role import RoleCreate, RoleUpdate

class CRUDRole(CRUDBase[Role, RoleCreate, RoleUpdate]):
    """
    角色 CRUD 操作
    """
    def get_by_name(self, db: Session, *, name: str) -> Optional[Role]:
        """
        根据名称获取角色
        """
        return db.query(Role).filter(Role.name == name).first()

role = CRUDRole(Role)
