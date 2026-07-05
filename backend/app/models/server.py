from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    ForeignKey,
    DateTime,
)
from sqlalchemy.orm import relationship

from app.db.database import Base


class Server(Base):
    __tablename__ = "servers"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    name = Column(
        String(100),
        nullable=False,
        index=True,
    )

    description = Column(
        Text,
        nullable=True,
    )

    icon_url = Column(
        String(500),
        nullable=True,
    )

    owner_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
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

    # -----------------------------
    # Relationships
    # -----------------------------

    owner = relationship(
        "User",
        back_populates="owned_servers",
    )

    members = relationship(
        "ServerMember",
        back_populates="server",
        cascade="all, delete-orphan",
    )

    channels = relationship(
        "Channel",
        back_populates="server",
        cascade="all, delete-orphan",
        order_by="Channel.position",
    )

    invites = relationship(
        "Invite",
        back_populates="server",
        cascade="all, delete-orphan",
    )

    def __repr__(self):
        return f"<Server(id={self.id}, name='{self.name}')>"