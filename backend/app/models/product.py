from sqlalchemy import Column, String, Integer, Text, Numeric, DateTime
from sqlalchemy.sql import func
from app.db.session import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    tag_line = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    nutrients = Column(Text, nullable=True)
    ingredients = Column(Text, nullable=True)
    retailer = Column(String(255), nullable=True, index=True)
    amount = Column(Integer, nullable=False, default=0)
    price = Column(Numeric(10, 2), nullable=False, default=0.00)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
