from typing import List, Optional
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.distribution import DistributionRelation, CommissionRecord
from app.schemas.distribution import (
    DistributionRelationCreate, DistributionRelationUpdate,
    CommissionRecordCreate, CommissionRecordUpdate,
)


class CRUDDistributionRelation(CRUDBase[DistributionRelation, DistributionRelationCreate, DistributionRelationUpdate]):
    """
    分销关系 CRUD
    """
    def get_by_user(self, db: Session, *, user_id: int) -> Optional[DistributionRelation]:
        """根据用户ID获取分销关系"""
        return db.query(self.model).filter(DistributionRelation.user_id == user_id).first()

    def get_by_parent(self, db: Session, *, parent_id: int, skip: int = 0, limit: int = 100) -> List[DistributionRelation]:
        """获取某上级的所有下级"""
        return (
            db.query(self.model)
            .filter(DistributionRelation.parent_id == parent_id)
            .offset(skip).limit(limit).all()
        )

    def bind(self, db: Session, *, user_id: int, parent_id: int) -> DistributionRelation:
        """
        绑定分销关系，自动生成 path
        """
        # 查找父级的 path 以构造当前用户的 path
        parent_rel = self.get_by_user(db, user_id=parent_id)
        if parent_rel and parent_rel.path:
            path = f"{parent_rel.path}{parent_id}/"
        else:
            path = f"/{parent_id}/"

        db_obj = DistributionRelation(
            user_id=user_id,
            parent_id=parent_id,
            path=path,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


class CRUDCommissionRecord(CRUDBase[CommissionRecord, CommissionRecordCreate, CommissionRecordUpdate]):
    """
    佣金记录 CRUD
    """
    def get_by_beneficiary(self, db: Session, *, beneficiary_id: int, skip: int = 0, limit: int = 100) -> List[CommissionRecord]:
        """获取某用户的佣金记录"""
        return (
            db.query(self.model)
            .filter(CommissionRecord.beneficiary_id == beneficiary_id)
            .order_by(CommissionRecord.created_at.desc())
            .offset(skip).limit(limit).all()
        )

    def get_by_order(self, db: Session, *, order_id: int) -> List[CommissionRecord]:
        """获取某订单的佣金记录"""
        return db.query(self.model).filter(CommissionRecord.order_id == order_id).all()

    def get_by_status(self, db: Session, *, status: int, skip: int = 0, limit: int = 100) -> List[CommissionRecord]:
        """按状态获取佣金记录"""
        return (
            db.query(self.model)
            .filter(CommissionRecord.status == status)
            .order_by(CommissionRecord.created_at.desc())
            .offset(skip).limit(limit).all()
        )

    def settle(self, db: Session, *, record_id: int) -> CommissionRecord:
        """结算佣金"""
        record = db.query(self.model).filter(CommissionRecord.id == record_id).first()
        if record:
            record.status = 1  # 已结算
            db.add(record)
            db.commit()
            db.refresh(record)
        return record

    def cancel(self, db: Session, *, record_id: int) -> CommissionRecord:
        """取消佣金"""
        record = db.query(self.model).filter(CommissionRecord.id == record_id).first()
        if record:
            record.status = 2  # 已取消
            db.add(record)
            db.commit()
            db.refresh(record)
        return record


distribution_relation = CRUDDistributionRelation(DistributionRelation)
commission_record = CRUDCommissionRecord(CommissionRecord)
