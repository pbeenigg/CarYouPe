from typing import List, Optional
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.product import Product, ProductSKU
from app.schemas.product import ProductCreate, ProductUpdate

class CRUDProduct(CRUDBase[Product, ProductCreate, ProductUpdate]):
    """
    商品 CRUD 操作
    """
    def create_with_skus(self, db: Session, *, obj_in: ProductCreate) -> Product:
        """
        创建商品及其关联的 SKU
        """
        obj_in_data = jsonable_encoder(obj_in)
        skus_data = obj_in_data.pop("skus", [])
        
        db_obj = Product(**obj_in_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        
        for sku in skus_data:
            sku_obj = ProductSKU(product_id=db_obj.id, **sku)
            db.add(sku_obj)
        
        db.commit()
        db.refresh(db_obj)
        return db_obj

product = CRUDProduct(Product)
