from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    Text,
    DateTime,
    Boolean,
    Enum,
)
from sqlalchemy.orm import relationship

from app.db.database import Base
from app.models.enums import MessageType


class Message(Base):
    __tablename__ = "messages"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    channel_id = Column(
        Integer,
        ForeignKey("channels.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    author_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    content = Column(
        Text,
        nullable=False,
    )

    message_type = Column(
        Enum(MessageType),
        default=MessageType.DEFAULT,
        nullable=False,
    )

    reply_to_id = Column(
        Integer,
        ForeignKey("messages.id", ondelete="SET NULL"),
        nullable=True,
    )

    is_edited = Column(
        Boolean,
        default=False,
        nullable=False,
    )

    is_deleted = Column(
        Boolean,
        default=False,
        nullable=False,
    )

    is_pinned = Column(
        Boolean,
        default=False,
        nullable=False,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    edited_at = Column(
        DateTime,
        nullable=True,
    )

    # ---------------------------------
    # Relationships
    # ---------------------------------

    channel = relationship(
        "Channel",
        back_populates="messages",
    )

    author = relationship(
        "User",
        back_populates="channel_messages",
    )

    reply_to = relationship(
        "Message",
        remote_side=[id],
        backref="replies",
    )

    attachments = relationship(
        "Attachment",
        back_populates="message",
        cascade="all, delete-orphan",
    )

    def __repr__(self):
        return (
            f"<Message(id={self.id}, "
            f"author={self.author_id}, "
            f"channel={self.channel_id})>"
        )