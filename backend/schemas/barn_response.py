from sqlmodel import SQLModel

class BarnResponse(SQLModel):
    id: int
    name: str
    type: str
    max_stalls: int
    use_tag: str
    notes: str
