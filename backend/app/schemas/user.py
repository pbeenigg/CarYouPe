from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel

# Shared properties
class UserBase(BaseModel):
    """
    用户基础模型
    """
    username: Optional[str] = None   # 用户名
    phone: Optional[str] = None      # 手机号
    nickname: Optional[str] = None   # 昵称
    real_name: Optional[str] = None  # 真实姓名
    is_active: Optional[bool] = True # 是否激活
    is_superuser: bool = False       # 是否超级管理员

# Properties to receive via API on creation
class UserCreate(UserBase):
    """
    创建用户时使用的模型
    """
    password: Optional[str] = None # 密码 (管理员创建时必填)

# Properties to receive via API on update
class UserUpdate(UserBase):
    """
    更新用户时使用的模型
    """
    password: Optional[str] = None # 新密码

# Properties shared by models stored in DB
class UserInDBBase(UserBase):
    """
    数据库中的用户模型基类
    """
    id: Optional[int] = None       # 用户ID
    created_at: Optional[datetime] = None # 创建时间

    class Config:
        orm_mode = True

# Properties to return to client
class User(UserInDBBase):
    """
    API 返回的用户模型
    """
    pass

# Properties stored in DB
class UserInDB(UserInDBBase):
    """
    数据库存储的完整用户模型 (含哈希密码)
    """
    hashed_password: str
