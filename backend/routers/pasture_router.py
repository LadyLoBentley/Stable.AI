
from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from db.database import get_session

from models.pasture import Pasture

from schemas.pasture_response import PastureResponse

router = APIRouter(prefix="/pastures", tags=["pastures"])

@router.get("/", response_model=list[PastureResponse])
def get_breeds(session: Session = Depends(get_session)):
    return session.exec(select(Pasture).order_by(Pasture.name)).all()