from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import models, schemas, crud
from app.api import deps
from app.schemas.response import ResponseSuccess
from app.core.exceptions import CustomException

router = APIRouter()


# ========== 品牌 (Brands) ==========

@router.get("/brands", response_model=ResponseSuccess[List[schemas.CarBrand]])
def read_brands(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 200,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    获取汽车品牌列表
    Retrieve car brands.
    """
    brands = crud.car_brand.get_multi(db, skip=skip, limit=limit)
    return ResponseSuccess(data=brands)

@router.post("/brands", response_model=ResponseSuccess[schemas.CarBrand])
def create_brand(
    *,
    db: Session = Depends(deps.get_db),
    brand_in: schemas.CarBrandCreate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    创建汽车品牌
    Create a car brand.
    """
    existing = crud.car_brand.get_by_name(db, name=brand_in.name)
    if existing:
        raise CustomException(code=400, message="该品牌名称已存在")
    brand = crud.car_brand.create(db, obj_in=brand_in)
    return ResponseSuccess(data=brand)

@router.put("/brands/{brand_id}", response_model=ResponseSuccess[schemas.CarBrand])
def update_brand(
    *,
    db: Session = Depends(deps.get_db),
    brand_id: int,
    brand_in: schemas.CarBrandUpdate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    更新汽车品牌
    Update a car brand.
    """
    brand = crud.car_brand.get(db, id=brand_id)
    if not brand:
        raise CustomException(code=404, message="品牌不存在")
    brand = crud.car_brand.update(db, db_obj=brand, obj_in=brand_in)
    return ResponseSuccess(data=brand)

@router.delete("/brands/{brand_id}", response_model=ResponseSuccess[schemas.CarBrand])
def delete_brand(
    *,
    db: Session = Depends(deps.get_db),
    brand_id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    删除汽车品牌
    Delete a car brand.
    """
    brand = crud.car_brand.get(db, id=brand_id)
    if not brand:
        raise CustomException(code=404, message="品牌不存在")
    brand = crud.car_brand.remove(db, id=brand_id)
    return ResponseSuccess(data=brand)


# ========== 车系 (Series) ==========

@router.get("/series", response_model=ResponseSuccess[List[schemas.CarSeries]])
def read_series(
    db: Session = Depends(deps.get_db),
    brand_id: int = None,
    skip: int = 0,
    limit: int = 200,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    获取车系列表 (可按品牌筛选)
    Retrieve car series, optionally filtered by brand.
    """
    if brand_id:
        series = crud.car_series.get_by_brand(db, brand_id=brand_id, skip=skip, limit=limit)
    else:
        series = crud.car_series.get_multi(db, skip=skip, limit=limit)
    return ResponseSuccess(data=series)

@router.post("/series", response_model=ResponseSuccess[schemas.CarSeries])
def create_series(
    *,
    db: Session = Depends(deps.get_db),
    series_in: schemas.CarSeriesCreate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    创建车系
    Create a car series.
    """
    # 检查品牌是否存在
    brand = crud.car_brand.get(db, id=series_in.brand_id)
    if not brand:
        raise CustomException(code=400, message="关联的品牌不存在")
    series = crud.car_series.create(db, obj_in=series_in)
    return ResponseSuccess(data=series)

@router.put("/series/{series_id}", response_model=ResponseSuccess[schemas.CarSeries])
def update_series(
    *,
    db: Session = Depends(deps.get_db),
    series_id: int,
    series_in: schemas.CarSeriesUpdate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    更新车系
    Update a car series.
    """
    series = crud.car_series.get(db, id=series_id)
    if not series:
        raise CustomException(code=404, message="车系不存在")
    series = crud.car_series.update(db, db_obj=series, obj_in=series_in)
    return ResponseSuccess(data=series)

@router.delete("/series/{series_id}", response_model=ResponseSuccess[schemas.CarSeries])
def delete_series(
    *,
    db: Session = Depends(deps.get_db),
    series_id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    删除车系
    Delete a car series.
    """
    series = crud.car_series.get(db, id=series_id)
    if not series:
        raise CustomException(code=404, message="车系不存在")
    series = crud.car_series.remove(db, id=series_id)
    return ResponseSuccess(data=series)


# ========== 车型 (Models) ==========

@router.get("/models", response_model=ResponseSuccess[List[schemas.CarModel]])
def read_models(
    db: Session = Depends(deps.get_db),
    series_id: int = None,
    skip: int = 0,
    limit: int = 200,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    获取车型列表 (可按车系筛选)
    Retrieve car models, optionally filtered by series.
    """
    if series_id:
        car_models = crud.car_model.get_by_series(db, series_id=series_id, skip=skip, limit=limit)
    else:
        car_models = crud.car_model.get_multi(db, skip=skip, limit=limit)
    return ResponseSuccess(data=car_models)

@router.post("/models", response_model=ResponseSuccess[schemas.CarModel])
def create_model(
    *,
    db: Session = Depends(deps.get_db),
    model_in: schemas.CarModelCreate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    创建车型
    Create a car model.
    """
    # 检查车系是否存在
    series = crud.car_series.get(db, id=model_in.series_id)
    if not series:
        raise CustomException(code=400, message="关联的车系不存在")
    car_model = crud.car_model.create(db, obj_in=model_in)
    return ResponseSuccess(data=car_model)

@router.put("/models/{model_id}", response_model=ResponseSuccess[schemas.CarModel])
def update_model(
    *,
    db: Session = Depends(deps.get_db),
    model_id: int,
    model_in: schemas.CarModelUpdate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    更新车型
    Update a car model.
    """
    car_model = crud.car_model.get(db, id=model_id)
    if not car_model:
        raise CustomException(code=404, message="车型不存在")
    car_model = crud.car_model.update(db, db_obj=car_model, obj_in=model_in)
    return ResponseSuccess(data=car_model)

@router.delete("/models/{model_id}", response_model=ResponseSuccess[schemas.CarModel])
def delete_model(
    *,
    db: Session = Depends(deps.get_db),
    model_id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    删除车型
    Delete a car model.
    """
    car_model = crud.car_model.get(db, id=model_id)
    if not car_model:
        raise CustomException(code=404, message="车型不存在")
    car_model = crud.car_model.remove(db, id=model_id)
    return ResponseSuccess(data=car_model)
