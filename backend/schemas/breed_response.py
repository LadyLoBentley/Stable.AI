from typing import Optional
from sqlmodel import SQLModel

class BreedResponse(SQLModel):
    id: int
    name: str
    category: str
    origin: str
    size_class: str
    temperament: str
    common_disciplines: str
    notes: str
    is_common: bool