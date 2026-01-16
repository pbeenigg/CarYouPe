from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class CarBrand(Base):
    __tablename__ = "car_brand"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), index=True)
    logo = Column(String(500))
    
    series = relationship("CarSeries", back_populates="brand")

class CarSeries(Base):
    __tablename__ = "car_series"
    id = Column(Integer, primary_key=True, index=True)
    brand_id = Column(Integer, ForeignKey("car_brand.id"))
    name = Column(String(100))
    
    brand = relationship("CarBrand", back_populates="series")
    models = relationship("CarModel", back_populates="series")

class CarModel(Base):
    __tablename__ = "car_model"
    id = Column(Integer, primary_key=True, index=True)
    series_id = Column(Integer, ForeignKey("car_series.id"))
    name = Column(String(100)) # e.g. 2023 325Li
    year = Column(String(20))
    
    series = relationship("CarSeries", back_populates="models")
