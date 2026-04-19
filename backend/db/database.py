import os
from dotenv import load_dotenv
from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy import text

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
LOCAL_SQLITE_URL = "sqlite:///./db/local-dev.db"


def _build_engine(database_url: str):
    connect_args = {"sslmode": "require"} if database_url.startswith("postgres") else {}
    return create_engine(
        database_url,
        echo=True,
        connect_args=connect_args,
    )


def _resolve_engine():
    if not DATABASE_URL:
        print("DATABASE_URL is not set. Falling back to local SQLite database.")
        return _build_engine(LOCAL_SQLITE_URL)

    primary_engine = _build_engine(DATABASE_URL)

    try:
        with primary_engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return primary_engine
    except Exception as exc:
        print(f"Database connection failed ({exc}). Falling back to local SQLite database.")
        return _build_engine(LOCAL_SQLITE_URL)

engine = _resolve_engine()

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
