from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Menu(Base):
    """
    系统菜单模型
    """
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(50), index=True)  # 菜单标题
    path = Column(String(100))              # 菜单路径
    icon = Column(String(50), nullable=True) # 菜单图标
    order = Column(Integer, default=0)      # 排序权重
    parent_id = Column(Integer, ForeignKey("menu.id"), nullable=True) # 父菜单ID
    
    parent = relationship("Menu", remote_side=[id], backref="children") # 父子关系
