from typing import Optional, List, Union
from fastapi import APIRouter, Depends, Query, status, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.repositories.user_repository import UserRepository
from app.services.user_service import UserService
from app.schemas.user import UserCreate, UserLogin, UserUpdate, UserResponse, UserAuthResponse

router = APIRouter(prefix="/users", tags=["Users"])


def get_user_service(db: Session = Depends(get_db)) -> UserService:
    repo = UserRepository(db=db)
    return UserService(user_repo=repo)


@router.post("", response_model=UserAuthResponse, status_code=status.HTTP_201_CREATED)
def register_user(
    user_in: UserCreate,
    user_service: UserService = Depends(get_user_service),
):
    """Register a new user account."""
    return user_service.register(user_in)


@router.post("/login", response_model=UserAuthResponse)
def login_user(
    login_data: UserLogin,
    user_service: UserService = Depends(get_user_service),
):
    """Authenticate user with email and password."""
    return user_service.login(login_data)


@router.get("", response_model=Union[UserResponse, List[UserResponse]])
def get_users(
    id: Optional[str] = Query(None, description="Optional user ID to retrieve single user"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    user_service: UserService = Depends(get_user_service),
):
    """Get all users or single user if ?id query param is supplied."""
    if id:
        return user_service.get_by_id(id)
    return user_service.get_all(skip=skip, limit=limit)


@router.get("/{user_id}", response_model=UserResponse)
def get_user_by_path_id(
    user_id: str,
    user_service: UserService = Depends(get_user_service),
):
    """Get single user by path ID."""
    return user_service.get_by_id(user_id)


@router.patch("", response_model=UserResponse)
def update_user_by_query_id(
    update_in: UserUpdate,
    id: Optional[str] = Query(None, description="User ID to update"),
    user_service: UserService = Depends(get_user_service),
):
    """Update user profile via query param (?id=...)."""
    if not id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing 'id' query parameter for user update.",
        )
    return user_service.update_user(id, update_in)


@router.patch("/{user_id}", response_model=UserResponse)
def update_user_by_path(
    user_id: str,
    update_in: UserUpdate,
    user_service: UserService = Depends(get_user_service),
):
    """Update user profile via path parameter."""
    return user_service.update_user(user_id, update_in)


@router.delete("", status_code=status.HTTP_200_OK)
def delete_user_by_query_id(
    id: Optional[str] = Query(None, description="User ID to delete"),
    user_service: UserService = Depends(get_user_service),
):
    """Delete user profile via query param (?id=...)."""
    if not id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing 'id' query parameter for user deletion.",
        )
    user_service.delete_user(id)
    return {"message": f"User {id} deleted successfully."}


@router.delete("/{user_id}", status_code=status.HTTP_200_OK)
def delete_user_by_path(
    user_id: str,
    user_service: UserService = Depends(get_user_service),
):
    """Delete user profile via path parameter."""
    user_service.delete_user(user_id)
    return {"message": f"User {user_id} deleted successfully."}
