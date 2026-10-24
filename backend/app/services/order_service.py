import secrets
from typing import List, Optional
from fastapi import HTTPException, status
from app.models.order import Order
from app.repositories.order_repository import OrderRepository
from app.repositories.user_repository import UserRepository
from app.repositories.product_repository import ProductRepository
from app.schemas.order import OrderCreate, OrderUpdate


class OrderService:
    def __init__(
        self,
        order_repo: OrderRepository,
        user_repo: UserRepository,
        product_repo: ProductRepository,
    ):
        self.order_repo = order_repo
        self.user_repo = user_repo
        self.product_repo = product_repo

    def create_order(self, order_in: OrderCreate) -> Order:
        client_id = order_in.client_id or order_in.ordered_by
        if not client_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Order must include 'client_id' (or 'ordered_by').",
            )

        # Validate product
        product = self.product_repo.get_by_id(order_in.product_id)
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with id {order_in.product_id} not found.",
            )

        if product.amount <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Product is currently out of stock.",
            )

        # Validate client
        client = self.user_repo.get_by_id(client_id)
        if not client:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Client user '{client_id}' does not exist.",
            )

        # Validate or determine retailer
        retailer_id = order_in.retailer_id
        if not retailer_id:
            # Check if there is a retailer user matching the product.retailer name or any retailer
            if product.retailer:
                # Look for retailer user by name or email
                retailers = [u for u in self.user_repo.get_all() if u.role == "retailer"]
                matching = next((r for r in retailers if r.name.lower() == product.retailer.lower()), None)
                if matching:
                    retailer_id = matching.id
                elif retailers:
                    retailer_id = retailers[0].id
            if not retailer_id:
                # If still not found, check if any retailer user exists
                retailers = [u for u in self.user_repo.get_all() if u.role == "retailer"]
                if retailers:
                    retailer_id = retailers[0].id
                else:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Order requires a valid 'retailer_id'. No retailer found.",
                    )
        else:
            retailer = self.user_repo.get_by_id(retailer_id)
            if not retailer:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Retailer user '{retailer_id}' does not exist.",
                )

        # Decrement product stock
        self.product_repo.update(product, {"amount": product.amount - 1})

        order_id = f"ord_{secrets.token_hex(4)}"
        order = Order(
            id=order_id,
            client_id=client_id,
            retailer_id=retailer_id,
            product_id=product.id,
            status=order_in.status or "pending",
            image_url=order_in.image_url,
        )
        return self.order_repo.create(order)

    def get_by_id(self, order_id: str) -> Order:
        order = self.order_repo.get_by_id(order_id)
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Order with id '{order_id}' not found.",
            )
        return order

    def get_orders(self, user_id: Optional[str] = None, skip: int = 0, limit: int = 100) -> List[Order]:
        if user_id:
            # Check if user has orders as client or as retailer
            client_orders = self.order_repo.get_by_client_id(user_id)
            retailer_orders = self.order_repo.get_by_retailer_id(user_id)
            combined = {o.id: o for o in (client_orders + retailer_orders)}.values()
            return sorted(list(combined), key=lambda x: x.created_at, reverse=True)
        return self.order_repo.get_all(skip=skip, limit=limit)

    def update_order(self, order_id: str, update_in: OrderUpdate) -> Order:
        order = self.get_by_id(order_id)
        update_dict = update_in.model_dump(exclude_unset=True)
        return self.order_repo.update(order, update_dict)

    def delete_order(self, order_id: str) -> None:
        order = self.get_by_id(order_id)
        # Restore stock on cancellation
        product = self.product_repo.get_by_id(order.product_id)
        if product:
            self.product_repo.update(product, {"amount": product.amount + 1})
        self.order_repo.delete(order.id)
