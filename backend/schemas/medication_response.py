from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel


class MedicationResponse(SQLModel):
    horse_medication_id: str
    horse_id: str
    item_id: str
    medication_name: str

    dosage_amount: str
    dosage_unit: str
    frequency_type: str

    administration_times: list[str]
    schedule_details: dict
    single_dose_date: Optional[str] = None
    notes: Optional[str] = None

    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None