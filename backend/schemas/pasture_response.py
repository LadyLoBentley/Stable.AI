from sqlmodel import SQLModel

class PastureResponse(SQLModel):
    id: int
    name: str
    type: str
    max_horses: int
    sex_restriction: str
    behavior_tag: str
    notes: str
