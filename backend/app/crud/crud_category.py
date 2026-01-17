from typing import List
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.product import Category
from app.schemas.category import CategoryCreate, CategoryUpdate

class CRUDCategory(CRUDBase[Category, CategoryCreate, CategoryUpdate]):
    """
    分类 CRUD 操作
    """
    def get_root_categories(self, db: Session) -> List[Category]:
        """
        获取所有根分类 (没有父分类的分类)
        """
        return db.query(Category).filter(Category.parent_id == None).all()

category = CRUDCategory(Category)
