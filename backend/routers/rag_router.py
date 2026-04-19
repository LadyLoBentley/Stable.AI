from fastapi import APIRouter

from schemas.rag_request import RagRequest
from services.rag_service import generate_rag_answer
from rag.ingest import ingest_resources

router = APIRouter(tags=["rag"])


@router.post("/rag/ask")
def ask_rag(payload: RagRequest):
    return generate_rag_answer(payload.question)


@router.post("/rag/ingest")
def ingest_rag_resources():
    return ingest_resources()