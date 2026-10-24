from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.order import Order
from app.repositories.base_repository import BaseRepository


class OrderRepository(BaseRepository[Order]):
    def __init__(self, db: Session):
        super().__init__(model=Order, db=db)

    def get_by_client_id(self, client_id: str) -> List[Order]:
        stmt = select(Order).where(Order.client_id == client_id).order_by(Order.created_at.desc())
        return list(self.db.scalars(stmt).all())

    def get_by_retailer_id(self, retailer_id: str) -> List[Order]:
        stmt = select(Order).where(Order.retailer_id == retailer_id).order_by(Order.created_at.desc())
        return list(self.db.scalars(stmt).all())
