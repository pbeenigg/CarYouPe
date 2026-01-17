from typing import Optional, List, Any
from pydantic import BaseModel

# Shared properties
class RoleBase(BaseModel):
    """
    角色基础模型
    """
    name: Optional[str] = None        # 角色名称
    description: Optional[str] = None # 角色描述
    permissions: Optional[List[str]] = None  # 权限列表

# Properties to receive via API on creation
class RoleCreate(RoleBase):
    """
    创建角色时使用的模型
    """
    name: str  # 必填，角色名称

# Properties to receive via API on update
class RoleUpdate(RoleBase):
    """
    更新角色时使用的模型
    """
    pass

class RoleInDBBase(RoleBase):
    """
    数据库中的角色模型基类
    """
    id: int  # 角色ID

    class Config:
        from_attributes = True

# Additional properties to return via API
class Role(RoleInDBBase):
    """
    API 返回的角色模型
    """
    pass
