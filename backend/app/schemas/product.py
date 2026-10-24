from typing import Optional
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict


class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    tag_line: Optional[str] = None
    description: Optional[str] = None
    nutrients: Optional[str] = None
    ingredients: Optional[str] = None
    retailer: Optional[str] = None
    amount: int = Field(default=0, ge=0)
    price: Decimal = Field(default=Decimal("0.00"), ge=0)


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    tag_line: Optional[str] = None
    description: Optional[str] = None
    nutrients: Optional[str] = None
    ingredients: Optional[str] = None
    retailer: Optional[str] = None
    amount: Optional[int] = Field(None, ge=0)
    price: Optional[Decimal] = Field(None, ge=0)


class ProductResponse(ProductBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
