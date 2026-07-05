from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    DateTime,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship

from app.db.database import Base


class Conversation(Base):
    __tablename__ = "conversations"

    __table_args__ = (
        UniqueConstraint(
            "user1_id",
            "user2_id",
            name="uq_conversation_users",
        ),
    )

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    user1_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    user2_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    # ----------------------------
    # Relationships
    # ----------------------------

    user1 = relationship(
        "User",
        foreign_keys=[user1_id],
        back_populates="conversations_as_user1",
    )

    user2 = relationship(
        "User",
        foreign_keys=[user2_id],
        back_populates="conversations_as_user2",
    )

    direct_messages = relationship(
        "DirectMessage",
        back_populates="conversation",
        cascade="all, delete-orphan",
        order_by="DirectMessage.created_at",
    )

    def __repr__(self):
        return (
            f"<Conversation(id={self.id}, "
            f"user1={self.user1_id}, "
            f"user2={self.user2_id})>"
        )