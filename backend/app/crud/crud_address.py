from typing import List
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.address import Address
from app.schemas.address import AddressCreate, AddressUpdate

class CRUDAddress(CRUDBase[Address, AddressCreate, AddressUpdate]):
    """
    地址 CRUD 操作
    """
    def get_by_user(
        self, db: Session, *, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[Address]:
        """
        获取指定用户的地址列表
        """
        return (
            db.query(self.model)
            .filter(Address.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def set_default(self, db: Session, *, address_id: int, user_id: int) -> Address:
        """
        设置默认地址，同时取消该用户其他默认地址
        """
        # 取消所有默认
        db.query(self.model).filter(
            Address.user_id == user_id,
            Address.is_default == True
        ).update({"is_default": False})
        # 设置新默认
        address = db.query(self.model).filter(Address.id == address_id).first()
        address.is_default = True
        db.add(address)
        db.commit()
        db.refresh(address)
        return address

address = CRUDAddress(Address)
