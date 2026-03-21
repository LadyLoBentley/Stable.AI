from typing import Optional
from sqlmodel import SQLModel

class OwnerRequest(SQLModel):
    ownerName: str
    ownerPhone: str
    ownerEmail: str

    emergencyContactName: str
    emergencyContactRelations: str
    emergencyContactPhone: str

    streetAddress: str
    aptNo: Optional[str] = None
    city: str
    state: str
    zip: str

    signedWaiver: bool