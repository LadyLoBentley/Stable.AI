from fastapi import APIRouter, Depends
from sqlmodel import Session

from db.database import get_session
from schemas.medical_record_request import CareScheduleEntry
from schemas.medication_response import MedicationResponse
from services.medication_service import get_medications_by_horse, replace_medications_by_horse


router = APIRouter(prefix="/medications", tags=["Medications"])


@router.get("/{horse_id}", response_model=list[MedicationResponse])
def get_horse_medications(
    horse_id: str,
    session: Session = Depends(get_session),
):
    return get_medications_by_horse(session=session, horse_id=horse_id)


@router.put("/{horse_id}", response_model=list[MedicationResponse])
def update_horse_medications(
    horse_id: str,
    submission: list[CareScheduleEntry],
    session: Session = Depends(get_session),
):
    return replace_medications_by_horse(
        session=session,
        horse_id=horse_id,
        medications=submission
    )
