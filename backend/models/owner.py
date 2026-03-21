import uuid
from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import datetime, timezone

def now_utc() -> datetime:
    return datetime.now(timezone.utc)

class OwnerInfo(SQLModel, table=True) :
    __tablename__ = "owner_info"

    # Automatically generated primary key
    owner_id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)

    # Form Fields
    owner_name: str
    owner_phone: str
    owner_email: str

    emergency_contact_name: str
    emergency_contact_relation: str
    emergency_contact_phone: str

    street_address: str
    apt_no: Optional[str] = Field(default=None)
    city: str
    state: str
    zip: str

    signed_waiver: bool = Field(default=False)

    # datetime metadata
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc, sa_column_kwargs={"onupdate": now_utc})