"""Centralized Database Query Catalogue Package.

Exports parameterized SQL queries organized by domain:
- user_queries: User authentication, registration, profiles
- product_queries: Product catalog, stock filters, inventory adjustments
- order_queries: Order placement, dual foreign keys, relations joins
- trigger_queries: Trigger functions and database automation
"""
from app.db.query_catalogue import user_queries
from app.db.query_catalogue import product_queries
from app.db.query_catalogue import order_queries
from app.db.query_catalogue import trigger_queries

__all__ = [
    "user_queries",
    "product_queries",
    "order_queries",
    "trigger_queries",
]
