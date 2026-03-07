import uuid
from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime, timezone
from enum import Enum

'''
Needed fields
- id (str)
- label (str)
- quantity (number)
- Category (str)
- Grade (str)
- Instructions (str)
- item image (url)
- created_at (datetime)
- updated_at (datetime)
'''

class StockStatus(str, Enum):
    OUT_OF_STOCK = "out_of_stock"
    LOW_STOCK = "low_stock"
    IN_STOCK = "in_stock"

def now_utc() -> datetime:
    return datetime.now(timezone.utc)

class InventoryItems(SQLModel, table=True) :
    __tablename__ = "inventory_items"

    @property
    def stock_status(self) -> StockStatus:
        if self.quantity == 0 :
            return StockStatus.OUT_OF_STOCK
        elif self.quantity <= 50 :
            return StockStatus.LOW_STOCK
        else :
            return StockStatus.IN_STOCK

    # Automatically generated primary key
    item_id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    normalized_label: str = Field(index=True, unique=True)

    # Form Fields
    label: str = Field(index=True, min_length=1, max_length=120)
    quantity: int = Field(index=True, default=0)
    category: str = Field(index=True)
    grade: str = Field(index=True)
    instructions: str = Field(max_length=1000)
    image_url: str = Field()

    # datetime metadata
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)