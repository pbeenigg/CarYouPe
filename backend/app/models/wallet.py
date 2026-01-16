from sqlalchemy import Column, Integer, String, ForeignKey, DECIMAL, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class Wallet(Base):
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), unique=True)
    balance = Column(DECIMAL(10, 2), default=0)
    points = Column(Integer, default=0)
    total_income = Column(DECIMAL(10, 2), default=0)
    
    transactions = relationship("WalletTransaction", back_populates="wallet")

class WalletTransaction(Base):
    __tablename__ = "wallet_transaction"
    id = Column(Integer, primary_key=True, index=True)
    wallet_id = Column(Integer, ForeignKey("wallet.id"))
    type = Column(String(50)) # commission, withdraw, consume
    amount = Column(DECIMAL(10, 2))
    related_id = Column(Integer) # Order ID or Withdraw ID
    direction = Column(Integer) # 1 or -1
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    wallet = relationship("Wallet", back_populates="transactions")
