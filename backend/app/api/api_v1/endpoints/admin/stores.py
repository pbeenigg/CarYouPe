from typing import Any, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.api import deps
from app.schemas.response import ResponseSuccess
from app.schemas.store import StoreAudit
from app.core.exceptions import CustomException

router = APIRouter()

@router.get("/", response_model=ResponseSuccess[List[schemas.Store]])
def read_stores(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    status: int = Query(None, description="按状态筛选: 0待审核 1已通过 2已拒绝 3已禁用"),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    获取店铺/合伙人列表，可按状态筛选
    Retrieve stores. Optionally filter by status.
    """
    if status is not None:
        stores = crud.store.get_by_status(db, status=status, skip=skip, limit=limit)
    else:
        stores = crud.store.get_multi(db, skip=skip, limit=limit)
    return ResponseSuccess(data=stores)

@router.post("/", response_model=ResponseSuccess[schemas.Store])
def create_store(
    *,
    db: Session = Depends(deps.get_db),
    store_in: schemas.StoreCreate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    创建店铺/合伙人申请
    Create a store/partner application.
    """
    existing = crud.store.get_by_user(db, user_id=store_in.user_id)
    if existing:
        raise CustomException(code=400, message="该用户已有店铺申请")
    store = crud.store.create(db, obj_in=store_in)
    return ResponseSuccess(data=store)

@router.get("/{store_id}", response_model=ResponseSuccess[schemas.Store])
def read_store(
    *,
    db: Session = Depends(deps.get_db),
    store_id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    获取单个店铺详情
    Get store by ID.
    """
    store = crud.store.get(db, id=store_id)
    if not store:
        raise CustomException(code=404, message="Store not found")
    return ResponseSuccess(data=store)

@router.put("/{store_id}", response_model=ResponseSuccess[schemas.Store])
def update_store(
    *,
    db: Session = Depends(deps.get_db),
    store_id: int,
    store_in: schemas.StoreUpdate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    更新店铺信息
    Update a store.
    """
    store = crud.store.get(db, id=store_id)
    if not store:
        raise CustomException(code=404, message="Store not found")
    store = crud.store.update(db, db_obj=store, obj_in=store_in)
    return ResponseSuccess(data=store)

@router.post("/{store_id}/audit", response_model=ResponseSuccess[schemas.Store])
def audit_store(
    *,
    db: Session = Depends(deps.get_db),
    store_id: int,
    audit_in: StoreAudit,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    审核店铺申请
    Audit a store application. status: 1=approve, 2=reject.
    """
    store = crud.store.get(db, id=store_id)
    if not store:
        raise CustomException(code=404, message="Store not found")
    if store.status != 0:
        raise CustomException(code=400, message="只能审核待审核状态的申请")
    store = crud.store.audit(
        db,
        store_id=store_id,
        status=audit_in.status,
        reject_reason=audit_in.reject_reason,
        level=audit_in.level,
        commission_rate=audit_in.commission_rate,
        remark=audit_in.remark,
    )
    return ResponseSuccess(data=store)

@router.delete("/{store_id}", response_model=ResponseSuccess[schemas.Store])
def delete_store(
    *,
    db: Session = Depends(deps.get_db),
    store_id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    删除店铺
    Delete a store.
    """
    store = crud.store.get(db, id=store_id)
    if not store:
        raise CustomException(code=404, message="Store not found")
    store = crud.store.remove(db, id=store_id)
    return ResponseSuccess(data=store)
