from typing import Optional, List, Union
from fastapi import APIRouter, Depends, Query, status, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.repositories.product_repository import ProductRepository
from app.services.product_service import ProductService
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse

router = APIRouter(prefix="/products", tags=["Products"])


def get_product_service(db: Session = Depends(get_db)) -> ProductService:
    repo = ProductRepository(db=db)
    return ProductService(product_repo=repo)


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product_in: ProductCreate,
    product_service: ProductService = Depends(get_product_service),
):
    """Create a new product item."""
    return product_service.create_product(product_in)


@router.get("", response_model=Union[ProductResponse, List[ProductResponse]])
def get_products(
    id: Optional[int] = Query(None, description="Optional product ID to retrieve a single item"),
    in_stock: bool = Query(False, description="Filter for products currently in stock"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    product_service: ProductService = Depends(get_product_service),
):
    """Get all products or single item if ?id is provided."""
    if id is not None:
        return product_service.get_by_id(id)
    return product_service.get_all(in_stock_only=in_stock, skip=skip, limit=limit)


@router.get("/{product_id}", response_model=ProductResponse)
def get_product_by_path(
    product_id: int,
    product_service: ProductService = Depends(get_product_service),
):
    """Get a product by its path ID."""
    return product_service.get_by_id(product_id)


@router.patch("", response_model=ProductResponse)
def update_product_by_query_id(
    update_in: ProductUpdate,
    id: Optional[int] = Query(None, description="Product ID to update"),
    product_service: ProductService = Depends(get_product_service),
):
    """Update a product via query param (?id=...)."""
    if id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing 'id' query parameter for product update.",
        )
    return product_service.update_product(id, update_in)


@router.patch("/{product_id}", response_model=ProductResponse)
def update_product_by_path(
    product_id: int,
    update_in: ProductUpdate,
    product_service: ProductService = Depends(get_product_service),
):
    """Update a product via path ID."""
    return product_service.update_product(product_id, update_in)


@router.delete("", status_code=status.HTTP_200_OK)
def delete_product_by_query_id(
    id: Optional[int] = Query(None, description="Product ID to delete"),
    product_service: ProductService = Depends(get_product_service),
):
    """Delete a product via query param (?id=...)."""
    if id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing 'id' query parameter for product deletion.",
        )
    product_service.delete_product(id)
    return {"message": f"Product {id} deleted successfully."}


@router.delete("/{product_id}", status_code=status.HTTP_200_OK)
def delete_product_by_path(
    product_id: int,
    product_service: ProductService = Depends(get_product_service),
):
    """Delete a product via path ID."""
    product_service.delete_product(product_id)
    return {"message": f"Product {product_id} deleted successfully."}
