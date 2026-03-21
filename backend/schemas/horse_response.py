from datetime import date, datetime
from typing import Optional
from sqlmodel import SQLModel

class HorseResponse(SQLModel):

    horse_name: str
    owner_name: str
    breed: str
    sex: str
    birthdate: date
    height: float
    weight: Optional[float] = None

    location_type: str
    turnout_type: str
    barn: Optional[str] = None
    stall_id: Optional[str] = None
    pasture_name: Optional[str] = None

    escape_risk: bool = False
    may_bite: bool = False
    may_kick: bool = False
    difficult_to_catch: bool = False
    herd_dominant: bool = False
    sedation_required: bool = False
    food_aggressive: bool = False
    requires_experienced_handler: bool = False

    temperament: Optional[str] = None
    notes: Optional[str] = None
    image: str

    created_at: datetime
    updated_at: datetime