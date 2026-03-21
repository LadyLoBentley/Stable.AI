from typing import Optional
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, Text

class Allergies(SQLModel, table=True):
    __tablename__ = "allergies"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, unique=True)
    category: str = Field(index=True)
    description: str =Field(sa_column=Column(Text))
    management_notes: str = Field(sa_column=Column(Text))