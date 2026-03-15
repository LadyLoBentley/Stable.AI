from sqlmodel import SQLModel

class AllergyResponse(SQLModel):
    id: int
    name: str
    category: str
    description: str
    management_notes: str