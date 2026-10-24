from sqlalchemy import Column, String, Integer, Text, DateTime
from sqlalchemy.sql import func
from app.db.session import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True, index=True)
    password = Column(String(255), nullable=False)
    gender = Column(String(50), nullable=True)
    age = Column(Integer, nullable=True)
    shipping_address = Column(Text, nullable=True)
    role = Column(String(50), nullable=False, default="client", index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
