from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Body, status

from app import schemas, models
from app.core import security
from app.core.config import settings
from app.schemas.response import ResponseSuccess

router = APIRouter()

@router.post("/login/wechat", response_model=ResponseSuccess[schemas.Token])
def login_wechat(
    code: str = Body(..., embed=True)
) -> Any:
    """
    微信小程序登录
    WeChat Mini Program login
    """
    # Mock login logic for now
    # 模拟登录逻辑
    # 1. Call WeChat API with code to get openid (调用微信API获取openid)
    # 2. Check if openid exists in DB (检查数据库中是否存在openid)
    # 3. If not, create user (如果不存在，创建用户)
    # 4. Return token (返回Token)
    
    # Mock user for testing
    # 模拟测试用户
    user = models.User(id=2, username="wechat_user", is_superuser=False)
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return ResponseSuccess(data={
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    })
