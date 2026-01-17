from typing import Any, List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import models, schemas, crud
from app.api import deps
from app.schemas.response import ResponseSuccess
from app.core.exceptions import CustomException

router = APIRouter()

@router.get("/", response_model=ResponseSuccess[List[schemas.Role]])
def read_roles(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    获取角色列表
    Retrieve roles.
    """
    roles = crud.role.get_multi(db, skip=skip, limit=limit)
    return ResponseSuccess(data=roles)

@router.post("/", response_model=ResponseSuccess[schemas.Role])
def create_role(
    *,
    db: Session = Depends(deps.get_db),
    role_in: schemas.RoleCreate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    创建新角色
    Create new role.
    """
    role = crud.role.get_by_name(db, name=role_in.name)
    if role:
        raise CustomException(
            code=400,
            message="The role with this name already exists in the system.", # 该名称的角色已存在
        )
    role = crud.role.create(db, obj_in=role_in)
    return ResponseSuccess(data=role)

@router.put("/{role_id}", response_model=ResponseSuccess[schemas.Role])
def update_role(
    *,
    db: Session = Depends(deps.get_db),
    role_id: int,
    role_in: schemas.RoleUpdate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    更新角色
    Update a role.
    """
    role = crud.role.get(db, id=role_id)
    if not role:
        raise CustomException(
            code=404,
            message="The role with this id does not exist in the system", # 该ID的角色不存在
        )
    role = crud.role.update(db, db_obj=role, obj_in=role_in)
    return ResponseSuccess(data=role)

@router.delete("/{role_id}", response_model=ResponseSuccess[schemas.Role])
def delete_role(
    *,
    db: Session = Depends(deps.get_db),
    role_id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    删除角色
    Delete a role.
    """
    role = crud.role.get(db, id=role_id)
    if not role:
        raise CustomException(
            code=404,
            message="The role with this id does not exist in the system", # 该ID的角色不存在
        )
    role = crud.role.remove(db, id=role_id)
    return ResponseSuccess(data=role)
