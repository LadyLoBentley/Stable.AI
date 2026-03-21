import uuid
from typing import Optional

from sqlalchemy import Column, Enum
from sqlmodel import SQLModel, Field
from datetime import datetime, timezone, date


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


class Horse(SQLModel, table=True) :
    __tablename__ = "horses"

    # Automatically generated primary key
    horse_id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)

    # Foreign keys
    breed_id: int = Field(foreign_key="breed.id")
    owner_id: str = Field(foreign_key="owner_info.owner_id")
    barn_id: Optional[int] = Field(default=None, foreign_key="barn.id")
    pasture_id: Optional[int] = Field(default=None, foreign_key="pasture.id")

    # Form Fields
    horse_name: str = Field(index=True)
    sex: str = Field(index=True)
    birthdate: date = Field(index=True)
    height: float = Field(index=True)
    weight: Optional[float] = Field(default=None, index=True)

    location_type: str = Field(index=True)
    turnout_type: str = Field(index=True)
    stall_id: Optional[str] = Field(index=True, default=None)

    escape_risk: bool = Field(default=False, index=True)
    may_bite: bool = Field(default=False, index=True)
    may_kick: bool = Field(default=False, index=True)
    difficult_to_catch: bool = Field(default=False, index=True)
    herd_dominant: bool = Field(default=False, index=True)
    sedation_required: bool = Field(default=False, index=True)
    food_aggressive: bool = Field(default=False, index=True)
    requires_experienced_handler: bool = Field(default=False, index=True)

    temperament: Optional[str] = Field(default=None, index=True)
    notes: Optional[str] = Field(default=None)
    image: str

    # datetime metadata
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc, sa_column_kwargs={"onupdate": now_utc})