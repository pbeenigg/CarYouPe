from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, DECIMAL
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Store(Base):
    """
    店铺/合伙人模型
    用户申请成为合伙人，管理员审核
    """
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), unique=True, index=True) # 申请人
    name = Column(String(200))              # 店铺/合伙人名称
    level = Column(String(50), default="normal") # 等级: normal(普通), city(城市合伙人), region(区域合伙人), svip(SVIP)
    contact_name = Column(String(100))      # 联系人姓名
    contact_phone = Column(String(20))      # 联系人电话
    province = Column(String(50))           # 省
    city = Column(String(50))               # 市
    district = Column(String(50))           # 区
    address = Column(String(500))           # 详细地址
    business_license = Column(String(500))  # 营业执照图片URL
    id_card_front = Column(String(500))     # 身份证正面图片URL
    id_card_back = Column(String(500))      # 身份证反面图片URL
    commission_rate = Column(DECIMAL(5, 4), default=0) # 佣金比例 (e.g. 0.0500 = 5%)
    status = Column(Integer, default=0)     # 0:待审核(pending), 1:已通过(approved), 2:已拒绝(rejected), 3:已禁用(disabled)
    reject_reason = Column(String(500))     # 拒绝原因
    remark = Column(Text)                   # 备注

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    approved_at = Column(DateTime(timezone=True)) # 审核通过时间

    user = relationship("User", backref="store")
