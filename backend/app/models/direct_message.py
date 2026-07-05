from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    Text,
    DateTime,
    Boolean,
)
from sqlalchemy.orm import relationship

from app.db.database import Base


class DirectMessage(Base):
    __tablename__ = "direct_messages"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    conversation_id = Column(
        Integer,
        ForeignKey("conversations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    sender_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    content = Column(
        Text,
        nullable=False,
    )

    reply_to_id = Column(
        Integer,
        ForeignKey("direct_messages.id", ondelete="SET NULL"),
        nullable=True,
    )

    is_read = Column(
        Boolean,
        default=False,
        nullable=False,
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

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    edited_at = Column(
        DateTime,
        nullable=True,
    )
    read_at = Column(
        DateTime,
        nullable=True,
    )

    delivered_at = Column(
        DateTime,
        nullable=True,
    )
    # ----------------------------------
    # Relationships
    # ----------------------------------

    conversation = relationship(
        "Conversation",
        back_populates="direct_messages",
    )

    sender = relationship(
        "User",
        foreign_keys=[sender_id],
        back_populates="sent_direct_messages",
    )

    reply_to = relationship(
        "DirectMessage",
        remote_side=[id],
        backref="replies",
    )

    def __repr__(self):
        return (
            f"<DirectMessage(id={self.id}, "
            f"conversation={self.conversation_id}, "
            f"sender={self.sender_id})>"
        )