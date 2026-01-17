from sqlalchemy import Column, Integer, String, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Role(Base):
    """
    角色模型
    """
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, index=True) # admin, partner, store, member (角色名称)
    description = Column(String(200)) # 角色描述
    permissions = Column(JSON, nullable=True) # 权限列表

class UserRole(Base):
    """
    用户角色关联模型
    """
    __tablename__ = "user_role"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id")) # 关联用户
    role_id = Column(Integer, ForeignKey("role.id")) # 关联角色
    level = Column(Integer, default=0) # For partner levels (1:Provincial, 2:City, 3:District) or Member VIP levels (等级)
