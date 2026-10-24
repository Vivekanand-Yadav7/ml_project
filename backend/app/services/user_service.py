import hashlib
import secrets
import uuid
from typing import Optional, List, Dict, Any
from fastapi import HTTPException, status
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate, UserUpdate, UserLogin


def _hash_password(password: str) -> str:
    # Deterministic SHA256 hashing for compatibility
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def _verify_password(plain_password: str, hashed_password: str) -> bool:
    return _hash_password(plain_password) == hashed_password


class UserService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    def register(self, user_in: UserCreate) -> Dict[str, Any]:
        normalized_email = user_in.email.lower().strip()
        existing = self.user_repo.get_by_email(normalized_email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A user with this email already exists.",
            )

        user_id = f"usr_{secrets.token_hex(6)}"
        hashed_pw = _hash_password(user_in.password)

        user_obj = User(
            id=user_id,
            name=user_in.name.strip(),
            email=normalized_email,
            password=hashed_pw,
            gender=user_in.gender,
            age=user_in.age,
            shipping_address=user_in.shipping_address,
            role=user_in.role or "client",
            image_url=user_in.image_url,
        )
        created = self.user_repo.create(user_obj)
        token = f"token_{secrets.token_urlsafe(24)}"
        return {"user": created, "token": token}

    def login(self, login_data: UserLogin) -> Dict[str, Any]:
        normalized_email = login_data.email.lower().strip()
        user = self.user_repo.get_by_email(normalized_email)
        if not user or not _verify_password(login_data.password, user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
            )
        token = f"token_{secrets.token_urlsafe(24)}"
        return {"user": user, "token": token}

    def get_by_id(self, user_id: str) -> User:
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with id '{user_id}' not found.",
            )
        return user

    def get_all(self, skip: int = 0, limit: int = 100) -> List[User]:
        return self.user_repo.get_all(skip=skip, limit=limit)

    def update_user(self, user_id: str, update_in: UserUpdate) -> User:
        user = self.get_by_id(user_id)
        update_dict = update_in.model_dump(exclude_unset=True)

        if "password" in update_dict and update_dict["password"]:
            update_dict["password"] = _hash_password(update_dict["password"])

        return self.user_repo.update(user, update_dict)

    def delete_user(self, user_id: str) -> None:
        user = self.get_by_id(user_id)
        self.user_repo.delete(user.id)
