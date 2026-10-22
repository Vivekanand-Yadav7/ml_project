# Backend (FastAPI)

FastAPI backend service for the application.

## Directory Structure

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── __init__.py
│   │       └── router.py      # API route definitions
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py          # App settings and CORS configuration
│   ├── __init__.py
│   └── main.py                # FastAPI application entry point
├── .venv/                     # Virtual environment
├── .env                       # Environment variables
├── .env.example               # Example environment variables
├── requirements.txt           # Python dependencies
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
