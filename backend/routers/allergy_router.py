from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from db.database import get_session
from schemas.allergy_response import AllergyResponse
from models.Allergies import Allergies

router = APIRouter(prefix="/allergies", tags=["allergies"])

@router.get("/", response_model=list[AllergyResponse])
def get_allergies(session: Session = Depends(get_session)):
    return session.exec(select(Allergies).order_by(Allergies.name)).all()
