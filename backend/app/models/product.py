from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DECIMAL, JSON, Text
from sqlalchemy.orm import relationship, backref
from app.db.base_class import Base

class Category(Base):
    """
    商品分类模型
    """
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100)) # 分类名称
    parent_id = Column(Integer, ForeignKey("category.id"), nullable=True) # 父分类ID

class Product(Base):
    """
    商品模型
    """
    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("category.id")) # 关联分类
    title = Column(String(200), index=True) # 商品标题
    subtitle = Column(String(200))          # 副标题
    main_image = Column(String(500))        # 主图
    detail_images = Column(JSON)            # 详情图列表
    base_price = Column(DECIMAL(10, 2))     # 基础价格
    is_on_sale = Column(Boolean, default=True) # 是否上架
    description = Column(Text)              # 商品描述
    
    skus = relationship("ProductSKU", back_populates="product")
    car_compatibility = relationship("ProductCarCompatibility", back_populates="product")

class ProductSKU(Base):
    """
    商品SKU模型
    """
    __tablename__ = "product_sku"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("product.id")) # 关联商品
    specs = Column(JSON) # {"color": "red", "material": "leather"} (规格属性)
    price = Column(DECIMAL(10, 2)) # 价格
    stock = Column(Integer, default=0) # 库存
    
    product = relationship("Product", back_populates="skus")

class ProductCarCompatibility(Base):
    """
    商品车型适配模型
    """
    __tablename__ = "product_car_compatibility"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("product.id")) # 关联商品
    car_model_id = Column(Integer, ForeignKey("car_model.id"), nullable=True) # 关联车型
    is_universal = Column(Boolean, default=False) # 是否通用
    
    product = relationship("Product", back_populates="car_compatibility")
