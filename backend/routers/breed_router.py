from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from db.database import get_session
from models.Breed import Breed
from schemas.breed_response import BreedResponse

router = APIRouter(prefix="/breed", tags=["breed"])

@router.get("/", response_model=list[BreedResponse])
def get_breeds(session: Session = Depends(get_session)):
    return session.exec(select(Breed).order_by(Breed.name)).all()