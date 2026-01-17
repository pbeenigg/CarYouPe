from typing import Generic, TypeVar, Optional, Any
from pydantic import BaseModel

T = TypeVar("T")

class ResponseBase(BaseModel):
    """
    响应基础模型
    """
    code: int = 200        # 状态码
    message: str = "success" # 消息提示

class ResponseSuccess(ResponseBase, Generic[T]):
    """
    成功响应模型
    """
    data: Optional[T] = None # 响应数据

class ResponseError(ResponseBase):
    """
    错误响应模型
    """
    data: Optional[Any] = None # 错误详情数据
