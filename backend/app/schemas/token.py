from typing import Optional
from pydantic import BaseModel

class Token(BaseModel):
    """
    Token 响应模型
    """
    access_token: str  # 访问令牌
    token_type: str    # 令牌类型 (Bearer)

class TokenPayload(BaseModel):
    """
    Token 载荷模型
    """
    sub: Optional[int] = None # 主题 (用户ID)
