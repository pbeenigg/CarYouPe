from fastapi import APIRouter
from app.schemas.response import ResponseSuccess

router = APIRouter()

@router.get("/", response_model=ResponseSuccess)
def get_client_home():
    """
    获取小程序首页数据
    """
    return ResponseSuccess(message="Mini Program Home", data={"status": "ok"})
