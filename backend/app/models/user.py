from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    Enum,
)
from sqlalchemy.orm import relationship

from app.db.database import Base
from app.models.enums import UserStatus


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(
        String(50),
        unique=True,
        nullable=False,
        index=True,
    )

    email = Column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )

    password_hash = Column(
        String(255),
        nullable=False,
    )

    avatar_url = Column(
        String(500),
        nullable=True,
    )

    bio = Column(
        String(500),
        nullable=True,
    )

    status = Column(
        Enum(UserStatus),
        default=UserStatus.OFFLINE,
        nullable=False,
    )

    last_seen = Column(
        DateTime,
        nullable=True,
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

        # ------------------------
    # Relationships
    # ------------------------

    owned_servers = relationship(
        "Server",
        back_populates="owner",
        cascade="all, delete",
    )

    server_memberships = relationship(
        "ServerMember",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    channel_messages = relationship(
        "Message",
        back_populates="author",
        cascade="all, delete-orphan",
    )

    sent_direct_messages = relationship(
        "DirectMessage",
        foreign_keys="DirectMessage.sender_id",
        back_populates="sender",
        cascade="all, delete-orphan",
    )

    notifications = relationship(
        "Notification",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    conversations_as_user1 = relationship(
        "Conversation",
        foreign_keys="Conversation.user1_id",
        back_populates="user1",
    )

    conversations_as_user2 = relationship(
        "Conversation",
        foreign_keys="Conversation.user2_id",
        back_populates="user2",
    )

    created_invites = relationship(
        "Invite",
        back_populates="creator",
    )

    attachments = relationship(
        "Attachment",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}')>"