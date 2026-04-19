from fastapi import APIRouter, Depends
from sqlmodel import Session

from db.database import get_session
from schemas.medical_record_request import CareScheduleEntry
from schemas.supplements_response import SupplementResponse
from services.supplements_service import get_supplements_by_horse, replace_supplements_by_horse


router = APIRouter(prefix="/supplements", tags=["Supplements"])


@router.get("/{horse_id}", response_model=list[SupplementResponse])
def get_horse_supplements(
    horse_id: str,
    session: Session = Depends(get_session),
):
    return get_supplements_by_horse(session=session, horse_id=horse_id)


@router.put("/{horse_id}", response_model=list[SupplementResponse])
def update_horse_supplements(
    horse_id: str,
    submission: list[CareScheduleEntry],
    session: Session = Depends(get_session),
):
    return replace_supplements_by_horse(
        session=session,
        horse_id=horse_id,
        supplements=submission
    )
