from typing import Optional
from fastapi import APIRouter, Depends, Form
from sqlmodel import Session

from db.database import get_session

from schemas.owner_request import OwnerRequest
from schemas.owner_response import OwnerResponse
from models.owner import OwnerInfo
from services.owner_service import add_owner

router = APIRouter(prefix="/owner", tags=["owner"])

@router.post("/", response_model=OwnerResponse)
def create_owner(
    ownerName: str = Form(...),
    ownerPhone: str = Form(...),
    ownerEmail: str = Form(...),

    emergencyContactName: str = Form(...),
    emergencyContactRelations: str = Form(...),
    emergencyContactPhone: str = Form(...),

    streetAddress: str = Form(...),
    aptNo: Optional[str] = Form(None),
    city: str = Form(...),
    state: str = Form(...),
    zip: str = Form(...),

    signedWaiver: bool = Form(False),
    session: Session = Depends(get_session)
):
    submission = OwnerRequest(
        ownerName=ownerName,
        ownerPhone=ownerPhone,
        ownerEmail=ownerEmail,

        emergencyContactName=emergencyContactName,
        emergencyContactRelations=emergencyContactRelations,
        emergencyContactPhone=emergencyContactPhone,

        streetAddress=streetAddress,
        aptNo=aptNo,
        city=city,
        state=state,
        zip=zip,

        signedWaiver=signedWaiver,
    )

    return add_owner(session, submission)

'''
@router.get("/", response_model=list[OwnerResponse])
def get_owners(session: Session = Depends(get_session)):
    owners = session.exec(select(OwnerInfo)).all()
    return owners

'''