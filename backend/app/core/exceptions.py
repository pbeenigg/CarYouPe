from typing import Any, Optional, Dict
from fastapi.requests import Request

class CustomException(Exception):
    """
    自定义异常基类
    """
    def __init__(
        self,
        code: int = 400,
        message: str = "Error",
        message_key: str = None,
        data: Optional[Any] = None
    ):
        self.code = code
        self.message = message
        self.message_key = message_key
        self.data = data

# Simple i18n map (mock)
# 简单的国际化映射 (模拟)
# In production, use standard gettext or load from json files based on request locale
# 生产环境中，请使用标准的 gettext 或根据请求 locale 加载 json 文件
I18N_MESSAGES = {
    "auth.failed": {"en": "Authentication failed", "zh": "认证失败"},
    "auth.inactive": {"en": "Inactive user", "zh": "用户未激活"},
    "perm.denied": {"en": "Permission denied", "zh": "权限不足"},
    "res.not_found": {"en": "Resource not found", "zh": "资源未找到"},
    "val.error": {"en": "Validation error", "zh": "验证错误"},
}

def get_message(key: str, request: Request = None, default: str = None) -> str:
    """
    获取国际化消息
    """
    # Try to get locale from header
    locale = "en"
    if request:
        # Simplified locale check
        accept_language = request.headers.get("accept-language")
        if accept_language and "zh" in accept_language:
            locale = "zh"
            
    if key in I18N_MESSAGES:
        return I18N_MESSAGES[key].get(locale, default or key)
    return default or key

class AuthException(CustomException):
    """
    认证异常
    """
    def __init__(self, message: str = "Authentication failed", message_key: str = "auth.failed", data: Any = None):
        super().__init__(code=401, message=message, message_key=message_key, data=data)

class PermissionException(CustomException):
    """
    权限异常
    """
    def __init__(self, message: str = "Permission denied", message_key: str = "perm.denied", data: Any = None):
        super().__init__(code=403, message=message, message_key=message_key, data=data)

class NotFoundException(CustomException):
    """
    资源未找到异常
    """
    def __init__(self, message: str = "Resource not found", message_key: str = "res.not_found", data: Any = None):
        super().__init__(code=404, message=message, message_key=message_key, data=data)

class ValidationException(CustomException):
    """
    验证异常
    """
    def __init__(self, message: str = "Validation error", message_key: str = "val.error", data: Any = None):
        super().__init__(code=422, message=message, message_key=message_key, data=data)
