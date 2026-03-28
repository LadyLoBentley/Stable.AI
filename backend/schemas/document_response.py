from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field

class DocumentResponse(SQLModel):
    document_id: str

    document_name: str = Field(min_length=1)
    category: str
    notes: Optional[str] = Field(default=None)
    file_url: str

    created_at: datetime
    updated_at: datetime