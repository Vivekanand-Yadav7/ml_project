# Backend (FastAPI)

FastAPI backend service with layered 3-tier architecture (Controllers, Services, Repositories) and dedicated Middlewares.

## Architecture

- **`controllers/`**: HTTP layer. Handles requests, calls appropriate services, formats responses, and handles status codes.
- **`services/`**: Business logic layer. Contains business rules, validations, orchestrates data from repositories, and keeps business rules independent of HTTP or database specifics.
- **`repositories/`**: Data access layer. Executes queries, manages transactions, and interfaces with PostgreSQL.
- **`db/query_catalogue/`**: Centralized SQL Query Catalogue. Single source of truth for all parameterized SQL statements, joins, triggers, and cascading rules across the domain.
- **`middlewares/`**: Request pipeline processing. Handles logging, response time headers, and global exception handling.
- **`db/`**: Database engine, session lifecycle (`get_db`), and migrations.
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
│   ├── repositories/                 # Repository Layer (Executes Query Catalogue queries)
│   │   ├── __init__.py
│   │   ├── base_repository.py
│   │   ├── health_repository.py
│   │   ├── user_repository.py
│   │   ├── product_repository.py
│   │   └── order_repository.py
│   ├── db/
│   │   ├── query_catalogue/          # Centralized Query Catalogue (SQL Reference & Queries)
│   │   │   ├── __init__.py
│   │   │   ├── user_queries.py       # Parametrized user SQL queries
│   │   │   ├── product_queries.py    # Parametrized product & stock queries
│   │   │   ├── order_queries.py      # Dual-FK order queries & rich joins
│   │   │   └── trigger_queries.py    # Trigger definitions & inventory guards
│   │   ├── __init__.py
│   │   ├── session.py
│   │   └── migrate.py
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
- `POST /api/v1/users` – Register new user (accepts `name`, `email`, `password`, `image_url`, `role`, etc.)
- `POST /api/v1/users/login` – Authenticate user
- `GET /api/v1/users` – List all users or get by `?id=` query parameter
- `GET /api/v1/users/{user_id}` – Get user by path ID
- `PATCH /api/v1/users/{user_id}` (or `PATCH /api/v1/users?id=`) – Update user profile (including `image_url`)
- `DELETE /api/v1/users/{user_id}` (or `DELETE /api/v1/users?id=`) – Delete user account

### Products (`/api/v1/products`)
- `POST /api/v1/products` – Create product
- `GET /api/v1/products` – List all products (supports `?in_stock=true` and `?id=`)
- `GET /api/v1/products/{product_id}` – Get product by path ID
- `PATCH /api/v1/products/{product_id}` (or `PATCH /api/v1/products?id=`) – Update product
- `DELETE /api/v1/products/{product_id}` (or `DELETE /api/v1/products?id=`) – Delete product

### Orders (`/api/v1/orders`)
- `POST /api/v1/orders` – Create order with dual FKs (`client_id`, `retailer_id`, `product_id`, and optional `image_url`)
- `GET /api/v1/orders` – List orders (supports `?id=` for user orders or order ID lookup)
- `GET /api/v1/orders/{order_id}` – Get order by path ID
- `PATCH /api/v1/orders/{order_id}` (or `PATCH /api/v1/orders?id=`) – Update order status or `image_url`
- `DELETE /api/v1/orders/{order_id}` (or `DELETE /api/v1/orders?id=`) – Cancel order & restore inventory

### Uploads (`/api/v1/upload`)
- `POST /api/v1/upload/image` – Upload image to Cloudinary (supports JPEG, PNG, WebP up to 5MB, returns `{ "url": secure_url }`)

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
- `002_seed_data.sql`

### 3. Seed Starter Test Data (Optional)

Populate test retailers, client accounts, dishes, and starter orders:
```bash
python -m app.db.seed
```

### 4. Run the Development Server

```bash
uvicorn app.main:app --reload --port 8000
```

The server will be available at:
- **Base URL**: http://localhost:8000
- **Interactive API Docs (Swagger UI)**: http://localhost:8000/docs
- **Alternative API Docs (ReDoc)**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/api/v1/health


