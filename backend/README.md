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
│   │       └── router.py             # Route aggregator (mounts /users, /products, /orders)
│   ├── controllers/                  # Controller Layer (HTTP/Route Handlers)
│   │   ├── __init__.py
│   │   ├── health_controller.py
│   │   ├── user_controller.py
│   │   ├── product_controller.py
│   │   └── order_controller.py
│   ├── services/                     # Service Layer (Business Logic)
│   │   ├── __init__.py
│   │   ├── health_service.py
│   │   ├── user_service.py
│   │   ├── product_service.py
│   │   └── order_service.py
│   ├── repositories/                 # Repository Layer (Data Access / DB Queries)
│   │   ├── __init__.py
│   │   ├── base_repository.py
│   │   ├── health_repository.py
│   │   ├── user_repository.py
│   │   ├── product_repository.py
│   │   └── order_repository.py
│   ├── models/                       # SQLAlchemy Database Models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── product.py
│   │   └── order.py
│   ├── schemas/                      # Pydantic Schemas & DTOs
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── product.py
│   │   └── order.py
│   ├── middlewares/                  # Middlewares (Logging, Error handling)
│   │   ├── __init__.py
│   │   ├── logging_middleware.py
│   │   └── error_handler.py
│   ├── db/                           # Database engine, sessions & migration runner
│   │   ├── __init__.py
│   │   ├── session.py
│   │   └── migrate.py
│   ├── core/                         # Config & Settings
│   │   ├── __init__.py
│   │   └── config.py
│   ├── __init__.py
│   └── main.py                       # FastAPI application entry point
├── migrations/                       # PostgreSQL SQL Migrations
│   ├── 001_initial_schema_up.sql
│   └── 001_initial_schema_down.sql
├── .venv/                            # Virtual environment
├── .env                              # Environment variables (ignored by git)
├── .env.example                      # Example environment variables
├── requirements.txt                  # Python dependencies
└── README.md
```

## API Specification (Plural REST Resources)

### Users (`/api/v1/users`)
- `POST /api/v1/users` – Register new user
- `POST /api/v1/users/login` – Authenticate user
- `GET /api/v1/users` – List all users or get by `?id=` query parameter
- `GET /api/v1/users/{user_id}` – Get user by path ID
- `PATCH /api/v1/users/{user_id}` (or `PATCH /api/v1/users?id=`) – Update user profile
- `DELETE /api/v1/users/{user_id}` (or `DELETE /api/v1/users?id=`) – Delete user account

### Products (`/api/v1/products`)
- `POST /api/v1/products` – Create product
- `GET /api/v1/products` – List all products (supports `?in_stock=true` and `?id=`)
- `GET /api/v1/products/{product_id}` – Get product by path ID
- `PATCH /api/v1/products/{product_id}` (or `PATCH /api/v1/products?id=`) – Update product
- `DELETE /api/v1/products/{product_id}` (or `DELETE /api/v1/products?id=`) – Delete product

### Orders (`/api/v1/orders`)
- `POST /api/v1/orders` – Create order with dual FKs (`client_id`, `retailer_id`, `product_id`)
- `GET /api/v1/orders` – List orders (supports `?id=` for user orders or order ID lookup)
- `GET /api/v1/orders/{order_id}` – Get order by path ID
- `PATCH /api/v1/orders/{order_id}` (or `PATCH /api/v1/orders?id=`) – Update order status
- `DELETE /api/v1/orders/{order_id}` (or `DELETE /api/v1/orders?id=`) – Cancel order & restore inventory

## Getting Started

### 1. Activate the Virtual Environment

From the `backend` folder:
```bash
source .venv/bin/activate
```

### 2. Run Database Migrations

Apply the PostgreSQL schema (Up migration):
```bash
python -m app.db.migrate up
```

To roll back the schema (Down migration):
```bash
python -m app.db.migrate down
```

Raw PostgreSQL migration scripts are also available in `backend/migrations/`:
- `001_initial_schema_up.sql`
- `001_initial_schema_down.sql`

### 3. Run the Development Server

```bash
uvicorn app.main:app --reload --port 8000
```

The server will be available at:
- **Base URL**: http://localhost:8000
- **Interactive API Docs (Swagger UI)**: http://localhost:8000/docs
- **Alternative API Docs (ReDoc)**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/api/v1/health

