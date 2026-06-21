import logging

from pydantic import field_validator
from pydantic_settings import BaseSettings

logger = logging.getLogger(__name__)


class Settings(BaseSettings):
    database_url: str = "postgresql://postgres:postgres@localhost:5432/recapai"

    @field_validator("database_url")
    @classmethod
    def _normalize_db_scheme(cls, v: str) -> str:
        # Managed providers (Railway, Heroku) hand out "postgres://", but
        # SQLAlchemy 2.0 only accepts the "postgresql://" scheme.
        if v.startswith("postgres://"):
            return v.replace("postgres://", "postgresql://", 1)
        return v

    # LLM provider: mock | auto | openai.
    #   mock   → deterministic fabricated output, no keys/network (default for demos)
    #   auto   → OpenAI if its key is set, else fall back to mock
    #   openai → Whisper (STT) + GPT-4o (summarization)
    llm_provider: str = "mock"
    openai_api_key: str = ""

    upload_dir: str = "./uploads"
    max_file_size_mb: int = 200
    max_duration_seconds: int = 1200
    cors_origins: str = "http://localhost:5173"

    model_config = {"env_file": "../.env", "extra": "ignore"}


settings = Settings()

# Warn at startup only when a real provider is selected but its key is missing.
if settings.llm_provider == "mock":
    logger.info("LLM_PROVIDER=mock — using fabricated output, no API keys required")
elif settings.llm_provider in ("openai", "auto") and not settings.openai_api_key:
    logger.warning("OPENAI_API_KEY is not set — Whisper transcription / GPT-4o will be unavailable")
