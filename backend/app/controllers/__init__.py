"""Controllers package for HTTP request handling."""
from app.controllers.health_controller import router as health_router

__all__ = ["health_router"]
