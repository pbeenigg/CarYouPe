from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.api import deps
from app.schemas.response import ResponseSuccess
from app.core.exceptions import CustomException

router = APIRouter()

@router.get("/", response_model=ResponseSuccess[List[schemas.Order]])
def read_orders(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    获取订单列表
    Retrieve orders.
    """
    orders = crud.order.get_multi(db, skip=skip, limit=limit)
    return ResponseSuccess(data=orders)

@router.get("/{id}", response_model=ResponseSuccess[schemas.Order])
def read_order(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    根据ID获取订单
    Get order by ID.
    """
    order = crud.order.get(db=db, id=id)
    if not order:
        raise CustomException(code=404, message="Order not found") # 订单未找到
    return ResponseSuccess(data=order)

@router.put("/{id}", response_model=ResponseSuccess[schemas.Order])
def update_order(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    order_in: schemas.OrderUpdate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    更新订单
    Update an order.
    """
    order = crud.order.get(db=db, id=id)
    if not order:
        raise CustomException(code=404, message="Order not found") # 订单未找到
    order = crud.order.update(db=db, db_obj=order, obj_in=order_in)
    return ResponseSuccess(data=order)
