from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from db.database import get_session
from models.Barn import Barn
from schemas.barn_response import BarnResponse

router = APIRouter(prefix="/barn", tags=["barn"])

@router.get("/", response_model=list[BarnResponse])
def get_breeds(session: Session = Depends(get_session)):
    return session.exec(select(Barn).order_by(Barn.name)).all()