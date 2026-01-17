from typing import List, Optional
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.order import Order, OrderItem
from app.schemas.order import OrderCreate, OrderUpdate
import uuid

class CRUDOrder(CRUDBase[Order, OrderCreate, OrderUpdate]):
    """
    订单 CRUD 操作
    """
    def create_with_owner(
        self, db: Session, *, obj_in: OrderCreate, user_id: int
    ) -> Order:
        """
        创建属于特定用户的订单，同时创建订单项
        """
        obj_in_data = jsonable_encoder(obj_in)
        items_data = obj_in_data.pop("items")
        
        # Generate Order No (生成唯一订单号)
        order_no = str(uuid.uuid4()).replace("-", "").upper()[:16]
        
        db_obj = Order(
            **obj_in_data, 
            user_id=user_id,
            order_no=order_no
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        
        for item in items_data:
            db_item = OrderItem(**item, order_id=db_obj.id)
            db.add(db_item)
        
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_by_user(
        self, db: Session, *, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[Order]:
        """
        获取指定用户的订单列表
        """
        return (
            db.query(self.model)
            .filter(Order.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

order = CRUDOrder(Order)
