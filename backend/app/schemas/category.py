from typing import Optional, List
from pydantic import BaseModel

class CategoryBase(BaseModel):
    """
    分类基础模型
    Shared properties
    """
    name: str  # 分类名称
    parent_id: Optional[int] = None  # 父分类ID

class CategoryCreate(CategoryBase):
    """
    创建分类时使用的模型
    Properties to receive via API on creation
    """
    pass

class CategoryUpdate(CategoryBase):
    """
    更新分类时使用的模型
    Properties to receive via API on update
    """
    pass

class CategoryInDBBase(CategoryBase):
    """
    数据库中的分类模型基类
    """
    id: int  # 分类ID

    class Config:
        from_attributes = True

class Category(CategoryInDBBase):
    """
    API 返回的分类模型
    Additional properties to return via API
    """
    children: Optional[List['Category']] = []  # 子分类列表

# 解决前向引用
Category.model_rebuild()
