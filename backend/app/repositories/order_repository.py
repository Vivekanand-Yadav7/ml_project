from typing import List, Optional, Any, Dict
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models.order import Order
from app.repositories.base_repository import BaseRepository
from app.db.query_catalogue import order_queries


class OrderRepository(BaseRepository[Order]):
    """Order data access repository using centralized Query Catalogue."""

    def __init__(self, db: Session):
        super().__init__(model=Order, db=db)

    def get_by_id(self, id: Any) -> Optional[Order]:
        stmt = text(order_queries.GET_ORDER_BY_ID)
        res = self.db.execute(stmt, {"id": str(id)})
        row = res.mappings().first()
        return Order(**dict(row)) if row else None

    def get_with_details(self, id: Any) -> Optional[Dict[str, Any]]:
        stmt = text(order_queries.GET_ORDER_WITH_DETAILS)
        res = self.db.execute(stmt, {"id": str(id)})
        row = res.mappings().first()
        return dict(row) if row else None

    def get_by_client_id(self, client_id: str) -> List[Order]:
        stmt = text(order_queries.GET_ORDERS_BY_CLIENT)
        res = self.db.execute(stmt, {"client_id": client_id})
        rows = res.mappings().all()
        return [Order(**dict(row)) for row in rows]

    def get_by_retailer_id(self, retailer_id: str) -> List[Order]:
        stmt = text(order_queries.GET_ORDERS_BY_RETAILER)
        res = self.db.execute(stmt, {"retailer_id": retailer_id})
        rows = res.mappings().all()
        return [Order(**dict(row)) for row in rows]

    def get_by_user_id(self, user_id: str, skip: int = 0, limit: int = 100) -> List[Order]:
        stmt = text(order_queries.GET_ORDERS_BY_USER)
        res = self.db.execute(stmt, {"user_id": user_id, "limit": limit, "offset": skip})
        rows = res.mappings().all()
        return [Order(**dict(row)) for row in rows]

    def get_all(self, skip: int = 0, limit: int = 100) -> List[Order]:
        stmt = text(order_queries.GET_ALL_ORDERS)
        res = self.db.execute(stmt, {"limit": limit, "offset": skip})
        rows = res.mappings().all()
        return [Order(**dict(row)) for row in rows]

    def create(self, obj_in: Order) -> Order:
        stmt = text(order_queries.CREATE_ORDER)
        params = {
            "id": obj_in.id,
            "client_id": obj_in.client_id,
            "retailer_id": obj_in.retailer_id,
            "product_id": int(obj_in.product_id),
            "status": obj_in.status or "pending",
        }
        res = self.db.execute(stmt, params)
        row = res.mappings().first()
        self.db.commit()
        return Order(**dict(row)) if row else obj_in

    def update(self, db_obj: Order, obj_in: dict) -> Order:
        stmt = text(order_queries.UPDATE_ORDER_STATUS)
        params = {
            "id": db_obj.id,
            "status": obj_in.get("status"),
            "retailer_id": obj_in.get("retailer_id"),
            "product_id": int(obj_in["product_id"]) if "product_id" in obj_in and obj_in["product_id"] is not None else None,
        }
        res = self.db.execute(stmt, params)
        row = res.mappings().first()
        self.db.commit()
        return Order(**dict(row)) if row else db_obj

    def delete(self, id: Any) -> Optional[Order]:
        order = self.get_by_id(id)
        if order:
            stmt = text(order_queries.DELETE_ORDER)
            res = self.db.execute(stmt, {"id": str(id)})
            _ = res.mappings().first()
            self.db.commit()
        return order
