import uuid
from sqlmodel import SQLModel, Field
from datetime import datetime, timezone
from enum import Enum

class StockStatus(str, Enum):
    OUT_OF_STOCK = "out_of_stock"
    LOW_STOCK = "low_stock"
    IN_STOCK = "in_stock"

    @property
    def label(self) -> str:
        return {
            "out_of_stock": "Out of Stock",
            "low_stock": "Low Stock",
            "in_stock": "In Stock",
        }[self.value]

def now_utc() -> datetime:
    return datetime.now(timezone.utc)

class InventoryItems(SQLModel, table=True) :
    __tablename__ = "inventory_items"

    @property
    def unit(self) -> str:
        if self.category == "Hay":
            return "bales"

        if self.category == "Supplements":
            return "tubs"

        if self.category == "Medication":
            return "doses"

        if self.category == "Grooming":
            return "bottles"

        if self.category == "Barn Supplies":
            return "units"

        if self.category == "Grain":
            return "bags"

        if self.category == "Treats":
            return "bags"

        return "units"

    @property
    def low_stock_threshold(self) -> int:
        if self.category == "Hay":
            return 20

        if self.category == "Grooming":
            return 3

        if self.category == "Supplements":
            return 2

        if self.category == "Medication":
            return 2

        if self.category == "Grain":
            return 10

        if self.category == "Treats":
            return 5

        return 5

    @property
    def stock_status(self) -> StockStatus:
        if self.quantity == 0:
            return StockStatus.OUT_OF_STOCK

        if self.quantity <= self.low_stock_threshold:
            return StockStatus.LOW_STOCK

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