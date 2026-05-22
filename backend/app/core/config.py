from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "ContentAlchemy"
    DEBUG: bool = False

    DATABASE_URL: str = "sqlite+aiosqlite:///./contentalchemy.db"
    REDIS_URL: str = ""

    JWT_SECRET: str = "change-this-to-a-secure-random-string-min-32-chars"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    CLAUDE_API_KEY: str = ""
    CLAUDE_MODEL: str = "claude-sonnet-4-20250514"

    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-flash-latest"

    # Stripe Configurations
    STRIPE_SECRET_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""
    STRIPE_PRO_PRICE_ID: str = ""
    STRIPE_MAX_PRICE_ID: str = ""
    FRONTEND_URL: str = "http://localhost:3000"

    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    class Config:
        env_file = ".env"


settings = Settings()
