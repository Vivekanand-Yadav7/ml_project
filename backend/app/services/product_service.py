from typing import List, Optional
from fastapi import HTTPException, status
from app.models.product import Product
from app.repositories.product_repository import ProductRepository
from app.schemas.product import ProductCreate, ProductUpdate


class ProductService:
    def __init__(self, product_repo: ProductRepository):
        self.product_repo = product_repo

    def create_product(self, product_in: ProductCreate) -> Product:
        product = Product(
            name=product_in.name.strip(),
            tag_line=product_in.tag_line,
            description=product_in.description,
            nutrients=product_in.nutrients,
            ingredients=product_in.ingredients,
            retailer=product_in.retailer,
            amount=product_in.amount,
            price=product_in.price,
        )
        return self.product_repo.create(product)

    def get_all(self, in_stock_only: bool = False, skip: int = 0, limit: int = 100) -> List[Product]:
        if in_stock_only:
            return self.product_repo.get_in_stock()
        return self.product_repo.get_all(skip=skip, limit=limit)

    def get_by_id(self, product_id: int) -> Product:
        product = self.product_repo.get_by_id(product_id)
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with id {product_id} not found.",
            )
        return product

    def update_product(self, product_id: int, update_in: ProductUpdate) -> Product:
        product = self.get_by_id(product_id)
        update_dict = update_in.model_dump(exclude_unset=True)
        return self.product_repo.update(product, update_dict)

    def delete_product(self, product_id: int) -> None:
        product = self.get_by_id(product_id)
        self.product_repo.delete(product.id)
