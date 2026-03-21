from typing import Optional
from datetime import date
from sqlmodel import SQLModel

class FeedRequest(SQLModel):
    horseName: str
    birthdate: date

    feedHay: bool = True
    hayType: Optional[str] = None
    hayAmount: Optional[int] = None
    hayReplacement: Optional[str] = None
    replacementAmount: Optional[float] = None
    replacementUnit: Optional[str] = None

    grainType: str
    grainAmount: float
    grainUnit: str
    addFoodAdditive: bool = False
    foodAdditive: Optional[str] = None
    additiveAmount: Optional[float] = None
    additiveUnit: Optional[str] = None

    mustSeparate: bool = False
    soakFeed: bool = False
    hayNet: bool = False
    feedingInstructions: Optional[str] = None