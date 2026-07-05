from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
from app.api.dependencies.database import get_db

from app.models.user import User

from app.schemas.message import (
    MessageCreate,
    MessageUpdate,
    MessageResponse,
    MessageListResponse,
)

from app.services.message_service import (
    send_message,
    get_channel_messages,
    get_message,
    update_message,
    delete_message,
    pin_message,
    unpin_message,
)

router = APIRouter(
    prefix="/messages",
    tags=["Messages"],
)


@router.post(
    "/channels/{channel_id}",
    response_model=MessageResponse,
    status_code=status.HTTP_201_CREATED,
)
def create(
    channel_id: int,
    data: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Send a message.
    """

    return send_message(
        db=db,
        channel_id=channel_id,
        user_id=current_user.id,
        data=data,
    )


@router.get(
    "/channels/{channel_id}",
    response_model=MessageListResponse,
)
def list_messages(
    channel_id: int,
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get channel messages.
    """

    return get_channel_messages(
        db=db,
        channel_id=channel_id,
        page=page,
        page_size=page_size,
    )


@router.get(
    "/{message_id}",
    response_model=MessageResponse,
)
def get(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get one message.
    """

    return get_message(
        db=db,
        message_id=message_id,
    )


@router.patch(
    "/{message_id}",
    response_model=MessageResponse,
)
def edit(
    message_id: int,
    data: MessageUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Edit message.
    """

    return update_message(
        db=db,
        message_id=message_id,
        user_id=current_user.id,
        data=data,
    )


@router.delete(
    "/{message_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Delete message.
    """

    delete_message(
        db=db,
        message_id=message_id,
        user_id=current_user.id,
    )

    return None


@router.patch(
    "/{message_id}/pin",
    response_model=MessageResponse,
)
def pin(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Pin message.
    """

    return pin_message(
        db=db,
        message_id=message_id,
        user_id=current_user.id,
    )


@router.patch(
    "/{message_id}/unpin",
    response_model=MessageResponse,
)
def unpin(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Unpin message.
    """

    return unpin_message(
        db=db,
        message_id=message_id,
        user_id=current_user.id,
    )