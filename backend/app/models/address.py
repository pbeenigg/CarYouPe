from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Address(Base):
    """
    用户收货地址模型
    """
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), index=True) # 所属用户
    name = Column(String(100))           # 收货人姓名
    phone = Column(String(20))           # 收货人电话
    province = Column(String(50))        # 省
    city = Column(String(50))            # 市
    district = Column(String(50))        # 区
    detail = Column(String(500))         # 详细地址
    is_default = Column(Boolean, default=False) # 是否默认地址

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", backref="addresses")
