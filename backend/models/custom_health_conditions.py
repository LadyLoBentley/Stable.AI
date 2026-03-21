import uuid
from sqlmodel import SQLModel, Field
from datetime import datetime, timezone


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


class HorseCustomHealthCondition(SQLModel, table=True):
    __tablename__ = "horse_custom_health_conditions"

    # Automatically generated primary key
    custom_health_condition_id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)

    # Foreign keys
    horse_id: str = Field(foreign_key="horses.horse_id", index=True)

    # Other fields
    health_condition_name: str = Field(index=True)

    # datetime metadata
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc, sa_column_kwargs={"onupdate": now_utc})