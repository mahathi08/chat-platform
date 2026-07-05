from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    ForeignKey,
    Boolean,
    DateTime,
    Enum,
)
from sqlalchemy.orm import relationship
from app.db.database import Base
from app.models.enums import ChannelType


class Channel(Base):
    __tablename__ = "channels"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    server_id = Column(
        Integer,
        ForeignKey("servers.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    name = Column(
        String(100),
        nullable=False,
    )

    description = Column(
        Text,
        nullable=True,
    )

    topic = Column(
        String(255),
        nullable=True,
    )

    type = Column(
        Enum(ChannelType),
        default=ChannelType.TEXT,
        nullable=False,
    )

    position = Column(
        Integer,
        default=0,
        nullable=False,
    )

    is_private = Column(
        Boolean,
        default=False,
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

    # -------------------------
    # Relationships
    # -------------------------

    server = relationship(
        "Server",
        back_populates="channels",
    )

    messages = relationship(
        "Message",
        back_populates="channel",
        cascade="all, delete-orphan",
        order_by="Message.created_at",
    )

    def __repr__(self):
        return (
            f"<Channel(id={self.id}, "
            f"name='{self.name}', "
            f"type='{self.type.value}')>"
        )