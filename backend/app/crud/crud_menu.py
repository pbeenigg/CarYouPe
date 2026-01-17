from typing import List

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.menu import Menu
from app.schemas.menu import MenuCreate, MenuUpdate

class CRUDMenu(CRUDBase[Menu, MenuCreate, MenuUpdate]):
    """
    菜单 CRUD 操作
    """
    def get_root_menus(self, db: Session) -> List[Menu]:
        """
        获取所有根菜单，并按 order 排序
        """
        return db.query(Menu).filter(Menu.parent_id == None).order_by(Menu.order).all()

menu = CRUDMenu(Menu)
