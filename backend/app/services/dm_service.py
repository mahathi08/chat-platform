from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.conversation import Conversation
from app.models.direct_message import DirectMessage

from app.schemas.direct_message import (
    DirectMessageCreate,
    DirectMessageUpdate,
    DirectMessageListResponse,
)

from app.schemas.conversation import (
    ConversationListResponse,
)

def get_conversation(
    db: Session,
    conversation_id: int,
) -> Conversation:

    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.id == conversation_id
        )
        .first()
    )

    if conversation is None:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found.",
        )

    return conversation


def get_direct_message(
    db: Session,
    message_id: int,
) -> DirectMessage:

    message = (
        db.query(DirectMessage)
        .filter(
            DirectMessage.id == message_id
        )
        .first()
    )

    if message is None:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Direct message not found.",
        )

    return message

def create_conversation(
    db: Session,
    user1_id: int,
    user2_id: int,
) -> Conversation:

    if user1_id == user2_id:

        raise HTTPException(
            status_code=400,
            detail="Cannot create conversation with yourself.",
        )

    first = min(user1_id, user2_id)
    second = max(user1_id, user2_id)

    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.user1_id == first,
            Conversation.user2_id == second,
        )
        .first()
    )

    if conversation:

        return conversation

    conversation = Conversation(
        user1_id=first,
        user2_id=second,
    )

    db.add(conversation)

    db.commit()

    db.refresh(conversation)

    return conversation

def get_user_conversations(
    db: Session,
    user_id: int,
) -> ConversationListResponse:

    conversations = (
        db.query(Conversation)
        .filter(
            or_(
                Conversation.user1_id == user_id,
                Conversation.user2_id == user_id,
            )
        )
        .order_by(
            Conversation.updated_at.desc()
        )
        .all()
    )

    return ConversationListResponse(
        conversations=conversations,
    )


def get_conversation_messages(
    db: Session,
    conversation_id: int,
    user_id: int,
    page: int,
    page_size: int,
) -> DirectMessageListResponse:

    conversation = get_conversation(
        db,
        conversation_id,
    )

    if user_id not in (
        conversation.user1_id,
        conversation.user2_id,
    ):

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied.",
        )

    messages = (
        db.query(DirectMessage)
        .filter(
            DirectMessage.conversation_id == conversation_id,
            DirectMessage.is_deleted == False,
        )
        .order_by(
            DirectMessage.created_at.desc()
        )
        .offset(
            (page - 1) * page_size
        )
        .limit(page_size)
        .all()
    )

    return DirectMessageListResponse(
        messages=list(reversed(messages))
    )

def edit_direct_message(
    db: Session,
    message_id: int,
    sender_id: int,
    data: DirectMessageUpdate,
) -> DirectMessage:

    message = get_direct_message(
        db,
        message_id,
    )

    if message.sender_id != sender_id:

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot edit another user's message.",
        )

    if message.is_deleted:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message has been deleted.",
        )

    message.content = data.content

    message.is_edited = True

    message.edited_at = datetime.utcnow()

    db.commit()

    db.refresh(message)

    return message

def delete_direct_message(
    db: Session,
    message_id: int,
    sender_id: int,
):

    message = get_direct_message(
        db,
        message_id,
    )

    if message.sender_id != sender_id:

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot delete another user's message.",
        )

    message.is_deleted = True

    message.content = "[Message Deleted]"

    db.commit()

def mark_message_as_read(
    db: Session,
    message_id: int,
    user_id: int,
) -> DirectMessage:

    message = get_direct_message(
        db,
        message_id,
    )

    conversation = get_conversation(
        db,
        message.conversation_id,
    )

    if user_id not in (
        conversation.user1_id,
        conversation.user2_id,
    ):

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied.",
        )

    if not message.is_read:

        message.is_read = True

        db.commit()

        db.refresh(message)

    return message

def mark_conversation_as_read(
    db: Session,
    conversation_id: int,
    user_id: int,
):

    conversation = get_conversation(
        db,
        conversation_id,
    )

    if user_id not in (
        conversation.user1_id,
        conversation.user2_id,
    ):

        raise HTTPException(
            status_code=403,
            detail="Not part of this conversation.",
        )

    (
        db.query(DirectMessage)
        .filter(
            DirectMessage.conversation_id == conversation_id,
            DirectMessage.sender_id != user_id,
            DirectMessage.is_read == False,
        )
        .update(
            {
                DirectMessage.is_read: True,
            },
            synchronize_session=False,
        )
    )

    db.commit()

def search_direct_messages(
    db: Session,
    conversation_id: int,
    query: str,
):

    return (
        db.query(DirectMessage)
        .filter(
            DirectMessage.conversation_id == conversation_id,
            DirectMessage.is_deleted == False,
            DirectMessage.content.ilike(
                f"%{query}%"
            ),
        )
        .order_by(
            DirectMessage.created_at.desc()
        )
        .all()
    )

def get_conversation_users(
    db: Session,
    conversation_id: int,
):

    conversation = get_conversation(
        db,
        conversation_id,
    )

    return (
        conversation.user1,
        conversation.user2,
    )


def send_direct_message(
    db: Session,
    conversation_id: int,
    sender_id: int,
    data: DirectMessageCreate,
) -> DirectMessage:

    conversation = get_conversation(
        db,
        conversation_id,
    )

    if sender_id not in (
        conversation.user1_id,
        conversation.user2_id,
    ):

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not part of this conversation.",
        )

    message = DirectMessage(
        conversation_id=conversation_id,
        sender_id=sender_id,
        content=data.content,
    )

    db.add(message)

    conversation.updated_at = datetime.utcnow()

    db.commit()

    db.refresh(message)

    return message

