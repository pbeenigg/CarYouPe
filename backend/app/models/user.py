from sqlalchemy import Boolean, Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.db.base_class import Base

class User(Base):
    """
    用户模型
    """
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, index=True, nullable=True) # 用户名
    hashed_password = Column(String(255), nullable=True) # 加密密码
    phone = Column(String(20), unique=True, index=True, nullable=True) # 手机号
    openid_wechat = Column(String(100), unique=True, index=True, nullable=True) # 微信OpenID
    nickname = Column(String(100), nullable=True) # 昵称
    real_name = Column(String(50), nullable=True) # 真实姓名
    avatar_url = Column(String(500), nullable=True) # 头像链接
    
    is_active = Column(Boolean, default=True)    # 是否激活
    is_superuser = Column(Boolean, default=False) # 是否超级管理员
    
    created_at = Column(DateTime(timezone=True), server_default=func.now()) # 创建时间
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())       # 更新时间
