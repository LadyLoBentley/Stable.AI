from typing import Optional
from sqlmodel import SQLModel, Field

class Barn(SQLModel, table=True):
    __tablename__ = "barn"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    type: str
    max_stalls: int
    use_tag: str
    notes: str