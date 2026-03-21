import uuid
from sqlmodel import SQLModel, Field
from datetime import datetime, timezone

from enums.inventory_stock_status import StockStatus

CATEGORY_CONFIG = {
        "Hay": {"unit": "bales", "threshold": 20},
        "Supplements": {"unit": "tubs", "threshold": 2},
        "Electrolytes": {"unit": "tubs", "threshold": 2},
        "Medication": {"unit": "doses", "threshold": 2},
        "Food Additive": {"unit": "bags", "threshold": 10},
        "Grooming": {"unit": "items", "threshold": 3},
        "Barn Supplies": {"unit": "units", "threshold": 5},
        "Grain": {"unit": "bags", "threshold": 10},
        "Dewormer": {"unit": "doses", "threshold": 15},
        "Treats": {"unit": "bags", "threshold": 5},
    }

def now_utc() -> datetime:
    return datetime.now(timezone.utc)

class InventoryItems(SQLModel, table=True) :
    __tablename__ = "inventory_items"

    @property
    def unit(self):
        return CATEGORY_CONFIG.get(self.category, {}).get("unit", "units")

    @property
    def low_stock_threshold(self):
        return CATEGORY_CONFIG.get(self.category, {}).get("threshold", 5)

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
    instructions: str = Field()
    image_url: str = Field()

    # datetime metadata
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc, sa_column_kwargs={"onupdate": now_utc})