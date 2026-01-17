import os
import shutil
import uuid
from typing import Any
from fastapi import APIRouter, File, UploadFile
from app.core.config import settings
from app.schemas.response import ResponseSuccess
from app.core.exceptions import CustomException

router = APIRouter()

UPLOAD_DIR = "static/uploads"

@router.post("/upload", response_model=ResponseSuccess[dict])
async def upload_file(
    file: UploadFile = File(...)
) -> Any:
    """
    上传文件
    Upload a file.
    """
    if not os.path.exists(UPLOAD_DIR):
        os.makedirs(UPLOAD_DIR)

    # Validate file type (optional, e.g. images only)
    # 验证文件类型 (可选，例如仅限图片)
    if not file.content_type.startswith("image/"):
         raise CustomException(code=400, message="Invalid file type. Only images are allowed.") # 文件类型无效。仅允许图片。

    # Generate unique filename
    # 生成唯一文件名
    file_ext = os.path.splitext(file.filename)[1]
    filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Return the URL
    # Assuming static files are mounted at /static
    # 返回 URL (假设静态文件挂载在 /static)
    file_url = f"/static/uploads/{filename}"
    
    return ResponseSuccess(data={"url": file_url, "filename": filename})
