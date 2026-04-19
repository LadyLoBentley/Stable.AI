from typing import Optional

from fastapi import HTTPException
from sqlmodel import Session

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


def update_document(
        session: Session,
        document_id: str,
        submission: DocumentRequest,
        file_url: Optional[str] = None
) -> Documents:
    document = session.get(Documents, document_id)

    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    document.document_name = submission.documentName
    document.category = submission.category
    document.notes = submission.notes

    if file_url:
        document.file_url = file_url

    session.add(document)
    session.commit()
    session.refresh(document)

    return document


def delete_document(
        session: Session,
        document_id: str
) -> None:
    document = session.get(Documents, document_id)

    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    session.delete(document)
    session.commit()
