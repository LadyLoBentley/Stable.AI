from datetime import date, datetime
from typing import Optional
from sqlmodel import SQLModel

class FeedResponse(SQLModel):

    horse_name: str
    birthdate: date

    feed_hay: bool = True
    hay_type: Optional[str] = None
    hay_amount: Optional[int] = None
    hay_unit: Optional[str] = None
    hay_replacement: Optional[str] = None
    replacement_amount: Optional[float] = None
    replacement_unit: Optional[str] = None

    grain_type: str = None
    grain_amount: float = None
    grain_unit: str = None
    add_food_additive: bool = False
    food_additive: Optional[str] = None
    food_additive_amount: Optional[float] = None
    additive_unit: Optional[str] = None

    must_separate: bool = False
    soak_feed: bool = False
    hay_net: bool = False
    feeding_instructions: Optional[str] = None

    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None