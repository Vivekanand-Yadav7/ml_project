from typing import List, Optional, Any
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models.product import Product
from app.repositories.base_repository import BaseRepository
from app.db.query_catalogue import product_queries


class ProductRepository(BaseRepository[Product]):
    """Product data access repository using centralized Query Catalogue."""

    def __init__(self, db: Session):
        super().__init__(model=Product, db=db)

    def get_by_id(self, id: Any) -> Optional[Product]:
        stmt = text(product_queries.GET_PRODUCT_BY_ID)
        res = self.db.execute(stmt, {"id": int(id)})
        row = res.mappings().first()
        return Product(**dict(row)) if row else None

    def get_all(self, skip: int = 0, limit: int = 100) -> List[Product]:
        stmt = text(product_queries.GET_ALL_PRODUCTS)
        res = self.db.execute(stmt, {"limit": limit, "offset": skip})
        rows = res.mappings().all()
        return [Product(**dict(row)) for row in rows]

    def get_in_stock(self) -> List[Product]:
        stmt = text(product_queries.GET_IN_STOCK_PRODUCTS)
        res = self.db.execute(stmt)
        rows = res.mappings().all()
        return [Product(**dict(row)) for row in rows]

    def get_by_retailer(self, retailer: str) -> List[Product]:
        stmt = text(product_queries.GET_PRODUCTS_BY_RETAILER)
        res = self.db.execute(stmt, {"retailer": retailer})
        rows = res.mappings().all()
        return [Product(**dict(row)) for row in rows]

    def create(self, obj_in: Product) -> Product:
        stmt = text(product_queries.CREATE_PRODUCT)
        params = {
            "name": obj_in.name,
            "tag_line": obj_in.tag_line,
            "description": obj_in.description,
            "nutrients": obj_in.nutrients,
            "ingredients": obj_in.ingredients,
            "retailer": obj_in.retailer,
            "amount": obj_in.amount,
            "price": float(obj_in.price),
        }
        res = self.db.execute(stmt, params)
        row = res.mappings().first()
        self.db.commit()
        return Product(**dict(row)) if row else obj_in

    def update(self, db_obj: Product, obj_in: dict) -> Product:
        stmt = text(product_queries.UPDATE_PRODUCT)
        params = {
            "id": db_obj.id,
            "name": obj_in.get("name"),
            "tag_line": obj_in.get("tag_line"),
            "description": obj_in.get("description"),
            "nutrients": obj_in.get("nutrients"),
            "ingredients": obj_in.get("ingredients"),
            "retailer": obj_in.get("retailer"),
            "amount": obj_in.get("amount"),
            "price": float(obj_in["price"]) if "price" in obj_in and obj_in["price"] is not None else None,
        }
        res = self.db.execute(stmt, params)
        row = res.mappings().first()
        self.db.commit()
        return Product(**dict(row)) if row else db_obj

    def adjust_stock(self, product_id: int, delta: int) -> bool:
        stmt = text(product_queries.ADJUST_PRODUCT_STOCK)
        res = self.db.execute(stmt, {"id": product_id, "delta": delta})
        row = res.mappings().first()
        self.db.commit()
        return row is not None

    def delete(self, id: Any) -> Optional[Product]:
        product = self.get_by_id(id)
        if product:
            stmt = text(product_queries.DELETE_PRODUCT)
            res = self.db.execute(stmt, {"id": int(id)})
            _ = res.mappings().first()
            self.db.commit()
        return product
