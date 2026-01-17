from sqlalchemy import Column, Integer, String, ForeignKey, DECIMAL, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class DistributionRelation(Base):
    """
    分销关系模型
    """
    __tablename__ = "distribution_relation"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), unique=True) # The child (下级用户ID)
    parent_id = Column(Integer, ForeignKey("user.id")) # The parent (上级用户ID)
    path = Column(String(500)) # e.g. /grandparent_id/parent_id/ (关系路径)
    bind_time = Column(DateTime(timezone=True), server_default=func.now()) # 绑定时间

class CommissionRecord(Base):
    """
    佣金记录模型
    """
    __tablename__ = "commission_record"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, index=True) # Link to Order (关联订单ID)
    order_item_id = Column(Integer)        # 关联订单项ID
    beneficiary_id = Column(Integer, ForeignKey("user.id")) # Who gets the money (受益人ID)
    source_user_id = Column(Integer, ForeignKey("user.id")) # Who bought the item (购买人ID)
    amount = Column(DECIMAL(10, 2))        # 佣金金额
    status = Column(Integer, default=0) # 0:Pending(待结算), 1:Settled(已结算), 2:Cancelled(已取消)
    level_snapshot = Column(String(50)) # e.g. "SVIP", "Partner-City" (等级快照)
    created_at = Column(DateTime(timezone=True), server_default=func.now()) # 创建时间
