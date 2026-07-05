from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # -------------------------
    # Application
    # -------------------------
    APP_NAME: str = "Real-Time Chat Platform"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # -------------------------
    # API
    # -------------------------
    API_V1_PREFIX: str = "/api/v1"

    # -------------------------
    # Database
    # -------------------------
    DATABASE_URL: str = Field(...)

    # -------------------------
    # Redis
    # -------------------------
    REDIS_URL: str = Field(...)

    # -------------------------
    # JWT
    # -------------------------
    SECRET_KEY: str = Field(...)
    ALGORITHM: str = "HS256"

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # -------------------------
    # CORS
    # -------------------------
    BACKEND_CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    # -------------------------
    # Uploads
    # -------------------------
    UPLOAD_DIR: str = "uploads"

    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10 MB

    # -------------------------
    # WebSocket
    # -------------------------
    WS_HEARTBEAT_INTERVAL: int = 30

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()