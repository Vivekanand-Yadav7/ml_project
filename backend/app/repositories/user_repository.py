from typing import Optional, List, Any
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models.user import User
from app.repositories.base_repository import BaseRepository
from app.db.query_catalogue import user_queries


class UserRepository(BaseRepository[User]):
    """User data access repository using centralized Query Catalogue."""

    def __init__(self, db: Session):
        super().__init__(model=User, db=db)

    def get_by_email(self, email: str) -> Optional[User]:
        stmt = text(user_queries.GET_USER_BY_EMAIL)
        res = self.db.execute(stmt, {"email": email.lower().strip()})
        row = res.mappings().first()
        return User(**dict(row)) if row else None

    def get_by_id(self, id: Any) -> Optional[User]:
        stmt = text(user_queries.GET_USER_BY_ID)
        res = self.db.execute(stmt, {"id": str(id)})
        row = res.mappings().first()
        return User(**dict(row)) if row else None

    def get_all(self, skip: int = 0, limit: int = 100) -> List[User]:
        stmt = text(user_queries.GET_ALL_USERS)
        res = self.db.execute(stmt, {"limit": limit, "offset": skip})
        rows = res.mappings().all()
        return [User(**dict(row)) for row in rows]

    def create(self, obj_in: User) -> User:
        stmt = text(user_queries.CREATE_USER)
        params = {
            "id": obj_in.id,
            "name": obj_in.name,
            "email": obj_in.email,
            "password": obj_in.password,
            "gender": obj_in.gender,
            "age": obj_in.age,
            "shipping_address": obj_in.shipping_address,
            "role": obj_in.role or "client",
        }
        res = self.db.execute(stmt, params)
        row = res.mappings().first()
        self.db.commit()
        return User(**dict(row)) if row else obj_in

    def update(self, db_obj: User, obj_in: dict) -> User:
        stmt = text(user_queries.UPDATE_USER)
        params = {
            "id": db_obj.id,
            "name": obj_in.get("name"),
            "password": obj_in.get("password"),
            "gender": obj_in.get("gender"),
            "age": obj_in.get("age"),
            "shipping_address": obj_in.get("shipping_address"),
            "role": obj_in.get("role"),
        }
        res = self.db.execute(stmt, params)
        row = res.mappings().first()
        self.db.commit()
        return User(**dict(row)) if row else db_obj

    def delete(self, id: Any) -> Optional[User]:
        user = self.get_by_id(id)
        if user:
            stmt = text(user_queries.DELETE_USER)
            res = self.db.execute(stmt, {"id": str(id)})
            _ = res.mappings().first()
            self.db.commit()
        return user
