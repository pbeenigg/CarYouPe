from app.db.session import engine
from app.db.base import Base

def reset_db():
    print("Dropping all tables...") # 删除所有表...
    Base.metadata.drop_all(bind=engine)
    print("Creating all tables...") # 创建所有表...
    Base.metadata.create_all(bind=engine)
    print("Done.") # 完成。

if __name__ == "__main__":
    reset_db()
