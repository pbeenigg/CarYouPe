from typing import List, Optional
from decimal import Decimal
from pydantic import BaseModel
from datetime import datetime

# Order Item
class OrderItemBase(BaseModel):
    """
    订单项基础模型
    """
    product_id: int              # 商品ID
    product_sku_id: Optional[int] = None  # SKU ID
    quantity: int                # 数量
    price: Decimal               # 单价
    product_name: str            # 商品名称
    product_image: Optional[str] = None   # 商品图片
    sku_specs: Optional[dict] = None      # SKU规格信息

class OrderItemCreate(OrderItemBase):
    """
    创建订单项时使用的模型
    """
    pass

class OrderItem(OrderItemBase):
    """
    订单项模型（含数据库ID）
    """
    id: int
    order_id: int
    class Config:
        from_attributes = True

# Order
class OrderBase(BaseModel):
    """
    订单基础模型
    """
    total_amount: Decimal        # 订单总金额
    shipping_name: str           # 收货人姓名
    shipping_phone: str          # 收货人电话
    shipping_address: str        # 收货地址
    status: str = "pending"      # 订单状态：pending, paid, shipped, completed, cancelled
    tracking_no: Optional[str] = None  # 物流单号
    remark: Optional[str] = None       # 备注

class OrderCreate(OrderBase):
    """
    创建订单时使用的模型
    """
    items: List[OrderItemCreate] # 订单项列表

class OrderUpdate(BaseModel):
    """
    更新订单时使用的模型
    """
    status: Optional[str] = None         # 订单状态
    shipping_name: Optional[str] = None  # 收货人姓名
    shipping_phone: Optional[str] = None # 收货人电话
    shipping_address: Optional[str] = None # 收货地址
    tracking_no: Optional[str] = None    # 物流单号
    remark: Optional[str] = None         # 备注

class Order(OrderBase):
    """
    API 返回的订单模型
    """
    id: int                      # 订单ID
    order_no: str                # 订单编号
    user_id: int                 # 用户ID
    created_at: datetime         # 创建时间
    updated_at: Optional[datetime] = None # 更新时间
    items: List[OrderItem] = []  # 订单项列表
    
    class Config:
        from_attributes = True
