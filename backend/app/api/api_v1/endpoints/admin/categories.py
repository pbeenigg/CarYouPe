from typing import Any, List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import models, schemas, crud
from app.api import deps
from app.schemas.response import ResponseSuccess
from app.core.exceptions import CustomException

router = APIRouter()

@router.get("/", response_model=ResponseSuccess[List[schemas.Category]])
def read_categories(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    获取分类列表 (树形结构)
    Retrieve categories (Tree).
    """
    # Assuming we want tree structure, Pydantic handles recursion if relationship is set up
    # In models/product.py, Category has parent_id but no explicit children relationship defined?
    # Let's check models/product.py again.
    # It has parent_id. We need to add relationship for children to work with Pydantic recursion.
    categories = crud.category.get_root_categories(db)
    return ResponseSuccess(data=categories)

@router.post("/", response_model=ResponseSuccess[schemas.Category])
def create_category(
    *,
    db: Session = Depends(deps.get_db),
    category_in: schemas.CategoryCreate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    创建新分类
    Create new category.
    """
    category = crud.category.create(db, obj_in=category_in)
    return ResponseSuccess(data=category)

@router.put("/{category_id}", response_model=ResponseSuccess[schemas.Category])
def update_category(
    *,
    db: Session = Depends(deps.get_db),
    category_id: int,
    category_in: schemas.CategoryUpdate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    更新分类
    Update a category.
    """
    category = crud.category.get(db, id=category_id)
    if not category:
        raise CustomException(
            code=404,
            message="The category with this id does not exist in the system", # 该ID的分类不存在
        )
    category = crud.category.update(db, db_obj=category, obj_in=category_in)
    return ResponseSuccess(data=category)

@router.delete("/{category_id}", response_model=ResponseSuccess[schemas.Category])
def delete_category(
    *,
    db: Session = Depends(deps.get_db),
    category_id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    删除分类
    Delete a category.
    """
    category = crud.category.get(db, id=category_id)
    if not category:
        raise CustomException(
            code=404,
            message="The category with this id does not exist in the system", # 该ID的分类不存在
        )
    category = crud.category.remove(db, id=category_id)
    return ResponseSuccess(data=category)
