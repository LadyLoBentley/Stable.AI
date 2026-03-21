import uuid
from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import datetime, timezone, date


def now_utc() -> datetime:
    return datetime.now(timezone.utc)

class MedicalRecords(SQLModel, table=True) :
    __tablename__ = "horse_medical_records"

    # Automatically generated primary key
    medical_record_id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)

    # Foreign keys
    horse_id: str = Field( foreign_key="horses.horse_id", index=True)
    item_id: Optional[str] = Field(index=True, default=None, foreign_key="inventory_items.item_id")

    vet_clinic: str
    vet_name: str
    vet_phone: str

    is_same_vet: bool = Field(default=False)
    emergency_clinic: Optional[str] = Field(default=None)
    emergency_vet_name: Optional[str] = Field(default=None)
    emergency_vet_phone: Optional[str] = Field(default=None)
    emergency_authorization: bool = Field(default=False)
    emergency_instructions: Optional[str] = Field(default=None)

    rabies_expiration: Optional[date] = Field(default=None)
    tetanus_expiration: Optional[date] = Field(default=None)
    west_nile_expiration: Optional[date] = Field(default=None)
    eee_wee_expiration: Optional[date] = Field(default=None)
    flu_rhino_expiration: Optional[date] = Field(default=None)
    coggins_expiration: Optional[date] = Field(default=None)

    has_shoes: bool = Field(default=False)
    farrier_name: Optional[str] = Field(default=None)
    farrier_phone: Optional[str] = Field(default=None)
    farrier_date: Optional[date] = Field(default=None)
    dentist_name: Optional[str] = Field(default=None)
    dentist_phone: Optional[str] = Field(default=None)
    dental_date: Optional[date] = Field(default=None)
    chiropractor_name: Optional[str] = Field(default=None)
    chiropractor_phone: Optional[str] = Field(default=None)
    chiropractor_date: Optional[date] = Field(default=None)
    massage_therapist: Optional[str] = Field(default=None)
    therapist_phone: Optional[str] = Field(default=None)
    massage_date: Optional[date] = Field(default=None)
    deworm_provider: Optional[str] = Field(default=None)
    deworm_date: Optional[date] = Field(default=None)

    medical_notes: Optional[str] = Field(default=None)

    # datetime metadata
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc, sa_column_kwargs={"onupdate": now_utc})