from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from fastapi_cache.backends.inmemory import InMemoryBackend
from redis import asyncio as aioredis

from app.api.api_v1.api import api_router
from app.core.config import settings
from app.core.exceptions import CustomException, get_message
from app.schemas.response import ResponseError

app = FastAPI(
    title=settings.PROJECT_NAME, 
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Startup Event for Cache
# 缓存启动事件
@app.on_event("startup")
async def startup():
    # In production: redis_url = f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}"
    # r = aioredis.from_url(redis_url, encoding="utf8", decode_responses=True)
    # FastAPICache.init(RedisBackend(r), prefix="fastapi-cache")
    
    # Fallback to InMemory for dev environment without Redis
    # 开发环境无 Redis 时回退到内存后端
    FastAPICache.init(InMemoryBackend(), prefix="fastapi-cache")

# Global Exception Handlers
# 全局异常处理
@app.exception_handler(CustomException)
async def custom_exception_handler(request: Request, exc: CustomException):
    # Translate message if key exists
    # 如果存在 key，翻译消息
    message = exc.message
    if exc.message_key:
        message = get_message(exc.message_key, request, default=exc.message)
        
    return JSONResponse(
        status_code=200, # Always return 200 for business logic errors, frontend checks 'code' # 业务逻辑错误始终返回 200，前端检查 'code'
        content=ResponseError(code=exc.code, message=message, data=exc.data).model_dump(),
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content=ResponseError(code=422, message="Validation Error", data=exc.errors()).model_dump(),
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # In production, log the error here
    # 生产环境中在此处记录错误日志
    print(f"Global Exception: {exc}")
    return JSONResponse(
        status_code=500,
        content=ResponseError(code=500, message="Internal Server Error").model_dump(),
    )

# Set all CORS enabled origins
# 启用所有 CORS 源
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8080"], # Frontend URL # 前端地址
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

# Mount static files
# 挂载静态文件
import os
if not os.path.exists("static"):
    os.makedirs("static")
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def root():
    return {"message": "Welcome to CarYouPe API"}
