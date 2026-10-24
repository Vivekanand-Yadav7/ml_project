"""Database migration runner.

Usage:
    python -m app.db.migrate up
    python -m app.db.migrate down
"""
import sys
from pathlib import Path
from sqlalchemy import text
from app.db.session import engine
from app.core.config import settings

MIGRATIONS_DIR = Path(__file__).resolve().parent.parent.parent / "migrations"


def run_migration(direction: str):
    if direction not in ("up", "down"):
        print(f"Error: Unknown direction '{direction}'. Use 'up' or 'down'.")
        sys.exit(1)

    if not engine or not settings.DATABASE_URL:
        print("Error: DATABASE_URL is not set or invalid in .env")
        sys.exit(1)

    sql_file = MIGRATIONS_DIR / f"001_initial_schema_{direction}.sql"
    if not sql_file.exists():
        print(f"Error: Migration file not found: {sql_file}")
        sys.exit(1)

    print(f"==> Running migration {direction.upper()} from {sql_file.name} ...")
    sql_script = sql_file.read_text(encoding="utf-8")

    try:
        with engine.begin() as conn:
            conn.execute(text(sql_script))
        print(f"Successfully applied migration: {sql_file.name}")
    except Exception as e:
        print(f"Migration failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    target = sys.argv[1].lower() if len(sys.argv) > 1 else "up"
    run_migration(target)
