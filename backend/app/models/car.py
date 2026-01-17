from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class CarBrand(Base):
    """
    汽车品牌模型
    """
    __tablename__ = "car_brand"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), index=True)  # 品牌名称
    logo = Column(String(500))              # 品牌Logo
    
    series = relationship("CarSeries", back_populates="brand")

class CarSeries(Base):
    """
    汽车车系模型
    """
    __tablename__ = "car_series"
    id = Column(Integer, primary_key=True, index=True)
    brand_id = Column(Integer, ForeignKey("car_brand.id"))  # 关联品牌
    name = Column(String(100))  # 车系名称
    
    brand = relationship("CarBrand", back_populates="series")
    models = relationship("CarModel", back_populates="series")

class CarModel(Base):
    """
    汽车车型模型
    """
    __tablename__ = "car_model"
    id = Column(Integer, primary_key=True, index=True)
    series_id = Column(Integer, ForeignKey("car_series.id"))  # 关联车系
    name = Column(String(100)) # e.g. 2023 325Li  # 车型名称
    year = Column(String(20))  # 年款
    
    series = relationship("CarSeries", back_populates="models")
