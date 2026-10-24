from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

EMAIL_REGEX = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"


class UserBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    email: str = Field(..., pattern=EMAIL_REGEX)
    gender: Optional[str] = Field(None, max_length=50)
    age: Optional[int] = Field(None, ge=0, le=150)
    shipping_address: Optional[str] = None
    role: str = Field(default="client", max_length=50)
    image_url: Optional[str] = None


class UserCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    email: str = Field(..., pattern=EMAIL_REGEX)
    password: str = Field(..., min_length=4, max_length=255)
    gender: Optional[str] = None
    age: Optional[int] = None
    shipping_address: Optional[str] = None
    role: Optional[str] = "client"
    image_url: Optional[str] = None


class UserLogin(BaseModel):
    email: str = Field(..., pattern=EMAIL_REGEX)
    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    password: Optional[str] = None
    gender: Optional[str] = None
    age: Optional[int] = None
    shipping_address: Optional[str] = None
    role: Optional[str] = None
    image_url: Optional[str] = None


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    email: str
    gender: Optional[str] = None
    age: Optional[int] = None
    shipping_address: Optional[str] = None
    role: str
    image_url: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class UserAuthResponse(BaseModel):
    user: UserResponse
    token: str
