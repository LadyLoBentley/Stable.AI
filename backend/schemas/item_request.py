from sqlmodel import SQLModel, Field

class ItemRequest(SQLModel):
    label: str = Field(min_length=1)
    quantity: int = Field(default=0, ge=0)
    category: str = Field(min_length=1)
    grade: str = Field(min_length=1)
    instructions: str = Field(min_length=1, max_length=1000)