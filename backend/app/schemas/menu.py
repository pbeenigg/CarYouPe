from typing import Optional, List
from pydantic import BaseModel

# Shared properties
class MenuBase(BaseModel):
    """
    菜单基础模型
    """
    title: Optional[str] = None  # 菜单标题
    path: Optional[str] = None   # 菜单路径
    icon: Optional[str] = None   # 菜单图标
    order: Optional[int] = 0     # 排序
    parent_id: Optional[int] = None  # 父菜单ID

# Properties to receive via API on creation
class MenuCreate(MenuBase):
    """
    创建菜单时使用的模型
    """
    title: str  # 必填，菜单标题
    path: str   # 必填，菜单路径

# Properties to receive via API on update
class MenuUpdate(MenuBase):
    """
    更新菜单时使用的模型
    """
    pass

class MenuInDBBase(MenuBase):
    """
    数据库中的菜单模型基类
    """
    id: int  # 菜单ID

    class Config:
        from_attributes = True

# Additional properties to return via API
class Menu(MenuInDBBase):
    """
    API 返回的菜单模型
    """
    children: Optional[List['Menu']] = []  # 子菜单列表

# Resolve forward reference
# 解决前向引用
Menu.model_rebuild()
