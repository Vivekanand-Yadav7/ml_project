# Backend (FastAPI)

FastAPI backend service with layered 3-tier architecture (Controllers, Services, Repositories) and dedicated Middlewares.

## Architecture

- **`controllers/`**: HTTP layer. Handles requests, calls appropriate services, formats responses, and handles status codes.
- **`services/`**: Business logic layer. Contains business rules, validations, orchestrates data from repositories, and keeps business rules independent of HTTP or database specifics.
- **`repositories/`**: Data access layer. Handles database queries, CRUD operations, transactions, and interacts with PostgreSQL via SQLAlchemy.
- **`middlewares/`**: Request pipeline processing. Handles logging, response time headers, and global exception handling.
- **`db/`**: Database engine and session lifecycle management (`get_db`).
- **`core/`**: Configuration, environment settings, and CORS policies.

## Directory Structure

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── __init__.py
│   │       └── router.py             # Route aggregator
│   ├── controllers/                  # Controller Layer (HTTP/Route Handlers)
│   │   ├── __init__.py
│   │   └── health_controller.py
│   ├── services/                     # Service Layer (Business Logic)
│   │   ├── __init__.py
│   │   └── health_service.py
│   ├── repositories/                 # Repository Layer (Data Access / DB Queries)
│   │   ├── __init__.py
│   │   ├── base_repository.py
│   │   └── health_repository.py
│   ├── middlewares/                  # Middlewares (Logging, Error handling)
│   │   ├── __init__.py
│   │   ├── logging_middleware.py
│   │   └── error_handler.py
│   ├── db/                           # Database engine and sessions
│   │   ├── __init__.py
│   │   └── session.py
│   ├── core/                         # Config & Settings
│   │   ├── __init__.py
│   │   └── config.py
│   ├── __init__.py
│   └── main.py                       # FastAPI application entry point
├── .venv/                            # Virtual environment
├── .env                              # Environment variables (ignored by git)
├── .env.example                      # Example environment variables
├── requirements.txt                  # Python dependencies
└── README.md
```

## Getting Started

### 1. Activate the Virtual Environment

From the `backend` folder:
```bash
source .venv/bin/activate
```

### 2. Run the Development Server

```bash
uvicorn app.main:app --reload --port 8000
```

The server will be available at:
- **Base URL**: http://localhost:8000
- **Interactive API Docs (Swagger UI)**: http://localhost:8000/docs
- **Alternative API Docs (ReDoc)**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/api/v1/health
