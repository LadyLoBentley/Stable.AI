import uuid
from typing import Optional

from sqlmodel import SQLModel, Field
from datetime import datetime, timezone

def now_utc() -> datetime:
    return datetime.now(timezone.utc)

class Documents(SQLModel, table=True) :
    __tablename__ = "documents"

    # Automatically generated primary key
    document_id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)

    # Form Fields
    document_name: str = Field(index=True, min_length=1, max_length=120)
    category: str = Field(index=True)
    notes: Optional[str] = Field(default=None)
    file_url: str = Field()

    # datetime metadata
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc, sa_column_kwargs={"onupdate": now_utc})