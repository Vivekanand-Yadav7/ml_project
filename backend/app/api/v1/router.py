from fastapi import APIRouter
from app.controllers.health_controller import router as health_router
from app.controllers.user_controller import router as user_router
from app.controllers.product_controller import router as product_router
from app.controllers.order_controller import router as order_router
from app.controllers.upload_controller import router as upload_router

api_router = APIRouter()

# Mount plural RESTful resources
api_router.include_router(health_router)
api_router.include_router(user_router)
api_router.include_router(product_router)
api_router.include_router(order_router)
api_router.include_router(upload_router)
