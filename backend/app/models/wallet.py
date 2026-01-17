from sqlalchemy import Column, Integer, String, ForeignKey, DECIMAL, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class Wallet(Base):
    """
    用户钱包模型
    """
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), unique=True) # 关联用户
    balance = Column(DECIMAL(10, 2), default=0)      # 余额
    points = Column(Integer, default=0)              # 积分
    total_income = Column(DECIMAL(10, 2), default=0) # 总收入
    
    transactions = relationship("WalletTransaction", back_populates="wallet")

class WalletTransaction(Base):
    """
    钱包交易记录模型
    """
    __tablename__ = "wallet_transaction"
    id = Column(Integer, primary_key=True, index=True)
    wallet_id = Column(Integer, ForeignKey("wallet.id")) # 关联钱包
    type = Column(String(50)) # commission, withdraw, consume (交易类型：佣金、提现、消费)
    amount = Column(DECIMAL(10, 2)) # 交易金额
    related_id = Column(Integer) # Order ID or Withdraw ID (关联业务ID)
    direction = Column(Integer) # 1 or -1 (资金流向：1收入，-1支出)
    created_at = Column(DateTime(timezone=True), server_default=func.now()) # 创建时间
    
    wallet = relationship("Wallet", back_populates="transactions")
