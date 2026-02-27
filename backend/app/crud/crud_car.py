from typing import List, Optional
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.car import CarBrand, CarSeries, CarModel
from app.schemas.car import (
    CarBrandCreate, CarBrandUpdate,
    CarSeriesCreate, CarSeriesUpdate,
    CarModelCreate, CarModelUpdate,
)


class CRUDCarBrand(CRUDBase[CarBrand, CarBrandCreate, CarBrandUpdate]):
    """
    汽车品牌 CRUD 操作
    """
    def get_by_name(self, db: Session, *, name: str) -> Optional[CarBrand]:
        """根据名称查找品牌"""
        return db.query(CarBrand).filter(CarBrand.name == name).first()


class CRUDCarSeries(CRUDBase[CarSeries, CarSeriesCreate, CarSeriesUpdate]):
    """
    汽车车系 CRUD 操作
    """
    def get_by_brand(self, db: Session, *, brand_id: int, skip: int = 0, limit: int = 100) -> List[CarSeries]:
        """根据品牌ID获取车系列表"""
        return db.query(CarSeries).filter(CarSeries.brand_id == brand_id).offset(skip).limit(limit).all()


class CRUDCarModel(CRUDBase[CarModel, CarModelCreate, CarModelUpdate]):
    """
    汽车车型 CRUD 操作
    """
    def get_by_series(self, db: Session, *, series_id: int, skip: int = 0, limit: int = 100) -> List[CarModel]:
        """根据车系ID获取车型列表"""
        return db.query(CarModel).filter(CarModel.series_id == series_id).offset(skip).limit(limit).all()


car_brand = CRUDCarBrand(CarBrand)
car_series = CRUDCarSeries(CarSeries)
car_model = CRUDCarModel(CarModel)
