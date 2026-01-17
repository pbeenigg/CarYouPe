import hashlib
import json
from functools import wraps
from typing import Callable
from fastapi import Request, HTTPException
from app.core.cache import redis_client
from app.core.exceptions import CustomException

def idempotent(expire: int = 60):
    """
    幂等性装饰器
    防止在 `expire` 秒内重复提交请求。
    Key 是基于用户ID（如果已登录）、URL、方法生成的。
    """
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(request: Request, *args, **kwargs):
            # 1. 识别用户 (Identify User)
            user_id = "guest"
            if hasattr(request.state, "user"):
                user_id = str(request.state.user.id)
            elif "authorization" in request.headers:
                # 尝试粗略提取 token，或者依赖后续中间件的 IP/UA
                # Try to extract from token roughly if not parsed yet
                pass
            
            # 2. 生成 Key (Generate Key)
            # 我们需要读取 body，但读取它会消耗流。
            # FastAPI 允许小心处理重读，但在中间件/装饰器中比较棘手。
            # 为简单起见，我们使用 URL + Method + UserID。
            # 理想情况下，对于 POST/PUT 应该包含 body 的哈希。
            
            # 注意：在真实的 endpoint 中，body 已经被解析为 pydantic 模型在 args/kwargs 中。
            # 但装饰器运行在 endpoint 之前。
            
            key_data = f"{user_id}:{request.method}:{request.url.path}"
            key = f"idempotent:{hashlib.md5(key_data.encode()).hexdigest()}"
            
            # 3. 检查缓存 (Check Cache)
            if redis_client.exists(key):
                raise CustomException(code=429, message="Duplicate request, please try again later.") # 重复请求，请稍后再试
            
            # 4. 设置缓存 (Set Cache)
            redis_client.set(key, "1", ex=expire)
            
            return await func(request, *args, **kwargs)
        return wrapper
    return decorator
