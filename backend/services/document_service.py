from fastapi import HTTPException
from sqlmodel import Session, select

from models.documents import Documents
from schemas.document_request import DocumentRequest

def create_document(
        session: Session,
        submission: DocumentRequest,
        file_url: str
) -> Documents:

    db_submission = Documents(
        document_name = submission.documentName,
        category = submission.category,
        notes = submission.notes,
        file_url = file_url,
)

    session.add(db_submission)
    session.commit()
    session.refresh(db_submission)

    return db_submission