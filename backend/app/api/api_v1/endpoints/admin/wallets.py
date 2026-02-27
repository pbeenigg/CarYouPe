from typing import Any, List
from decimal import Decimal
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app import crud, models
from app.api import deps
from app.schemas.response import ResponseSuccess
from app.schemas.wallet import (
    Wallet,
    WalletTransaction, WalletTransactionCreate,
)
from app.core.exceptions import CustomException

router = APIRouter()

# ==================== 钱包 ====================

@router.get("/", response_model=ResponseSuccess[List[Wallet]])
def read_wallets(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    获取钱包列表
    Retrieve wallets list.
    """
    wallets = crud.wallet.get_multi(db, skip=skip, limit=limit)
    return ResponseSuccess(data=wallets)


@router.get("/user/{user_id}", response_model=ResponseSuccess[Wallet])
def read_wallet_by_user(
    *,
    db: Session = Depends(deps.get_db),
    user_id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    获取某用户的钱包（不存在则自动创建）
    Get or create wallet by user ID.
    """
    wallet = crud.wallet.get_or_create(db, user_id=user_id)
    return ResponseSuccess(data=wallet)


@router.get("/{wallet_id}", response_model=ResponseSuccess[Wallet])
def read_wallet(
    *,
    db: Session = Depends(deps.get_db),
    wallet_id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    获取钱包详情
    Get wallet by ID.
    """
    wallet = crud.wallet.get(db, id=wallet_id)
    if not wallet:
        raise CustomException(code=404, message="钱包不存在")
    return ResponseSuccess(data=wallet)


@router.post("/{wallet_id}/add-balance", response_model=ResponseSuccess[Wallet])
def add_balance(
    *,
    db: Session = Depends(deps.get_db),
    wallet_id: int,
    amount: Decimal = Query(..., description="增加金额", gt=0),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    增加钱包余额（管理员操作）
    Add balance to a wallet.
    """
    wallet = crud.wallet.get(db, id=wallet_id)
    if not wallet:
        raise CustomException(code=404, message="钱包不存在")
    wallet = crud.wallet.add_balance(db, wallet_id=wallet_id, amount=amount)
    return ResponseSuccess(data=wallet)


@router.post("/{wallet_id}/deduct-balance", response_model=ResponseSuccess[Wallet])
def deduct_balance(
    *,
    db: Session = Depends(deps.get_db),
    wallet_id: int,
    amount: Decimal = Query(..., description="扣减金额", gt=0),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    扣减钱包余额
    Deduct balance from a wallet.
    """
    wallet = crud.wallet.get(db, id=wallet_id)
    if not wallet:
        raise CustomException(code=404, message="钱包不存在")
    wallet = crud.wallet.deduct_balance(db, wallet_id=wallet_id, amount=amount)
    if not wallet:
        raise CustomException(code=400, message="余额不足")
    return ResponseSuccess(data=wallet)


@router.post("/{wallet_id}/add-points", response_model=ResponseSuccess[Wallet])
def add_points(
    *,
    db: Session = Depends(deps.get_db),
    wallet_id: int,
    points: int = Query(..., description="增加积分", gt=0),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    增加积分
    Add points to a wallet.
    """
    wallet = crud.wallet.get(db, id=wallet_id)
    if not wallet:
        raise CustomException(code=404, message="钱包不存在")
    wallet = crud.wallet.add_points(db, wallet_id=wallet_id, points=points)
    return ResponseSuccess(data=wallet)


# ==================== 交易记录 ====================

@router.get("/{wallet_id}/transactions", response_model=ResponseSuccess[List[WalletTransaction]])
def read_transactions(
    *,
    db: Session = Depends(deps.get_db),
    wallet_id: int,
    skip: int = 0,
    limit: int = 100,
    type: str = Query(None, description="按类型筛选: commission, withdraw, consume"),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    获取钱包交易记录
    Retrieve wallet transactions.
    """
    wallet = crud.wallet.get(db, id=wallet_id)
    if not wallet:
        raise CustomException(code=404, message="钱包不存在")
    if type:
        transactions = crud.wallet_transaction.get_by_type(
            db, wallet_id=wallet_id, type=type, skip=skip, limit=limit
        )
    else:
        transactions = crud.wallet_transaction.get_by_wallet(
            db, wallet_id=wallet_id, skip=skip, limit=limit
        )
    return ResponseSuccess(data=transactions)


@router.post("/{wallet_id}/transactions", response_model=ResponseSuccess[WalletTransaction])
def create_transaction(
    *,
    db: Session = Depends(deps.get_db),
    wallet_id: int,
    tx_in: WalletTransactionCreate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    创建交易记录并同步更新钱包余额
    Create a transaction and update wallet balance.
    """
    wallet = crud.wallet.get(db, id=wallet_id)
    if not wallet:
        raise CustomException(code=404, message="钱包不存在")
    if tx_in.wallet_id != wallet_id:
        raise CustomException(code=400, message="wallet_id 不匹配")
    transaction = crud.wallet_transaction.create_with_wallet_update(db, obj_in=tx_in)
    return ResponseSuccess(data=transaction)


@router.get("/transactions/{transaction_id}", response_model=ResponseSuccess[WalletTransaction])
def read_transaction(
    *,
    db: Session = Depends(deps.get_db),
    transaction_id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    获取单条交易记录详情
    Get transaction by ID.
    """
    transaction = crud.wallet_transaction.get(db, id=transaction_id)
    if not transaction:
        raise CustomException(code=404, message="交易记录不存在")
    return ResponseSuccess(data=transaction)
