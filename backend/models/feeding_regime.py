import uuid
from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import datetime, timezone

def now_utc() -> datetime:
    return datetime.now(timezone.utc)

class FeedingRegime(SQLModel, table=True) :
    __tablename__ = "horse_feed_plan"

    # Automatically generated primary key
    feed_id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)

    # Foreign keys
    horse_id: str = Field(index=True, foreign_key="horses.horse_id")
    hay_id: Optional[str] = Field(default=None, foreign_key="inventory_items.item_id")
    hay_replacement_id: Optional[str] = Field(default=None, foreign_key="inventory_items.item_id")
    grain_id: str = Field(foreign_key="inventory_items.item_id")
    food_additive_id: Optional[str] = Field(default=None, foreign_key="inventory_items.item_id")

    feed_hay: bool = Field(index=True, default=False)
    hay_amount: Optional[int] = Field(default=None, index=True)
    hay_unit: str = Field(default="flake")
    replacement_amount: Optional[float] = Field(default=None, index=True)
    replacement_unit: Optional[str] = Field(default=None, index=True)
    grain_amount: float = Field(index=True)
    grain_unit: str = Field(index=True)
    add_food_additive: bool = Field(index=True, default=False)
    additive_amount: Optional[float] = Field(default=None, index=True)
    additive_unit: Optional[str] = Field(default=None, index=True)

    must_separate: bool = Field(index=True, default=False)
    soak_feed: bool = Field(index=True, default=False)
    hay_net: bool = Field(index=True, default=False)
    feeding_instructions: Optional[str] = Field(index=True, default=None)

    # datetime metadata
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc, sa_column_kwargs={"onupdate": now_utc})