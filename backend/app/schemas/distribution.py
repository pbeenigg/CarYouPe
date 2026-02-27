from typing import Optional
from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal

# ==================== DistributionRelation ====================

class DistributionRelationBase(BaseModel):
    """
    分销关系基础模型
    """
    user_id: int                           # 下级用户ID
    parent_id: int                         # 上级用户ID

class DistributionRelationCreate(DistributionRelationBase):
    """
    创建分销关系
    """
    pass

class DistributionRelationUpdate(BaseModel):
    """
    更新分销关系
    """
    parent_id: Optional[int] = None
    path: Optional[str] = None

class DistributionRelation(DistributionRelationBase):
    """
    API 返回的分销关系模型
    """
    id: int
    path: Optional[str] = None
    bind_time: Optional[datetime] = None

    class Config:
        from_attributes = True

# ==================== CommissionRecord ====================

class CommissionRecordBase(BaseModel):
    """
    佣金记录基础模型
    """
    order_id: int                          # 关联订单ID
    order_item_id: Optional[int] = None    # 关联订单项ID
    beneficiary_id: int                    # 受益人ID
    source_user_id: int                    # 购买人ID
    amount: Decimal                        # 佣金金额
    level_snapshot: Optional[str] = None   # 等级快照

class CommissionRecordCreate(CommissionRecordBase):
    """
    创建佣金记录
    """
    pass

class CommissionRecordUpdate(BaseModel):
    """
    更新佣金记录（主要用于更新结算状态）
    """
    status: Optional[int] = None           # 0:待结算, 1:已结算, 2:已取消

class CommissionRecord(CommissionRecordBase):
    """
    API 返回的佣金记录模型
    """
    id: int
    status: int = 0
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
