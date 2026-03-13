from sqlmodel import SQLModel

class HealthResponse(SQLModel):
    id: int
    name: str
    category: str
    description: str
    management_notes: str