from fastapi import APIRouter, Depends
from sqlmodel import Session

from db.database import get_session

from schemas.medical_record_request import MedicalRecordRequest
from schemas.medical_record_response import MedicalRecordResponse

from services.medical_record_service import add_health_record

router = APIRouter(prefix="/medical_records", tags=["medical_records"])


@router.post("/", response_model=MedicalRecordResponse)
def add_medical_record(
    submission: MedicalRecordRequest,
    session: Session = Depends(get_session),
):
    medical_record = add_health_record(session, submission)

    return MedicalRecordResponse(
        horse_name=submission.horseName,
        birthdate=submission.birthdate,

        vet_clinic=medical_record.vet_clinic,
        vet_name=medical_record.vet_name,
        vet_phone=medical_record.vet_phone,

        is_same_vet=medical_record.is_same_vet,
        emergency_clinic=medical_record.emergency_clinic,
        emergency_vet_name=medical_record.emergency_vet_name,
        emergency_vet_phone=medical_record.emergency_vet_phone,
        emergency_authorization=medical_record.emergency_authorization,
        emergency_instructions=medical_record.emergency_instructions,

        rabies_expiration=medical_record.rabies_expiration,
        tetanus_expiration=medical_record.tetanus_expiration,
        west_nile_expiration=medical_record.west_nile_expiration,
        eee_wee_expiration=medical_record.eee_wee_expiration,
        flu_rhino_expiration=medical_record.flu_rhino_expiration,
        coggins_expiration=medical_record.coggins_expiration,

        has_shoes=medical_record.has_shoes,
        farrier_name=medical_record.farrier_name,
        farrier_phone=medical_record.farrier_phone,
        farrier_date=medical_record.farrier_date,
        dentist_name=medical_record.dentist_name,
        dentist_phone=medical_record.dentist_phone,
        dental_date=medical_record.dental_date,
        chiropractor_name=medical_record.chiropractor_name,
        chiropractor_phone=medical_record.chiropractor_phone,
        chiropractor_date=medical_record.chiropractor_date,
        massage_therapist=medical_record.massage_therapist,
        therapist_phone=medical_record.therapist_phone,
        massage_date=medical_record.massage_date,
        item_id=medical_record.item_id,
        deworm_provider=medical_record.deworm_provider,
        deworm_date=medical_record.deworm_date,

        medical_notes=medical_record.medical_notes,

        created_at=medical_record.created_at,
        updated_at=medical_record.updated_at
    )