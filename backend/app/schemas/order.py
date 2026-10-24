from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict, model_validator


class OrderBase(BaseModel):
    product_id: int
    status: str = Field(default="pending", max_length=50)
    image_url: Optional[str] = None


class OrderCreate(BaseModel):
    product_id: int
    client_id: Optional[str] = None
    ordered_by: Optional[str] = None
    retailer_id: Optional[str] = None
    status: Optional[str] = "pending"
    image_url: Optional[str] = None

    @model_validator(mode="after")
    def validate_client(self):
        # Normalize ordered_by into client_id
        if not self.client_id and self.ordered_by:
            self.client_id = self.ordered_by
        return self


class OrderUpdate(BaseModel):
    status: Optional[str] = None
    retailer_id: Optional[str] = None
    product_id: Optional[int] = None
    image_url: Optional[str] = None


class OrderResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    client_id: str
    retailer_id: str
    product_id: int
    status: str
    image_url: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    # Computed alias for frontend backwards compatibility
    @property
    def ordered_by(self) -> str:
        return self.client_id
