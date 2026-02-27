from typing import Optional
from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal

class StoreBase(BaseModel):
    """
    店铺/合伙人基础模型
    """
    name: str                              # 店铺名称
    contact_name: str                      # 联系人姓名
    contact_phone: str                     # 联系人电话
    province: Optional[str] = None         # 省
    city: Optional[str] = None             # 市
    district: Optional[str] = None         # 区
    address: Optional[str] = None          # 详细地址
    business_license: Optional[str] = None # 营业执照图片URL
    id_card_front: Optional[str] = None    # 身份证正面
    id_card_back: Optional[str] = None     # 身份证反面

class StoreCreate(StoreBase):
    """
    创建店铺申请
    """
    user_id: int

class StoreUpdate(BaseModel):
    """
    更新店铺信息（管理员审核用）
    """
    name: Optional[str] = None
    level: Optional[str] = None
    contact_name: Optional[str] = None
    contact_phone: Optional[str] = None
    province: Optional[str] = None
    city: Optional[str] = None
    district: Optional[str] = None
    address: Optional[str] = None
    business_license: Optional[str] = None
    id_card_front: Optional[str] = None
    id_card_back: Optional[str] = None
    commission_rate: Optional[Decimal] = None
    status: Optional[int] = None
    reject_reason: Optional[str] = None
    remark: Optional[str] = None

class StoreAudit(BaseModel):
    """
    审核店铺申请
    """
    status: int                            # 1:通过, 2:拒绝
    reject_reason: Optional[str] = None    # 拒绝原因
    level: Optional[str] = None            # 审核通过时设置等级
    commission_rate: Optional[Decimal] = None # 审核通过时设置佣金比例
    remark: Optional[str] = None

class Store(StoreBase):
    """
    API 返回的店铺模型
    """
    id: int
    user_id: int
    level: str = "normal"
    commission_rate: Optional[Decimal] = None
    status: int = 0
    reject_reason: Optional[str] = None
    remark: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    approved_at: Optional[datetime] = None

    class Config:
        from_attributes = True
