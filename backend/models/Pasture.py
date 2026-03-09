from sqlmodel import SQLModel, Field
from typing import Optional

class Pasture(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    type: str
    max_horses: int
    sex_restriction: str
    behavior_tag: str
    notes: str