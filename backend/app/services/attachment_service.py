import os
import shutil
import uuid
from pathlib import Path

from fastapi import (
    HTTPException,
    UploadFile,
    status,
)
from sqlalchemy.orm import Session

from app.core.config import settings

from app.models.attachment import Attachment

from app.schemas.attachment import (
    AttachmentListResponse,
)

UPLOAD_DIR = Path(settings.UPLOAD_DIR)

UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


def get_attachment(
    db: Session,
    attachment_id: int,
) -> Attachment:

    attachment = (
        db.query(Attachment)
        .filter(
            Attachment.id == attachment_id
        )
        .first()
    )

    if attachment is None:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Attachment not found.",
        )

    return attachment

async def upload_attachment(
    db: Session,
    file: UploadFile,
    user_id: int,
) -> Attachment:
    validate_upload(file)
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Filename is required.",
        )
    extension = Path(
        file.filename
    ).suffix

    stored_filename = (
        f"{uuid.uuid4()}{extension}"
    )

    file_path = (
        UPLOAD_DIR / stored_filename
    )

    with open(
        file_path,
        "wb",
    ) as buffer:

        shutil.copyfileobj(
            file.file,
            buffer,
        )

    attachment = Attachment(
        user_id=user_id,
        filename=file.filename,
        stored_filename=stored_filename,
        file_path=str(file_path),
        mime_type=file.content_type,
        file_size=os.path.getsize(file_path),
    )

    db.add(attachment)

    db.commit()

    db.refresh(attachment)

    return attachment

def get_user_attachments(
    db: Session,
    user_id: int,
) -> AttachmentListResponse:

    attachments = (
        db.query(Attachment)
        .filter(
            Attachment.user_id == user_id,
        )
        .all()
    )

    return AttachmentListResponse(
        attachments=attachments,
    )

def delete_attachment(
    db: Session,
    attachment_id: int,
    user_id: int,
):

    attachment = get_attachment(
        db,
        attachment_id,
    )

    if attachment.user_id != user_id:

        raise HTTPException(
            status.HTTP_403_FORBIDDEN,
            detail="Permission denied.",
        )

    if os.path.exists(
        attachment.file_path,
    ):

        os.remove(
            attachment.file_path,
        )

    db.delete(
        attachment,
    )

    db.commit()

def validate_upload(
    file: UploadFile,
):

    if (
        file.size
        and file.size
        > settings.MAX_UPLOAD_SIZE
    ):

        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            detail="File too large.",
        )

