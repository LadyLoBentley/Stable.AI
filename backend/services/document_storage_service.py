import traceback
import uuid
from fastapi import UploadFile, HTTPException

from db.supabase_client import supabase

# Image constraints
ALLOWED_DOCUMENT_TYPES = {
    "application/pdf",
    "application/msword",   # .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",  # .docx
    "image/jpeg",
    "image/png",
    "image/webp"
}

MAX_DOC_SIZE = 10 * 1024 * 1024

# Map content types to file extensions
CONTENT_TYPE_EXTENSION = {
    "application/pdf": "pdf",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp"
}

# Upload helper
BUCKET_NAME = "documents"

async def upload_document(file: UploadFile) -> str:

    # Check for incompatible image type
    filename = file.filename.lower()

    if (
            file.content_type not in ALLOWED_DOCUMENT_TYPES
            and not filename.endswith((".pdf", ".doc", ".docx"))
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid file type."
        )

    contents = await file.read()
    await file.seek(0)

    # Check if max image size is exceeded
    if len(contents) > MAX_DOC_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"Document exceeds maximum size."
        )

    # check if empty file
    if not contents:
        raise HTTPException(
            status_code=400,
            detail="Document is empty."
        )

    extension = CONTENT_TYPE_EXTENSION[file.content_type]

    filename = f"{uuid.uuid4()}.{extension}"
    file_path = f"documents/{filename}"

    try:
        supabase.storage.from_(BUCKET_NAME).upload(
            file_path,
            contents,
            {"content-type": file.content_type}
        )
    except Exception as e:
        print("SUPABASE UPLOAD ERROR:", repr(e))
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload document: {str(e)}"
        )

    public_url = supabase.storage.from_(BUCKET_NAME).get_public_url(file_path)

    return public_url
