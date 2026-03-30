from datetime import date, datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field


class MedicalRecordResponse(SQLModel):

    horse_id: str

    vet_clinic: str
    vet_name: str
    vet_phone: str

    is_same_vet: bool = False
    emergency_clinic: Optional[str] = None
    emergency_vet_name: Optional[str] = None
    emergency_vet_phone: Optional[str] = None
    emergency_authorization: bool = False
    emergency_instructions: Optional[str] = None

    rabies_expiration: Optional[date] = None
    tetanus_expiration: Optional[date] = None
    west_nile_expiration: Optional[date] = None
    eee_wee_expiration: Optional[date] = None
    flu_rhino_expiration: Optional[date] = None
    coggins_expiration: Optional[date] = None

    has_shoes: bool = False
    farrier_name: Optional[str] = None
    farrier_phone: Optional[str] = None
    farrier_date: Optional[date] = None
    dentist_name: Optional[str] = None
    dentist_phone: Optional[str] = None
    dental_date: Optional[date] = None
    chiropractor_name: Optional[str] = None
    chiropractor_phone: Optional[str] = None
    chiropractor_date: Optional[date] = None
    massage_therapist: Optional[str] = None
    therapist_phone: Optional[str] = None
    massage_date: Optional[date] = None
    item_id: Optional[str] = None
    deworm_provider: Optional[str] = None
    deworm_date: Optional[date] = None

    medical_notes: Optional[str] = None

    allergies: List[str] = Field(default_factory=list)
    medical_conditions: List[str] = Field(default_factory=list)

    created_at: datetime
    updated_at: datetime
