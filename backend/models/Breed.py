from typing import Optional
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, Text

class Breed(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    category: str
    origin: str
    size_class: str
    temperament: str
    common_disciplines: str = Field(sa_column=Column(Text))
    notes: str = Field(sa_column=Column(Text))
    is_common: bool