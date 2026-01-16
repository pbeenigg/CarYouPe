from sqlalchemy import Column, Integer, String, ForeignKey, DECIMAL, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class DistributionRelation(Base):
    __tablename__ = "distribution_relation"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), unique=True) # The child
    parent_id = Column(Integer, ForeignKey("user.id")) # The parent
    path = Column(String(500)) # e.g. /grandparent_id/parent_id/
    bind_time = Column(DateTime(timezone=True), server_default=func.now())

class CommissionRecord(Base):
    __tablename__ = "commission_record"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, index=True) # Link to Order
    order_item_id = Column(Integer)
    beneficiary_id = Column(Integer, ForeignKey("user.id")) # Who gets the money
    source_user_id = Column(Integer, ForeignKey("user.id")) # Who bought the item
    amount = Column(DECIMAL(10, 2))
    status = Column(Integer, default=0) # 0:Pending, 1:Settled, 2:Cancelled
    level_snapshot = Column(String(50)) # e.g. "SVIP", "Partner-City"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
