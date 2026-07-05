from datetime import datetime, UTC

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.channel import Channel
from app.models.message import Message

from app.schemas.message import (
    MessageCreate,
    MessageUpdate,
    MessageListResponse,
)


# =====================================================
# Helpers
# =====================================================

def get_channel(
    db: Session,
    channel_id: int,
) -> Channel:
    """
    Get channel by ID.
    """

    channel = (
        db.query(Channel)
        .filter(Channel.id == channel_id)
        .first()
    )

    if channel is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Channel not found.",
        )

    return channel


def get_message(
    db: Session,
    message_id: int,
) -> Message:
    """
    Get message by ID.
    """

    message = (
        db.query(Message)
        .filter(
            Message.id == message_id,
            Message.is_deleted == False,
        )
        .first()
    )

    if message is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found.",
        )

    return message


def get_message_by_id(
    db: Session,
    message_id: int,
) -> Message:
    """
    Alias for get_message().
    """

    return get_message(
        db,
        message_id,
    )


# =====================================================
# Create Message
# =====================================================
def send_message(
    db: Session,
    channel_id: int,
    user_id: int,
    data: MessageCreate,
) -> Message:

    get_channel(db, channel_id)

    reply_to_id = None

    if data.reply_to_id and data.reply_to_id > 0:

        parent = get_message(
            db,
            data.reply_to_id,
        )

        reply_to_id = parent.id

    message = Message(
        channel_id=channel_id,
        author_id=user_id,
        content=data.content,
        reply_to_id=reply_to_id,
    )

    db.add(message)
    db.commit()
    db.refresh(message)

    return message


# =====================================================
# List Messages
# =====================================================

def get_channel_messages(
    db: Session,
    channel_id: int,
    page: int = 1,
    page_size: int = 25,
) -> MessageListResponse:
    """
    Get paginated channel messages.
    """

    get_channel(
        db,
        channel_id,
    )

    page = max(page, 1)
    page_size = min(max(page_size, 1), 100)

    messages = (
        db.query(Message)
        .filter(
            Message.channel_id == channel_id,
            Message.is_deleted == False,
        )
        .order_by(
            Message.created_at.desc()
        )
        .offset(
            (page - 1) * page_size
        )
        .limit(page_size)
        .all()
    )

    messages.reverse()

    return MessageListResponse(
        messages=messages,
    )


# =====================================================
# Update Message
# =====================================================

def update_message(
    db: Session,
    message_id: int,
    user_id: int,
    data: MessageUpdate,
) -> Message:
    """
    Edit a message.
    """

    message = get_message(
        db,
        message_id,
    )

    if message.author_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot edit another user's message.",
        )

    if message.is_deleted:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot edit a deleted message.",
        )

    message.content = data.content
    message.is_edited = True
    message.edited_at = datetime.now(UTC).replace(tzinfo=None)

    db.commit()
    db.refresh(message)

    return message


# =====================================================
# Delete Message
# =====================================================

def delete_message(
    db: Session,
    message_id: int,
    user_id: int,
):
    """
    Soft delete a message.
    """

    message = get_message(
        db,
        message_id,
    )

    if message.author_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot delete another user's message.",
        )

    message.is_deleted = True
    message.content = "This message was deleted."

    db.commit()


# =====================================================
# Reply
# =====================================================

def reply_to_message(
    db: Session,
    channel_id: int,
    parent_message_id: int,
    user_id: int,
    data: MessageCreate,
) -> Message:
    """
    Reply to a message.
    """

    get_channel(
        db,
        channel_id,
    )

    parent = get_message(
        db,
        parent_message_id,
    )

    if parent.channel_id != channel_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reply target belongs to another channel.",
        )

    message = Message(
        channel_id=channel_id,
        author_id=user_id,
        content=data.content,
        reply_to_id=parent.id,
    )

    db.add(message)

    db.commit()

    db.refresh(message)

    return message

# =====================================================
# Pin / Unpin
# =====================================================

def pin_message(
    db: Session,
    message_id: int,
    user_id: int,
) -> Message:
    """
    Pin a message.
    """

    message = get_message(
        db,
        message_id,
    )

    if message.is_deleted:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot pin a deleted message.",
        )

    message.is_pinned = True

    db.commit()

    db.refresh(message)

    return message


def unpin_message(
    db: Session,
    message_id: int,
    user_id: int,
) -> Message:
    """
    Unpin a message.
    """

    message = get_message(
        db,
        message_id,
    )

    if message.is_deleted:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot unpin a deleted message.",
        )

    message.is_pinned = False

    db.commit()

    db.refresh(message)

    return message


# =====================================================
# Search
# =====================================================

def search_messages(
    db: Session,
    channel_id: int,
    query: str,
):
    """
    Search messages in a channel.
    """

    get_channel(
        db,
        channel_id,
    )

    return (
        db.query(Message)
        .filter(
            Message.channel_id == channel_id,
            Message.is_deleted == False,
            Message.content.ilike(
                f"%{query}%"
            ),
        )
        .order_by(
            Message.created_at.desc()
        )
        .all()
    )


# =====================================================
# Pinned Messages
# =====================================================

def get_pinned_messages(
    db: Session,
    channel_id: int,
):
    """
    Get all pinned messages in a channel.
    """

    get_channel(
        db,
        channel_id,
    )

    return (
        db.query(Message)
        .filter(
            Message.channel_id == channel_id,
            Message.is_deleted == False,
            Message.is_pinned == True,
        )
        .order_by(
            Message.created_at.desc()
        )
        .all()
    )