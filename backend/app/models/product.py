from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DECIMAL, JSON, Text
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Category(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    parent_id = Column(Integer, ForeignKey("category.id"), nullable=True)

class Product(Base):
    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("category.id"))
    title = Column(String(200), index=True)
    subtitle = Column(String(200))
    main_image = Column(String(500))
    detail_images = Column(JSON)
    base_price = Column(DECIMAL(10, 2))
    is_on_sale = Column(Boolean, default=True)
    description = Column(Text)
    
    skus = relationship("ProductSKU", back_populates="product")
    car_compatibility = relationship("ProductCarCompatibility", back_populates="product")

class ProductSKU(Base):
    __tablename__ = "product_sku"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("product.id"))
    specs = Column(JSON) # {"color": "red", "material": "leather"}
    price = Column(DECIMAL(10, 2))
    stock = Column(Integer, default=0)
    
    product = relationship("Product", back_populates="skus")

class ProductCarCompatibility(Base):
    __tablename__ = "product_car_compatibility"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("product.id"))
    car_model_id = Column(Integer, ForeignKey("car_model.id"), nullable=True)
    is_universal = Column(Boolean, default=False)
    
    product = relationship("Product", back_populates="car_compatibility")
