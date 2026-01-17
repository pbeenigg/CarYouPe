# Import all the models, so that Base has them before being
# imported by Alembic
# 导入所有模型，以便 Base 在被 Alembic 导入之前拥有它们
from app.db.base_class import Base  # noqa
from app.models.user import User  # noqa
from app.models.role import Role, UserRole  # noqa
from app.models.menu import Menu  # noqa
from app.models.product import Product  # noqa
from app.models.order import Order, OrderItem # noqa
# Add other models here
# 在此处添加其他模型
