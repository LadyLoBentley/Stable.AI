from typing import Optional
from sqlmodel import SQLModel, Field

class DocumentRequest(SQLModel):
    documentName: str = Field(min_length=1)
    category: str
    notes: Optional[str] = Field(default=None)
    fileUrl: Optional[str] = Field(default=None)