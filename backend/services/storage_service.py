import traceback
import uuid
from fastapi import UploadFile, HTTPException
from db.supabase_client import supabase

# Image constraints
ALLOWED_IMAGE_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp"
}

MAX_IMAGE_SIZE = 5 * 1024 * 1024

# Map content types to file extensions
CONTENT_TYPE_EXTENSION = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp"
}

# Upload helper
BUCKET_NAME = "inventory-images"

async def upload_inventory_image(image: UploadFile) -> str:

    # Check for incompatible image type
    if image.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported image type."
        )

    contents = await image.read()


    # Check if max image size is exceeded
    if len(contents) > MAX_IMAGE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"Image exceeds maximum size."
        )

    # check if empty file
    if not contents:
        raise HTTPException(
            status_code=400,
            detail="Uploaded image is empty."
        )

    extension = CONTENT_TYPE_EXTENSION[image.content_type]

    filename = f"{uuid.uuid4()}.{extension}"
    file_path = f"inventory/{filename}"

    try:
        supabase.storage.from_(BUCKET_NAME).upload(
            file_path,
            contents,
            {"content-type": image.content_type}
        )
    except Exception as e:
        print("SUPABASE UPLOAD ERROR:", repr(e))
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload image: {str(e)}"
        )

    public_url = supabase.storage.from_(BUCKET_NAME).get_public_url(file_path)

    return public_url