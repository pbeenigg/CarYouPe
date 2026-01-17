from typing import Any
from sqlalchemy.ext.declarative import as_declarative, declared_attr

@as_declarative()
class Base:
    """
    SQLAlchemy 声明式基类
    """
    id: Any
    __name__: str

    # Generate __tablename__ automatically
    # 自动生成 __tablename__
    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower()
