from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.repositories.health_repository import HealthRepository
from app.services.health_service import HealthService

router = APIRouter(prefix="/health", tags=["Health"])


def get_health_service(db: Session = Depends(get_db)) -> HealthService:
    health_repo = HealthRepository(db=db)
    return HealthService(health_repo=health_repo)


@router.get("")
def check_health(health_service: HealthService = Depends(get_health_service)):
    """Health check endpoint demonstrating Controller -> Service -> Repository flow."""
    return health_service.get_health_status()
