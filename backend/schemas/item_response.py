from sqlmodel import SQLModel
from datetime import datetime
from enums.inventory_stock_status import StockStatus

class ItemResponse(SQLModel):
    item_id: str

    label: str
    quantity: int
    category: str
    grade: str
    instructions: str
    image_url: str

    stock_status: str
    unit: str

    created_at: datetime
    updated_at: datetime