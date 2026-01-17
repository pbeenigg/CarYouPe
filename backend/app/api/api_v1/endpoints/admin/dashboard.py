from fastapi import APIRouter
from app.schemas.response import ResponseSuccess

router = APIRouter()

@router.get("/", response_model=ResponseSuccess)
def get_admin_dashboard():
    """
    获取管理后台仪表盘数据
    """
    return ResponseSuccess(message="Admin Dashboard", data={"status": "ok"})
