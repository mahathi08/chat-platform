from datetime import datetime, UTC

from fastapi import HTTPException, status
from sqlalchemy.orm import (
    Session,
    joinedload,
)

from app.models.channel import Channel
from app.models.message import Message
from app.models.server_member import ServerMember

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


def require_admin_or_owner(
    db: Session,
    channel: Channel,
    user_id: int,
):
    member = (
        db.query(ServerMember)
        .filter(
            ServerMember.server_id == channel.server_id,
            ServerMember.user_id == user_id,
        )
        .first()
    )

    if member is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a server member.",
        )

    if member.role not in ("OWNER", "ADMIN"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins and owners can pin messages.",
        )

def get_message(
    db: Session,
    message_id: int,
) -> Message:
    """
    Get message by ID.
    """

    message = (
        db.query(Message)
        .options(
            joinedload(Message.author)
        )
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


# def get_message_by_id(
#     db: Session,
#     message_id: int,
# ) -> Message:
#     """
#     Alias for get_message().
#     """

#     message = get_message(
#         db,
#         message_id,
#     )

#     channel = get_channel(
#         db,
#         message.channel_id,
#     )

#     require_admin_or_owner(
#         db,
#         channel,
#         user_id,
#     )


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

    message = (
        db.query(Message)
        .options(
            joinedload(Message.author)
        )
        .filter(
            Message.id == message.id
        )
        .first()
    )

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
    Get paginated messages for one channel.
    """

    get_channel(
        db,
        channel_id,
    )

    page = max(page, 1)

    page_size = min(
        max(page_size, 1),
        100,
    )

    offset = (page - 1) * page_size

    messages = (
        db.query(Message)
        .options(
            joinedload(Message.author)
        )
        .filter(
            Message.channel_id == channel_id,
        )
        .order_by(
            Message.created_at.asc(),
        )
        .offset(offset)
        .limit(page_size)
        .all()
    )

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

    channel = get_channel(
        db,
        message.channel_id,
    )

    member = (
        db.query(ServerMember)
        .filter(
            ServerMember.server_id == channel.server_id,
            ServerMember.user_id == user_id,
        )
        .first()
    )

    is_admin = (
        member is not None
        and member.role in ("OWNER", "ADMIN")
    )

    if not is_admin:

        if message.author_id != user_id:
            raise HTTPException(
                status_code=403,
                detail="Cannot edit another user's message.",
            )

        age = (
            datetime.now(UTC).replace(tzinfo=None)
            - message.created_at
        ).total_seconds()

        if age > 300:
            raise HTTPException(
                status_code=403,
                detail="Messages can only be edited within 5 minutes.",
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

    message = (
        db.query(Message)
        .options(
            joinedload(Message.author)
        )
        .filter(
            Message.id == message.id
        )
        .first()
    )

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

    channel = get_channel(
        db,
        message.channel_id,
    )

    member = (
        db.query(ServerMember)
        .filter(
            ServerMember.server_id == channel.server_id,
            ServerMember.user_id == user_id,
        )
        .first()
    )

    is_admin = (
        member is not None
        and member.role in ("OWNER", "ADMIN")
    )

    if not is_admin:

        if message.author_id != user_id:
            raise HTTPException(
                status_code=403,
                detail="Cannot delete another user's message.",
            )

        age = (
            datetime.now(UTC).replace(tzinfo=None)
            - message.created_at
        ).total_seconds()

        if age > 300:
            raise HTTPException(
                status_code=403,
                detail="Messages can only be deleted within 5 minutes.",
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

    message = (
        db.query(Message)
        .options(
            joinedload(Message.author)
        )
        .filter(
            Message.id == message.id
        )
        .first()
    )

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

    message = (
        db.query(Message)
        .options(
            joinedload(Message.author)
        )
        .filter(
            Message.id == message.id
        )
        .first()
    )

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