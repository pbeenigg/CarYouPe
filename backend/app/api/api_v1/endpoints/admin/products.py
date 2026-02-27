from typing import Any, List
from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app import models, schemas, crud
from app.api import deps
from app.schemas.response import ResponseSuccess
from app.core.exceptions import CustomException
from app.core.decorators import idempotent

router = APIRouter()

@router.get("/", response_model=ResponseSuccess[List[schemas.Product]])
def read_products(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    获取商品列表
    Retrieve products.
    """
    products = crud.product.get_multi(db, skip=skip, limit=limit)
    return ResponseSuccess(data=products)

@router.get("/{product_id}", response_model=ResponseSuccess[schemas.Product])
def read_product(
    *,
    db: Session = Depends(deps.get_db),
    product_id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    获取单个商品详情
    Retrieve a single product by ID.
    """
    product = crud.product.get(db, id=product_id)
    if not product:
        raise CustomException(
            code=404,
            message="The product with this id does not exist in the system",
        )
    return ResponseSuccess(data=product)

@router.post("/", response_model=ResponseSuccess[schemas.Product])
@idempotent(expire=60)
async def create_product(
    request: Request,
    *,
    db: Session = Depends(deps.get_db),
    product_in: schemas.ProductCreate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    创建新商品
    Create new product.
    """
    # Check if category exists
    category = crud.category.get(db, id=product_in.category_id)
    if not category:
        raise CustomException(
            code=400,
            message="Category not found", # 分类未找到
        )
        
    product = crud.product.create_with_skus(db, obj_in=product_in)
    return ResponseSuccess(data=product)

@router.put("/{product_id}", response_model=ResponseSuccess[schemas.Product])
def update_product(
    *,
    db: Session = Depends(deps.get_db),
    product_id: int,
    product_in: schemas.ProductUpdate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    更新商品
    Update a product.
    """
    product = crud.product.get(db, id=product_id)
    if not product:
        raise CustomException(
            code=404,
            message="The product with this id does not exist in the system", # 该ID的商品不存在
        )
    product = crud.product.update_with_relations(db, db_obj=product, obj_in=product_in)
    return ResponseSuccess(data=product)

@router.delete("/{product_id}", response_model=ResponseSuccess[schemas.Product])
def delete_product(
    *,
    db: Session = Depends(deps.get_db),
    product_id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    删除商品
    Delete a product.
    """
    product = crud.product.get(db, id=product_id)
    if not product:
        raise CustomException(
            code=404,
            message="The product with this id does not exist in the system", # 该ID的商品不存在
        )
    product = crud.product.remove(db, id=product_id)
    return ResponseSuccess(data=product)
