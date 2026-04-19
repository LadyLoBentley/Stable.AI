from typing import Optional

from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlmodel import Session, select

from db.database import get_session

from schemas.document_request import DocumentRequest
from schemas.document_response import DocumentResponse

from services.document_service import create_document, update_document, delete_document
from services.document_storage_service import upload_document

from models.documents import Documents

router = APIRouter(prefix="/documents", tags=["documents"])


def build_document_response(document: Documents) -> DocumentResponse:
    return DocumentResponse(
        document_id=document.document_id,
        document_name=document.document_name,
        category=document.category,
        notes=document.notes,
        file_url=document.file_url,
        created_at=document.created_at,
        updated_at=document.updated_at
    )

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
    document = create_document(session=session, submission=submission, file_url=file_url)
    return build_document_response(document)


@router.put("/{document_id}", response_model=DocumentResponse)
async def edit_document(
        document_id: str,
        documentName: str = Form(...),
        category: str = Form(...),
        notes: Optional[str] = Form(None),
        fileUrl: Optional[UploadFile] = File(None),
        session: Session = Depends(get_session),
):
    submission = DocumentRequest(
        documentName=documentName,
        category=category,
        notes=notes
    )

    file_url = None
    if fileUrl and fileUrl.filename:
        file_url = await upload_document(fileUrl)

    document = update_document(
        session=session,
        document_id=document_id,
        submission=submission,
        file_url=file_url
    )

    return build_document_response(document)


@router.get("/", response_model=list[DocumentResponse])
def get_documents(session: Session = Depends(get_session)):
    documents = session.exec(select(Documents)).all()

    return [build_document_response(document) for document in documents]


@router.delete("/{document_id}")
def remove_document(
        document_id: str,
        session: Session = Depends(get_session),
):
    delete_document(session=session, document_id=document_id)
    return {"detail": "Document removed"}
