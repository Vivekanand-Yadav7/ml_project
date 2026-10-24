"""Cloudinary image upload service.

Configures Cloudinary SDK and handles uploading images (avatars, order proof images).
"""
import io
import cloudinary
import cloudinary.uploader
from fastapi import HTTPException, status
from app.core.config import settings


def init_cloudinary():
    """Configure Cloudinary using settings."""
    if settings.CLOUDINARY_CLOUD_NAME and settings.CLOUDINARY_API_KEY and settings.CLOUDINARY_API_SECRET:
        cloudinary.config(
            cloud_name=settings.CLOUDINARY_CLOUD_NAME,
            api_key=settings.CLOUDINARY_API_KEY,
            api_secret=settings.CLOUDINARY_API_SECRET,
            secure=True,
        )
        return True
    return False


def upload_image(file_bytes: bytes, filename: str, folder: str = "food_delivery") -> str:
    """Upload image bytes to Cloudinary and return secure HTTPS URL."""
    is_configured = init_cloudinary()

    if not is_configured:
        # If Cloudinary credentials have not been configured yet in .env, raise a descriptive error
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Cloudinary is not yet configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in backend/.env.",
        )

    try:
        file_obj = io.BytesIO(file_bytes)
        response = cloudinary.uploader.upload(
            file_obj,
            folder=folder,
            resource_type="image",
            use_filename=True,
            unique_filename=True,
        )
        secure_url = response.get("secure_url")
        if not secure_url:
            raise ValueError("Cloudinary response missing secure_url")
        return secure_url
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload image to Cloudinary: {str(e)}",
        )
