from typing import Optional, Dict, Any
from pydantic import validator
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """
    应用配置类
    """
    PROJECT_NAME: str = "CarYouPe API" # 项目名称
    API_V1_STR: str = "/api/v1"        # API 前缀
    
    # Security (安全配置)
    SECRET_KEY: str = "changethis_to_a_secure_secret_key_in_production" # 密钥，生产环境请修改
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8 # Access Token 过期时间 (8天)
    
    # Database (数据库配置)
    POSTGRES_SERVER: str = "localhost:15432" # 数据库地址
    POSTGRES_USER: str = "postgres"          # 数据库用户名
    POSTGRES_PASSWORD: str = "postgres"      # 数据库密码
    POSTGRES_DB: str = "caryoupe"            # 数据库名
    SQLALCHEMY_DATABASE_URI: Optional[str] = None # 数据库连接URI

    @validator("SQLALCHEMY_DATABASE_URI", pre=True)
    def assemble_db_connection(cls, v: Optional[str], values: Dict[str, Any]) -> Any:
        """
        组装数据库连接 URI
        """
        if isinstance(v, str):
            return v
        return f"postgresql://{values.get('POSTGRES_USER')}:{values.get('POSTGRES_PASSWORD')}@{values.get('POSTGRES_SERVER')}/{values.get('POSTGRES_DB')}"

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
