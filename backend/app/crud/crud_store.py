from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.store import Store
from app.schemas.store import StoreCreate, StoreUpdate

class CRUDStore(CRUDBase[Store, StoreCreate, StoreUpdate]):
    """
    店铺/合伙人 CRUD 操作
    """
    def get_by_user(self, db: Session, *, user_id: int) -> Optional[Store]:
        """
        根据用户ID获取店铺
        """
        return db.query(self.model).filter(Store.user_id == user_id).first()

    def get_by_status(
        self, db: Session, *, status: int, skip: int = 0, limit: int = 100
    ) -> List[Store]:
        """
        按审核状态获取店铺列表
        """
        return (
            db.query(self.model)
            .filter(Store.status == status)
            .order_by(Store.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def audit(
        self, db: Session, *, store_id: int, status: int,
        reject_reason: Optional[str] = None,
        level: Optional[str] = None,
        commission_rate=None,
        remark: Optional[str] = None,
    ) -> Store:
        """
        审核店铺申请
        status: 1=通过, 2=拒绝
        """
        store = db.query(self.model).filter(Store.id == store_id).first()
        store.status = status
        if status == 1:
            store.approved_at = datetime.now()
            if level:
                store.level = level
            if commission_rate is not None:
                store.commission_rate = commission_rate
        if status == 2 and reject_reason:
            store.reject_reason = reject_reason
        if remark:
            store.remark = remark
        db.add(store)
        db.commit()
        db.refresh(store)
        return store

store = CRUDStore(Store)
