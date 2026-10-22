from fastapi import APIRouter
from app.controllers.health_controller import router as health_router

api_router = APIRouter()

# Mount controller routers
api_router.include_router(health_router)
