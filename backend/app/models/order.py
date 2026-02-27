from sqlalchemy import Column, Integer, String, ForeignKey, DECIMAL, DateTime, JSON, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.db.base_class import Base

class OrderStatus(str, enum.Enum):
    """
    订单状态枚举
    """
    PENDING = "pending"     # 待支付
    PAID = "paid"           # 已支付
    SHIPPED = "shipped"     # 已发货
    COMPLETED = "completed" # 已完成
    CANCELLED = "cancelled" # 已取消

class Order(Base):
    """
    订单模型
    """
    id = Column(Integer, primary_key=True, index=True)
    order_no = Column(String(50), unique=True, index=True) # Unique order number (订单编号)
    user_id = Column(Integer, ForeignKey("user.id"))       # 下单用户ID
    total_amount = Column(DECIMAL(10, 2))                  # 订单总金额
    status = Column(String(20), default=OrderStatus.PENDING.value) # 订单状态
    
    shipping_name = Column(String(100))    # 收货人姓名
    shipping_phone = Column(String(20))    # 收货人电话
    shipping_address = Column(String(500)) # 收货地址
    tracking_no = Column(String(100), nullable=True) # 物流单号
    remark = Column(String(500), nullable=True)      # 备注
    
    created_at = Column(DateTime(timezone=True), server_default=func.now()) # 创建时间
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())       # 更新时间

    # Relationships
    user = relationship("User", backref="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    """
    订单项模型
    """
    __tablename__ = "order_item"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("order.id"))     # 关联订单
    product_id = Column(Integer, ForeignKey("product.id")) # 关联商品
    product_sku_id = Column(Integer, ForeignKey("product_sku.id"), nullable=True) # 关联SKU
    
    quantity = Column(Integer) # 购买数量
    price = Column(DECIMAL(10, 2)) # Price at the time of purchase (购买时的单价)
    
    product_name = Column(String(200)) # 商品名称快照
    product_image = Column(String(500)) # 商品图片快照
    sku_specs = Column(JSON) # Snapshot of SKU specs (SKU规格快照)
    
    order = relationship("Order", back_populates="items")
    product = relationship("Product")
    product_sku = relationship("ProductSKU")
