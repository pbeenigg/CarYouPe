from typing import Optional, List
from pydantic import BaseModel


# ========== 汽车品牌 (Car Brand) ==========
class CarBrandBase(BaseModel):
    """
    汽车品牌基础模型
    """
    name: str           # 品牌名称
    logo: Optional[str] = None  # 品牌Logo URL

class CarBrandCreate(CarBrandBase):
    """创建品牌"""
    pass

class CarBrandUpdate(CarBrandBase):
    """更新品牌"""
    pass

class CarBrand(CarBrandBase):
    """API 返回的品牌模型"""
    id: int
    class Config:
        from_attributes = True


# ========== 汽车车系 (Car Series) ==========
class CarSeriesBase(BaseModel):
    """
    汽车车系基础模型
    """
    name: str           # 车系名称
    brand_id: int       # 关联品牌ID

class CarSeriesCreate(CarSeriesBase):
    """创建车系"""
    pass

class CarSeriesUpdate(CarSeriesBase):
    """更新车系"""
    pass

class CarSeries(CarSeriesBase):
    """API 返回的车系模型"""
    id: int
    class Config:
        from_attributes = True


# ========== 汽车车型 (Car Model) ==========
class CarModelBase(BaseModel):
    """
    汽车车型基础模型
    """
    name: str           # 车型名称 (如 2023款 325Li)
    series_id: int      # 关联车系ID
    year: Optional[str] = None  # 年款

class CarModelCreate(CarModelBase):
    """创建车型"""
    pass

class CarModelUpdate(CarModelBase):
    """更新车型"""
    pass

class CarModel(CarModelBase):
    """API 返回的车型模型"""
    id: int
    class Config:
        from_attributes = True


# ========== 带关联的嵌套模型 ==========
class CarSeriesWithModels(CarSeries):
    """车系及其车型列表"""
    models: List[CarModel] = []

class CarBrandWithSeries(CarBrand):
    """品牌及其车系列表"""
    series: List[CarSeriesWithModels] = []
