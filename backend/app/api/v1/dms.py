from fastapi import (
    APIRouter,
    Depends,
    status,
)
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
from app.api.dependencies.database import get_db

from app.models.user import User

from app.schemas.conversation import (
    ConversationResponse,
    ConversationListResponse,
)

from app.schemas.direct_message import (
    DirectMessageCreate,
    DirectMessageResponse,
    DirectMessageListResponse,
)

from app.services.dm_service import (
    create_conversation,
    get_conversation,
    get_user_conversations,
    send_direct_message,
    get_conversation_messages,
    delete_direct_message,
    mark_message_as_read,
)

router = APIRouter(
    prefix="/dms",
    tags=["Direct Messages"],
)


@router.post(
    "/conversations/{recipient_id}",
    response_model=ConversationResponse,
    status_code=status.HTTP_201_CREATED,
)
def start_conversation(
    recipient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_conversation(
        db,
        current_user.id,
        recipient_id,
    )


@router.get(
    "/conversations",
    response_model=ConversationListResponse,
)
def list_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_conversations(
        db,
        current_user.id,
    )


@router.get(
    "/conversations/{conversation_id}",
    response_model=ConversationResponse,
)
def conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_conversation(
        db,
        conversation_id,
    )


@router.post(
    "/conversations/{conversation_id}/messages",
    response_model=DirectMessageResponse,
    status_code=status.HTTP_201_CREATED,
)
def send_message(
    conversation_id: int,
    message: DirectMessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return send_direct_message(
        db,
        conversation_id,
        current_user.id,
        message,
    )


@router.get(
    "/conversations/{conversation_id}/messages",
    response_model=DirectMessageListResponse,
)
def get_messages(
    conversation_id: int,
    page: int = 1,
    page_size: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_conversation_messages(
        db,
        conversation_id,
        current_user.id,
        page,
        page_size,
    )


@router.patch(
    "/messages/{message_id}/read",
)
def mark_read(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return mark_message_as_read(
        db,
        message_id,
        current_user.id,
    )


@router.delete(
    "/messages/{message_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_message(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    delete_direct_message(
        db,
        message_id,
        current_user.id,
    )