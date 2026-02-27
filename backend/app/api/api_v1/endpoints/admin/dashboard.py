from datetime import datetime, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func as sa_func

from app.api import deps
from app import models
from app.models.order import Order, OrderStatus
from app.models.user import User
from app.models.product import Product
from app.models.store import Store
from app.models.wallet import Wallet
from app.schemas.response import ResponseSuccess

router = APIRouter()


@router.get("/", response_model=ResponseSuccess)
def get_admin_dashboard(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    获取管理后台仪表盘数据（真实统计）
    """
    now = datetime.utcnow()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    # ---- 用户统计 ----
    total_users = db.query(sa_func.count(User.id)).scalar() or 0
    today_new_users = (
        db.query(sa_func.count(User.id))
        .filter(User.created_at >= today_start)
        .scalar() or 0
    )
    month_new_users = (
        db.query(sa_func.count(User.id))
        .filter(User.created_at >= month_start)
        .scalar() or 0
    )

    # ---- 商品统计 ----
    total_products = db.query(sa_func.count(Product.id)).scalar() or 0
    on_sale_products = (
        db.query(sa_func.count(Product.id))
        .filter(Product.is_on_sale == True)
        .scalar() or 0
    )

    # ---- 订单统计 ----
    total_orders = db.query(sa_func.count(Order.id)).scalar() or 0
    today_orders = (
        db.query(sa_func.count(Order.id))
        .filter(Order.created_at >= today_start)
        .scalar() or 0
    )
    month_orders = (
        db.query(sa_func.count(Order.id))
        .filter(Order.created_at >= month_start)
        .scalar() or 0
    )

    # 各状态订单数
    order_status_counts = {}
    for status in OrderStatus:
        cnt = (
            db.query(sa_func.count(Order.id))
            .filter(Order.status == status.value)
            .scalar() or 0
        )
        order_status_counts[status.value] = cnt

    # ---- 营收统计 ----
    total_revenue = (
        db.query(sa_func.sum(Order.total_amount))
        .filter(Order.status.in_([
            OrderStatus.PAID.value,
            OrderStatus.SHIPPED.value,
            OrderStatus.COMPLETED.value,
        ]))
        .scalar()
    )
    today_revenue = (
        db.query(sa_func.sum(Order.total_amount))
        .filter(
            Order.created_at >= today_start,
            Order.status.in_([
                OrderStatus.PAID.value,
                OrderStatus.SHIPPED.value,
                OrderStatus.COMPLETED.value,
            ]),
        )
        .scalar()
    )
    month_revenue = (
        db.query(sa_func.sum(Order.total_amount))
        .filter(
            Order.created_at >= month_start,
            Order.status.in_([
                OrderStatus.PAID.value,
                OrderStatus.SHIPPED.value,
                OrderStatus.COMPLETED.value,
            ]),
        )
        .scalar()
    )

    # ---- 店铺/合伙人统计 ----
    total_stores = db.query(sa_func.count(Store.id)).scalar() or 0
    pending_stores = (
        db.query(sa_func.count(Store.id))
        .filter(Store.status == 0)
        .scalar() or 0
    )
    approved_stores = (
        db.query(sa_func.count(Store.id))
        .filter(Store.status == 1)
        .scalar() or 0
    )

    # ---- 钱包统计 ----
    total_wallet_balance = db.query(sa_func.sum(Wallet.balance)).scalar()

    # ---- 近7天订单趋势 ----
    recent_orders = []
    for i in range(6, -1, -1):
        day = (now - timedelta(days=i)).replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day + timedelta(days=1)
        cnt = (
            db.query(sa_func.count(Order.id))
            .filter(Order.created_at >= day, Order.created_at < day_end)
            .scalar() or 0
        )
        rev = (
            db.query(sa_func.sum(Order.total_amount))
            .filter(
                Order.created_at >= day,
                Order.created_at < day_end,
                Order.status.in_([
                    OrderStatus.PAID.value,
                    OrderStatus.SHIPPED.value,
                    OrderStatus.COMPLETED.value,
                ]),
            )
            .scalar()
        )
        recent_orders.append({
            "date": day.strftime("%Y-%m-%d"),
            "orders": cnt,
            "revenue": float(rev) if rev else 0,
        })

    data = {
        "users": {
            "total": total_users,
            "today_new": today_new_users,
            "month_new": month_new_users,
        },
        "products": {
            "total": total_products,
            "on_sale": on_sale_products,
        },
        "orders": {
            "total": total_orders,
            "today": today_orders,
            "month": month_orders,
            "by_status": order_status_counts,
        },
        "revenue": {
            "total": float(total_revenue) if total_revenue else 0,
            "today": float(today_revenue) if today_revenue else 0,
            "month": float(month_revenue) if month_revenue else 0,
        },
        "stores": {
            "total": total_stores,
            "pending": pending_stores,
            "approved": approved_stores,
        },
        "wallet": {
            "total_balance": float(total_wallet_balance) if total_wallet_balance else 0,
        },
        "recent_7days": recent_orders,
    }

    return ResponseSuccess(data=data)
