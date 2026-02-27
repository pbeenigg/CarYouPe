from typing import Optional
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel


# ==================== Wallet ====================

class WalletBase(BaseModel):
    balance: Decimal = Decimal("0")
    points: int = 0
    total_income: Decimal = Decimal("0")


class WalletCreate(BaseModel):
    user_id: int


class WalletUpdate(BaseModel):
    balance: Optional[Decimal] = None
    points: Optional[int] = None
    total_income: Optional[Decimal] = None


class Wallet(WalletBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True


# ==================== WalletTransaction ====================

class WalletTransactionBase(BaseModel):
    wallet_id: int
    type: str                  # commission, withdraw, consume
    amount: Decimal
    direction: int             # 1=收入, -1=支出
    related_id: Optional[int] = None


class WalletTransactionCreate(WalletTransactionBase):
    pass


class WalletTransactionUpdate(BaseModel):
    type: Optional[str] = None
    amount: Optional[Decimal] = None
    direction: Optional[int] = None
    related_id: Optional[int] = None


class WalletTransaction(WalletTransactionBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
