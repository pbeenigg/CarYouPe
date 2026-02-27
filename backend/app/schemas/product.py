from typing import Optional, List, Any
from pydantic import BaseModel
from decimal import Decimal


# ========== 车型适配 ==========
class ProductCarCompatibilityBase(BaseModel):
    """
    商品车型适配基础模型
    """
    car_model_id: Optional[int] = None  # 关联车型ID
    is_universal: bool = False          # 是否通用

class ProductCarCompatibilityCreate(ProductCarCompatibilityBase):
    """创建车型适配"""
    pass

class ProductCarCompatibility(ProductCarCompatibilityBase):
    """API 返回的车型适配模型"""
    id: int
    product_id: int
    class Config:
        from_attributes = True


# SKU
class ProductSKUBase(BaseModel):
    """
    商品SKU基础模型
    """
    specs: dict   # 规格信息，如 {"color": "red", "size": "L"}
    price: Decimal # 价格
    stock: int    # 库存

class ProductSKUCreate(ProductSKUBase):
    """
    创建SKU时使用的模型
    """
    pass

class ProductSKU(ProductSKUBase):
    """
    API 返回的SKU模型
    """
    id: int
    product_id: int
    class Config:
        from_attributes = True

# Product
class ProductBase(BaseModel):
    """
    商品基础模型
    """
    title: str                  # 商品标题
    subtitle: Optional[str] = None # 副标题
    category_id: int            # 分类ID
    base_price: Decimal         # 基础价格
    is_on_sale: bool = True     # 是否上架
    description: Optional[str] = None # 商品描述
    main_image: Optional[str] = None  # 主图
    detail_images: Optional[List[str]] = [] # 详情图列表

class ProductCreate(ProductBase):
    """
    创建商品时使用的模型
    """
    skus: List[ProductSKUCreate] = [] # SKU列表
    car_compatibility: List[ProductCarCompatibilityCreate] = [] # 车型适配列表

class ProductUpdate(ProductBase):
    """
    更新商品时使用的模型
    """
    skus: Optional[List[ProductSKUCreate]] = None
    car_compatibility: Optional[List[ProductCarCompatibilityCreate]] = None

class Product(ProductBase):
    """
    API 返回的商品模型
    """
    id: int
    skus: List[ProductSKU] = []
    car_compatibility: List[ProductCarCompatibility] = []
    class Config:
        from_attributes = True
