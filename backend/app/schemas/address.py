from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class AddressBase(BaseModel):
    """
    地址基础模型
    """
    name: str                    # 收货人姓名
    phone: str                   # 收货人电话
    province: str                # 省
    city: str                    # 市
    district: str                # 区
    detail: str                  # 详细地址
    is_default: bool = False     # 是否默认地址

class AddressCreate(AddressBase):
    """
    创建地址时使用的模型
    """
    pass

class AddressUpdate(BaseModel):
    """
    更新地址时使用的模型
    """
    name: Optional[str] = None
    phone: Optional[str] = None
    province: Optional[str] = None
    city: Optional[str] = None
    district: Optional[str] = None
    detail: Optional[str] = None
    is_default: Optional[bool] = None

class Address(AddressBase):
    """
    API 返回的地址模型
    """
    id: int
    user_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
