from typing import List, Optional
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.product import Product, ProductSKU, ProductCarCompatibility
from app.schemas.product import ProductCreate, ProductUpdate

class CRUDProduct(CRUDBase[Product, ProductCreate, ProductUpdate]):
    """
    商品 CRUD 操作
    """
    def create_with_skus(self, db: Session, *, obj_in: ProductCreate) -> Product:
        """
        创建商品及其关联的 SKU 和车型适配
        """
        obj_in_data = jsonable_encoder(obj_in)
        skus_data = obj_in_data.pop("skus", [])
        compat_data = obj_in_data.pop("car_compatibility", [])
        
        db_obj = Product(**obj_in_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        
        for sku in skus_data:
            sku_obj = ProductSKU(product_id=db_obj.id, **sku)
            db.add(sku_obj)
        
        for compat in compat_data:
            compat_obj = ProductCarCompatibility(product_id=db_obj.id, **compat)
            db.add(compat_obj)
        
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update_with_relations(self, db: Session, *, db_obj: Product, obj_in: ProductUpdate) -> Product:
        """
        更新商品及其关联的 SKU 和车型适配
        """
        obj_in_data = jsonable_encoder(obj_in)
        skus_data = obj_in_data.pop("skus", None)
        compat_data = obj_in_data.pop("car_compatibility", None)
        
        # 更新商品基本字段
        for field, value in obj_in_data.items():
            setattr(db_obj, field, value)
        
        # 更新 SKU (全量替换策略)
        if skus_data is not None:
            db.query(ProductSKU).filter(ProductSKU.product_id == db_obj.id).delete()
            for sku in skus_data:
                sku_obj = ProductSKU(product_id=db_obj.id, **sku)
                db.add(sku_obj)
        
        # 更新车型适配 (全量替换策略)
        if compat_data is not None:
            db.query(ProductCarCompatibility).filter(
                ProductCarCompatibility.product_id == db_obj.id
            ).delete()
            for compat in compat_data:
                compat_obj = ProductCarCompatibility(product_id=db_obj.id, **compat)
                db.add(compat_obj)
        
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

product = CRUDProduct(Product)
