from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.api import deps
from app.schemas.response import ResponseSuccess
from app.core.exceptions import CustomException

router = APIRouter()

@router.get("/", response_model=ResponseSuccess[List[schemas.Address]])
def read_addresses(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    user_id: int = None,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    获取地址列表，可按用户ID筛选
    Retrieve addresses. Optionally filter by user_id.
    """
    if user_id:
        addresses = crud.address.get_by_user(db, user_id=user_id, skip=skip, limit=limit)
    else:
        addresses = crud.address.get_multi(db, skip=skip, limit=limit)
    return ResponseSuccess(data=addresses)

@router.post("/", response_model=ResponseSuccess[schemas.Address])
def create_address(
    *,
    db: Session = Depends(deps.get_db),
    address_in: schemas.AddressCreate,
    user_id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    为指定用户创建地址
    Create address for a specific user.
    """
    from fastapi.encoders import jsonable_encoder
    obj_data = jsonable_encoder(address_in)
    from app.models.address import Address as AddressModel
    db_obj = AddressModel(**obj_data, user_id=user_id)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return ResponseSuccess(data=db_obj)

@router.get("/{address_id}", response_model=ResponseSuccess[schemas.Address])
def read_address(
    *,
    db: Session = Depends(deps.get_db),
    address_id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    获取单个地址
    Get address by ID.
    """
    address = crud.address.get(db, id=address_id)
    if not address:
        raise CustomException(code=404, message="Address not found")
    return ResponseSuccess(data=address)

@router.put("/{address_id}", response_model=ResponseSuccess[schemas.Address])
def update_address(
    *,
    db: Session = Depends(deps.get_db),
    address_id: int,
    address_in: schemas.AddressUpdate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    更新地址
    Update an address.
    """
    address = crud.address.get(db, id=address_id)
    if not address:
        raise CustomException(code=404, message="Address not found")
    address = crud.address.update(db, db_obj=address, obj_in=address_in)
    return ResponseSuccess(data=address)

@router.delete("/{address_id}", response_model=ResponseSuccess[schemas.Address])
def delete_address(
    *,
    db: Session = Depends(deps.get_db),
    address_id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    删除地址
    Delete an address.
    """
    address = crud.address.get(db, id=address_id)
    if not address:
        raise CustomException(code=404, message="Address not found")
    address = crud.address.remove(db, id=address_id)
    return ResponseSuccess(data=address)
