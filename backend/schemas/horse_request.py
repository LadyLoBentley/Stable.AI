from datetime import date
from typing import Optional
from sqlmodel import SQLModel

class HorseRequest(SQLModel):
    horseName: str
    ownerName: str
    breed: str
    sex: str
    birthdate: date
    height: float
    weight: Optional[float] = None

    pastureName: Optional[str] = None
    locationType: str
    turnoutType: str
    barn: Optional[str] = None
    stallId: Optional[str] = None

    escapeRisk: bool = False
    mayBite: bool = False
    mayKick: bool = False
    difficultToCatch: bool = False
    herdDominant: bool = False
    sedationRequired: bool = False
    foodAggressive: bool = False
    requiresExperiencedHandler: bool = False

    temperament: Optional[str] = None
    notes: Optional[str] = None