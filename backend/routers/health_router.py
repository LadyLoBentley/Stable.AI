from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from db.database import get_session
from schemas.health_response import HealthResponse
from models.health_conditions import HealthConditions
from typing import List

router = APIRouter(prefix="/health", tags=["health"])

@router.get("/", response_model=list[HealthResponse])
def get_health(session: Session = Depends(get_session)):
    return session.exec(select(HealthConditions).order_by(HealthConditions.name)).all()
