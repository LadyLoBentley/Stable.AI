from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel

class OwnerResponse(SQLModel):
    owner_name: str
    owner_phone: str
    owner_email: str

    emergency_contact_name: str
    emergency_contact_relation: str
    emergency_contact_phone: str

    street_address: str
    apt_no: Optional[str] = None
    city: str
    state: str
    zip: str

    signed_waiver: bool = False

    created_at: datetime
    updated_at: datetime