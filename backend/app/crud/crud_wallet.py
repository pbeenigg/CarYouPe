from typing import List, Optional
from decimal import Decimal
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.wallet import Wallet, WalletTransaction
from app.schemas.wallet import (
    WalletCreate, WalletUpdate,
    WalletTransactionCreate, WalletTransactionUpdate,
)


class CRUDWallet(CRUDBase[Wallet, WalletCreate, WalletUpdate]):
    def get_by_user(self, db: Session, *, user_id: int) -> Optional[Wallet]:
        return db.query(self.model).filter(Wallet.user_id == user_id).first()

    def get_or_create(self, db: Session, *, user_id: int) -> Wallet:
        """获取用户钱包，不存在则自动创建"""
        w = self.get_by_user(db, user_id=user_id)
        if not w:
            w = Wallet(user_id=user_id, balance=0, points=0, total_income=0)
            db.add(w)
            db.commit()
            db.refresh(w)
        return w

    def add_balance(self, db: Session, *, wallet_id: int, amount: Decimal) -> Wallet:
        """增加余额"""
        w = db.query(self.model).filter(Wallet.id == wallet_id).first()
        if w:
            w.balance = w.balance + amount
            w.total_income = w.total_income + amount
            db.add(w)
            db.commit()
            db.refresh(w)
        return w

    def deduct_balance(self, db: Session, *, wallet_id: int, amount: Decimal) -> Optional[Wallet]:
        """扣减余额，余额不足返回 None"""
        w = db.query(self.model).filter(Wallet.id == wallet_id).first()
        if w and w.balance >= amount:
            w.balance = w.balance - amount
            db.add(w)
            db.commit()
            db.refresh(w)
            return w
        return None

    def add_points(self, db: Session, *, wallet_id: int, points: int) -> Wallet:
        """增加积分"""
        w = db.query(self.model).filter(Wallet.id == wallet_id).first()
        if w:
            w.points = w.points + points
            db.add(w)
            db.commit()
            db.refresh(w)
        return w


class CRUDWalletTransaction(CRUDBase[WalletTransaction, WalletTransactionCreate, WalletTransactionUpdate]):
    def get_by_wallet(self, db: Session, *, wallet_id: int, skip: int = 0, limit: int = 100) -> List[WalletTransaction]:
        return (
            db.query(self.model)
            .filter(WalletTransaction.wallet_id == wallet_id)
            .order_by(WalletTransaction.created_at.desc())
            .offset(skip).limit(limit).all()
        )

    def get_by_type(self, db: Session, *, wallet_id: int, type: str, skip: int = 0, limit: int = 100) -> List[WalletTransaction]:
        return (
            db.query(self.model)
            .filter(WalletTransaction.wallet_id == wallet_id, WalletTransaction.type == type)
            .order_by(WalletTransaction.created_at.desc())
            .offset(skip).limit(limit).all()
        )

    def create_with_wallet_update(
        self, db: Session, *, obj_in: WalletTransactionCreate
    ) -> WalletTransaction:
        """创建交易记录并同步更新钱包余额"""
        tx = WalletTransaction(
            wallet_id=obj_in.wallet_id,
            type=obj_in.type,
            amount=obj_in.amount,
            direction=obj_in.direction,
            related_id=obj_in.related_id,
        )
        db.add(tx)

        w = db.query(Wallet).filter(Wallet.id == obj_in.wallet_id).first()
        if w:
            change = obj_in.amount * obj_in.direction
            w.balance = w.balance + change
            if obj_in.direction == 1:
                w.total_income = w.total_income + obj_in.amount
            db.add(w)

        db.commit()
        db.refresh(tx)
        return tx


wallet = CRUDWallet(Wallet)
wallet_transaction = CRUDWalletTransaction(WalletTransaction)
