from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.router import api_router
from app.core.config import settings
from app.db.database import Base, engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application startup and shutdown events.
    """

    # Create database tables
    # (Use Alembic migrations in production.)
    Base.metadata.create_all(bind=engine)

    yield

    # Shutdown logic (if needed)


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Discord-like Real-Time Chat Platform Backend",
    debug=settings.DEBUG,
    lifespan=lifespan,
)

# -------------------------
# Ensure upload directory exists
# -------------------------

Path(settings.UPLOAD_DIR).mkdir(
    parents=True,
    exist_ok=True,
)

# -------------------------
# CORS
# -------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Static Files
# -------------------------

app.mount(
    "/uploads",
    StaticFiles(directory=settings.UPLOAD_DIR),
    name="uploads",
)

# -------------------------
# API
# -------------------------

app.include_router(
    api_router,
    prefix=settings.API_V1_PREFIX,
)

# -------------------------
# Health Check
# -------------------------

@app.get("/", tags=["Root"])
def root():
    return {
        "message": f"{settings.APP_NAME} is running.",
        "version": settings.APP_VERSION,
    }


@app.get("/health", tags=["Health"])
def health():
    return {
        "status": "healthy",
    }