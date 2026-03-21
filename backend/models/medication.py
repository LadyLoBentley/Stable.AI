import uuid
from typing import Optional
from sqlmodel import SQLModel, Field, Column
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime, timezone, date


def now_utc() -> datetime:
    return datetime.now(timezone.utc)

class HorseMedication(SQLModel, table=True):
    __tablename__ = "horse_medication"

    # Primary keys
    horse_medication_id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)

    # Foreign keys
    horse_id: str = Field(index=True, foreign_key="horses.horse_id")
    item_id: str = Field(index=True, foreign_key="inventory_items.item_id")

    # Core fields
    dosage_amount: str
    dosage_unit: str
    frequency_type: str = Field(index=True)

    administration_times: list[str] = Field(sa_column=Column(JSONB))
    schedule_details: dict = Field(sa_column=Column(JSONB))
    single_dose_date: Optional[str] = Field(default=None)

    notes: Optional[str] = Field(default=None)

    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc, sa_column_kwargs={"onupdate": now_utc})
