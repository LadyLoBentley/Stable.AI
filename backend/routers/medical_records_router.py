from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from db.database import get_session

from models.medical_records import MedicalRecords
from schemas.medical_record_request import MedicalRecordRequest
from schemas.medical_record_response import MedicalRecordResponse
from services.medical_record_service import add_health_record, build_medical_record_response

router = APIRouter(prefix="/medical_records", tags=["medical_records"])


@router.post("/", response_model=MedicalRecordResponse)
def add_medical_record(
    submission: MedicalRecordRequest,
    session: Session = Depends(get_session),
):
    medical_record = add_health_record(session, submission)

    return build_medical_record_response(session, medical_record)


@router.put("/horses/{horse_id}", response_model=MedicalRecordResponse)
def update_medical_record(
        horse_id: str,
        submission: MedicalRecordRequest,
        session: Session = Depends(get_session),
):
    payload = submission.model_copy(update={"horse_id": horse_id})
    medical_record = add_health_record(session, payload)
    return build_medical_record_response(session, medical_record)

@router.get("/horses/{horse_id}", response_model=MedicalRecordResponse)
def get_medical_record_by_horse_id(
        horse_id: str,
        session: Session = Depends(get_session),
) -> MedicalRecords:
    medical_record = session.exec(
        select(MedicalRecords).where(MedicalRecords.horse_id == horse_id)
    ).first()

    if not medical_record:
        raise HTTPException(status_code=404, detail="Medical record not found")

    return build_medical_record_response(session, medical_record)
