from typing import Any, List
from fastapi import APIRouter, Body, Depends, Request
from fastapi.encoders import jsonable_encoder
from pydantic.networks import EmailStr
from sqlalchemy.orm import Session

from app import models, schemas, crud
from app.api import deps
from app.schemas.response import ResponseSuccess
from app.core.exceptions import CustomException
from app.core.decorators import idempotent

router = APIRouter()

@router.get("/", response_model=ResponseSuccess[List[schemas.User]])
def read_users(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    获取用户列表
    Retrieve users.
    """
    users = crud.user.get_multi(db, skip=skip, limit=limit)
    return ResponseSuccess(data=users)

@router.post("/", response_model=ResponseSuccess[schemas.User])
@idempotent(expire=60)
async def create_user(
    request: Request,
    *,
    db: Session = Depends(deps.get_db),
    user_in: schemas.UserCreate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    创建新用户
    Create new user.
    """
    user = crud.user.get_by_username(db, username=user_in.username)
    if user:
        raise CustomException(
            code=400,
            message="The user with this username already exists in the system.", # 该用户名的用户已存在
        )
    user = crud.user.create(db, obj_in=user_in)
    return ResponseSuccess(data=user)

@router.get("/{user_id}", response_model=ResponseSuccess[schemas.User])
def read_user(
    *,
    db: Session = Depends(deps.get_db),
    user_id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    获取单个用户详情
    Retrieve a single user by ID.
    """
    user = crud.user.get(db, id=user_id)
    if not user:
        raise CustomException(
            code=404,
            message="The user with this id does not exist in the system",
        )
    return ResponseSuccess(data=user)

@router.put("/me", response_model=ResponseSuccess[schemas.User])
def update_user_me(
    *,
    db: Session = Depends(deps.get_db),
    password: str = Body(None),
    nickname: str = Body(None),
    real_name: str = Body(None),
    avatar_url: str = Body(None),
    phone: str = Body(None),
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    更新当前用户信息
    Update own user.
    """
    current_user_data = jsonable_encoder(current_user)
    user_in = schemas.UserUpdate(**current_user_data)
    if password:
        user_in.password = password
    if nickname:
        user_in.nickname = nickname
    if real_name:
        user_in.real_name = real_name
    if avatar_url:
        user_in.avatar_url = avatar_url
    if phone:
        user_in.phone = phone
        
    user = crud.user.update(db, db_obj=current_user, obj_in=user_in)
    return ResponseSuccess(data=user)

@router.delete("/{user_id}", response_model=ResponseSuccess[schemas.User])
def delete_user(
    *,
    db: Session = Depends(deps.get_db),
    user_id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    删除用户
    Delete a user.
    """
    user = crud.user.get(db, id=user_id)
    if not user:
        raise CustomException(
            code=404,
            message="The user with this id does not exist in the system",
        )
    if user.id == current_user.id:
        raise CustomException(
            code=400,
            message="Cannot delete yourself",
        )
    user = crud.user.remove(db, id=user_id)
    return ResponseSuccess(data=user)

@router.put("/{user_id}", response_model=ResponseSuccess[schemas.User])
def update_user(
    *,
    db: Session = Depends(deps.get_db),
    user_id: int,
    user_in: schemas.UserUpdate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    更新用户
    Update a user.
    """
    user = crud.user.get(db, id=user_id)
    if not user:
        raise CustomException(
            code=404,
            message="The user with this id does not exist in the system", # 该ID的用户不存在
        )
    user = crud.user.update(db, db_obj=user, obj_in=user_in)
    return ResponseSuccess(data=user)
