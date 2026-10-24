from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.product import Product
from app.repositories.base_repository import BaseRepository


class ProductRepository(BaseRepository[Product]):
    def __init__(self, db: Session):
        super().__init__(model=Product, db=db)

    def get_in_stock(self) -> List[Product]:
        stmt = select(Product).where(Product.amount > 0)
        return list(self.db.scalars(stmt).all())

    def get_by_retailer(self, retailer: str) -> List[Product]:
        stmt = select(Product).where(Product.retailer == retailer)
        return list(self.db.scalars(stmt).all())
