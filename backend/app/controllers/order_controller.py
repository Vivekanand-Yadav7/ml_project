from typing import Optional, List, Union
from fastapi import APIRouter, Depends, Query, status, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.repositories.order_repository import OrderRepository
from app.repositories.user_repository import UserRepository
from app.repositories.product_repository import ProductRepository
from app.services.order_service import OrderService
from app.schemas.order import OrderCreate, OrderUpdate, OrderResponse

router = APIRouter(prefix="/orders", tags=["Orders"])


def get_order_service(db: Session = Depends(get_db)) -> OrderService:
    order_repo = OrderRepository(db=db)
    user_repo = UserRepository(db=db)
    product_repo = ProductRepository(db=db)
    return OrderService(order_repo=order_repo, user_repo=user_repo, product_repo=product_repo)


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    order_in: OrderCreate,
    order_service: OrderService = Depends(get_order_service),
):
    """Place a new order with dual foreign keys for client and retailer."""
    return order_service.create_order(order_in)


@router.get("", response_model=Union[OrderResponse, List[OrderResponse]])
def get_orders(
    id: Optional[str] = Query(None, description="Order ID or User ID"),
    user_id: Optional[str] = Query(None, description="Filter orders by User (Client or Retailer) ID"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    order_service: OrderService = Depends(get_order_service),
):
    """Get all orders, or orders for a specific user or specific order ID."""
    query_target = user_id or id
    if query_target:
        # Check if query_target is an order ID directly
        try:
            return order_service.get_by_id(query_target)
        except HTTPException:
            # If not an order ID, treat as user_id to return orders for this user
            return order_service.get_orders(user_id=query_target, skip=skip, limit=limit)
    return order_service.get_orders(skip=skip, limit=limit)


@router.get("/{order_id}", response_model=OrderResponse)
def get_order_by_path(
    order_id: str,
    order_service: OrderService = Depends(get_order_service),
):
    """Get single order by path ID."""
    return order_service.get_by_id(order_id)


@router.patch("", response_model=OrderResponse)
def update_order_by_query_id(
    update_in: OrderUpdate,
    id: Optional[str] = Query(None, description="Order ID to update"),
    order_service: OrderService = Depends(get_order_service),
):
    """Update order status via query param (?id=...)."""
    if not id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing 'id' query parameter for order update.",
        )
    return order_service.update_order(id, update_in)


@router.patch("/{order_id}", response_model=OrderResponse)
def update_order_by_path(
    order_id: str,
    update_in: OrderUpdate,
    order_service: OrderService = Depends(get_order_service),
):
    """Update order status via path parameter."""
    return order_service.update_order(order_id, update_in)


@router.delete("", status_code=status.HTTP_200_OK)
def delete_order_by_query_id(
    id: Optional[str] = Query(None, description="Order ID to delete"),
    order_service: OrderService = Depends(get_order_service),
):
    """Cancel / delete order via query param (?id=...)."""
    if not id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing 'id' query parameter for order deletion.",
        )
    order_service.delete_order(id)
    return {"message": f"Order {id} cancelled and deleted successfully."}


@router.delete("/{order_id}", status_code=status.HTTP_200_OK)
def delete_order_by_path(
    order_id: str,
    order_service: OrderService = Depends(get_order_service),
):
    """Cancel / delete order via path parameter."""
    order_service.delete_order(order_id)
    return {"message": f"Order {order_id} cancelled and deleted successfully."}
