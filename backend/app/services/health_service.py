from app.repositories.health_repository import HealthRepository


class HealthService:
    def __init__(self, health_repo: HealthRepository):
        self.health_repo = health_repo

    def get_health_status(self) -> dict:
        db_connected = self.health_repo.check_database_connection()
        return {
            "status": "healthy" if db_connected else "degraded",
            "api": "operational",
            "database": "connected" if db_connected else "disconnected",
        }
