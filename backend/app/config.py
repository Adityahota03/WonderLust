import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))


def _get_database_url():
    """
    Return the database URL, converting Neon/standard 'postgresql://' URLs
    to the 'postgresql+psycopg2://' dialect that SQLAlchemy requires.
    """
    url = os.getenv(
        "DATABASE_URL",
        f"sqlite:///{os.path.join(BASE_DIR, 'travel.db')}"
    )
    # Neon and many PaaS providers emit 'postgresql://' — SQLAlchemy needs the driver prefix
    if url.startswith("postgresql://"):
        url = url.replace("postgresql://", "postgresql+psycopg2://", 1)
    # Heroku-style legacy prefix
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql+psycopg2://", 1)
    return url


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "travel-platform-super-secret-key-2026")
    JWT_SECRET = os.getenv("JWT_SECRET", "travel-jwt-secret-key-super-secure-token")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)

    # Neon PostgreSQL (or local SQLite fallback)
    SQLALCHEMY_DATABASE_URI = _get_database_url()
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        # Keep connections alive for Neon's serverless pooler
        "pool_pre_ping": True,
        "pool_recycle": 300,
    }
    CORS_HEADERS = "Content-Type"
