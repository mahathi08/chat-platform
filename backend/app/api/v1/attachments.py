from fastapi import (
    APIRouter,
    Depends,
    File,
    UploadFile,
    status,
)
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
from app.api.dependencies.database import get_db

from app.models.user import User

from app.schemas.attachment import (
    AttachmentResponse,
    AttachmentListResponse,
)

from app.services.attachment_service import (
    upload_attachment,
    get_attachment,
    get_user_attachments,
    delete_attachment,
)

router = APIRouter(
    prefix="/attachments",
    tags=["Attachments"],
)


@router.post(
    "/",
    response_model=AttachmentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Upload an attachment.
    """

    return await upload_attachment(
        db=db,
        file=file,
        user_id=current_user.id,
    )


@router.get(
    "/",
    response_model=AttachmentListResponse,
)
def list_attachments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    List all attachments uploaded by the current user.
    """

    return get_user_attachments(
        db=db,
        user_id=current_user.id,
    )


@router.get(
    "/{attachment_id}",
    response_model=AttachmentResponse,
)
def get(
    attachment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get attachment metadata.
    """

    return get_attachment(
        db=db,
        attachment_id=attachment_id,
        user_id=current_user.id,
    )


@router.delete(
    "/{attachment_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete(
    attachment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Delete an attachment.
    """

    delete_attachment(
        db=db,
        attachment_id=attachment_id,
        user_id=current_user.id,
    )

    return None