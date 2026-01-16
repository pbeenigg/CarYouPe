from sqlalchemy import Column, Integer, String, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Role(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, index=True) # admin, partner, store, member
    description = Column(String(200))
    permissions = Column(JSON, nullable=True)

class UserRole(Base):
    __tablename__ = "user_role"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    role_id = Column(Integer, ForeignKey("role.id"))
    level = Column(Integer, default=0) # For partner levels (1:Provincial, 2:City, 3:District) or Member VIP levels
