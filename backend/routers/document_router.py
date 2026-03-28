from typing import Optional

from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlmodel import Session, select

from db.database import get_session

from schemas.document_request import DocumentRequest
from schemas.document_response import DocumentResponse

from services.document_service import create_document
from services.document_storage_service import upload_document

from models.documents import Documents

router = APIRouter(prefix="/documents", tags=["documents"])

@router.post("/", response_model=DocumentResponse)
async def add_document(
        documentName: str = Form(...),
        category: str = Form(...),
        notes: Optional[str] = Form(None),
        fileUrl: UploadFile = File(...),

        session: Session = Depends(get_session),
):
    submission = DocumentRequest(
        documentName=documentName,
        category=category,
        notes=notes
    )

    file_url = await upload_document(fileUrl)
    return create_document(session=session, submission=submission, file_url=file_url)


@router.get("/", response_model=list[DocumentResponse])
def get_documents(session: Session = Depends(get_session)):
    documents = session.exec(select(Documents)).all()

    return [
        DocumentResponse(
            document_id = document.document_id,

            document_name = document.document_name,
            category = document.category,
            notes = document.notes,
            file_url = document.file_url,

            created_at = document.created_at,
            updated_at = document.updated_at
        )
        for document in documents
    ]