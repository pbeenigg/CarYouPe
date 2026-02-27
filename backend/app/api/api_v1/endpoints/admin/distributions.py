from typing import Any, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app import crud, models
from app.api import deps
from app.schemas.response import ResponseSuccess
from app.schemas.distribution import (
    DistributionRelation, DistributionRelationCreate,
    CommissionRecord, CommissionRecordCreate,
)
from app.core.exceptions import CustomException

router = APIRouter()

# ==================== 分销关系 ====================

@router.get("/relations", response_model=ResponseSuccess[List[DistributionRelation]])
def read_relations(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    parent_id: int = Query(None, description="按上级用户ID筛选"),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    获取分销关系列表，可按上级筛选
    Retrieve distribution relations. Optionally filter by parent.
    """
    if parent_id is not None:
        relations = crud.distribution_relation.get_by_parent(db, parent_id=parent_id, skip=skip, limit=limit)
    else:
        relations = crud.distribution_relation.get_multi(db, skip=skip, limit=limit)
    return ResponseSuccess(data=relations)


@router.get("/relations/{user_id}", response_model=ResponseSuccess[DistributionRelation])
def read_relation_by_user(
    *,
    db: Session = Depends(deps.get_db),
    user_id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    获取某用户的分销关系
    Get distribution relation by user ID.
    """
    relation = crud.distribution_relation.get_by_user(db, user_id=user_id)
    if not relation:
        raise CustomException(code=404, message="该用户无分销关系")
    return ResponseSuccess(data=relation)


@router.post("/relations/bind", response_model=ResponseSuccess[DistributionRelation])
def bind_relation(
    *,
    db: Session = Depends(deps.get_db),
    relation_in: DistributionRelationCreate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    绑定分销关系
    Bind a distribution relation between user and parent.
    """
    existing = crud.distribution_relation.get_by_user(db, user_id=relation_in.user_id)
    if existing:
        raise CustomException(code=400, message="该用户已绑定上级")
    if relation_in.user_id == relation_in.parent_id:
        raise CustomException(code=400, message="不能绑定自己为上级")
    relation = crud.distribution_relation.bind(
        db, user_id=relation_in.user_id, parent_id=relation_in.parent_id
    )
    return ResponseSuccess(data=relation)


@router.delete("/relations/{relation_id}", response_model=ResponseSuccess[DistributionRelation])
def delete_relation(
    *,
    db: Session = Depends(deps.get_db),
    relation_id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    删除分销关系
    Delete a distribution relation.
    """
    relation = crud.distribution_relation.get(db, id=relation_id)
    if not relation:
        raise CustomException(code=404, message="分销关系不存在")
    relation = crud.distribution_relation.remove(db, id=relation_id)
    return ResponseSuccess(data=relation)


# ==================== 佣金记录 ====================

@router.get("/commissions", response_model=ResponseSuccess[List[CommissionRecord]])
def read_commissions(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    status: int = Query(None, description="按状态筛选: 0待结算 1已结算 2已取消"),
    beneficiary_id: int = Query(None, description="按受益人ID筛选"),
    order_id: int = Query(None, description="按订单ID筛选"),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    获取佣金记录列表
    Retrieve commission records with optional filters.
    """
    if order_id is not None:
        records = crud.commission_record.get_by_order(db, order_id=order_id)
    elif beneficiary_id is not None:
        records = crud.commission_record.get_by_beneficiary(db, beneficiary_id=beneficiary_id, skip=skip, limit=limit)
    elif status is not None:
        records = crud.commission_record.get_by_status(db, status=status, skip=skip, limit=limit)
    else:
        records = crud.commission_record.get_multi(db, skip=skip, limit=limit)
    return ResponseSuccess(data=records)


@router.post("/commissions", response_model=ResponseSuccess[CommissionRecord])
def create_commission(
    *,
    db: Session = Depends(deps.get_db),
    commission_in: CommissionRecordCreate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    创建佣金记录
    Create a commission record.
    """
    record = crud.commission_record.create(db, obj_in=commission_in)
    return ResponseSuccess(data=record)


@router.get("/commissions/{commission_id}", response_model=ResponseSuccess[CommissionRecord])
def read_commission(
    *,
    db: Session = Depends(deps.get_db),
    commission_id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    获取单条佣金记录详情
    Get commission record by ID.
    """
    record = crud.commission_record.get(db, id=commission_id)
    if not record:
        raise CustomException(code=404, message="佣金记录不存在")
    return ResponseSuccess(data=record)


@router.post("/commissions/{commission_id}/settle", response_model=ResponseSuccess[CommissionRecord])
def settle_commission(
    *,
    db: Session = Depends(deps.get_db),
    commission_id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    结算佣金
    Settle a commission record.
    """
    record = crud.commission_record.get(db, id=commission_id)
    if not record:
        raise CustomException(code=404, message="佣金记录不存在")
    if record.status != 0:
        raise CustomException(code=400, message="只能结算待结算状态的佣金")
    record = crud.commission_record.settle(db, record_id=commission_id)
    return ResponseSuccess(data=record)


@router.post("/commissions/{commission_id}/cancel", response_model=ResponseSuccess[CommissionRecord])
def cancel_commission(
    *,
    db: Session = Depends(deps.get_db),
    commission_id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    取消佣金
    Cancel a commission record.
    """
    record = crud.commission_record.get(db, id=commission_id)
    if not record:
        raise CustomException(code=404, message="佣金记录不存在")
    if record.status != 0:
        raise CustomException(code=400, message="只能取消待结算状态的佣金")
    record = crud.commission_record.cancel(db, record_id=commission_id)
    return ResponseSuccess(data=record)


@router.delete("/commissions/{commission_id}", response_model=ResponseSuccess[CommissionRecord])
def delete_commission(
    *,
    db: Session = Depends(deps.get_db),
    commission_id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    删除佣金记录
    Delete a commission record.
    """
    record = crud.commission_record.get(db, id=commission_id)
    if not record:
        raise CustomException(code=404, message="佣金记录不存在")
    record = crud.commission_record.remove(db, id=commission_id)
    return ResponseSuccess(data=record)
