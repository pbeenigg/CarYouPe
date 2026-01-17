from typing import Any, List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import models, schemas, crud
from app.api import deps
from app.schemas.response import ResponseSuccess
from app.core.exceptions import CustomException

router = APIRouter()

@router.get("/", response_model=ResponseSuccess[List[schemas.Menu]])
def read_menus(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    获取菜单列表 (树形结构)
    Retrieve menus (Tree structure).
    """
    # We want the tree structure, so we fetch root menus.
    # The recursion is handled by Pydantic model and SQLAlchemy relationship.
    menus = crud.menu.get_root_menus(db)
    return ResponseSuccess(data=menus)

@router.post("/", response_model=ResponseSuccess[schemas.Menu])
def create_menu(
    *,
    db: Session = Depends(deps.get_db),
    menu_in: schemas.MenuCreate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    创建新菜单
    Create new menu.
    """
    if menu_in.parent_id:
        parent = crud.menu.get(db, id=menu_in.parent_id)
        if not parent:
             raise CustomException(
                code=400,
                message="Parent menu not found.", # 父菜单不存在
            )
            
    menu = crud.menu.create(db, obj_in=menu_in)
    return ResponseSuccess(data=menu)

@router.put("/{menu_id}", response_model=ResponseSuccess[schemas.Menu])
def update_menu(
    *,
    db: Session = Depends(deps.get_db),
    menu_id: int,
    menu_in: schemas.MenuUpdate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    更新菜单
    Update a menu.
    """
    menu = crud.menu.get(db, id=menu_id)
    if not menu:
        raise CustomException(
            code=404,
            message="The menu with this id does not exist in the system", # 该ID的菜单不存在
        )
    menu = crud.menu.update(db, db_obj=menu, obj_in=menu_in)
    return ResponseSuccess(data=menu)

@router.delete("/{menu_id}", response_model=ResponseSuccess[schemas.Menu])
def delete_menu(
    *,
    db: Session = Depends(deps.get_db),
    menu_id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    删除菜单
    Delete a menu.
    """
    menu = crud.menu.get(db, id=menu_id)
    if not menu:
        raise CustomException(
            code=404,
            message="The menu with this id does not exist in the system", # 该ID的菜单不存在
        )
    # Note: Logic for children deletion is handled by Database or should be added here if needed.
    menu = crud.menu.remove(db, id=menu_id)
    return ResponseSuccess(data=menu)
