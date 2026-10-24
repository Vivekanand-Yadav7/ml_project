from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.services.cloudinary_service import upload_image

router = APIRouter(prefix="/upload", tags=["Uploads"])

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp", "image/jpg", "image/gif"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB


@router.post("/image", status_code=status.HTTP_201_CREATED)
async def upload_image_endpoint(file: UploadFile = File(...)):
    """Upload an image (avatar, dish photo, or order proof) to Cloudinary."""
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type '{file.content_type}'. Allowed types: {', '.join(ALLOWED_CONTENT_TYPES)}",
        )

    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds maximum allowed limit of 5MB.",
        )

    secure_url = upload_image(content, filename=file.filename or "image.jpg")
    return {
        "url": secure_url,
        "filename": file.filename,
        "content_type": file.content_type,
    }
