from datetime import datetime

from sqlalchemy import (
    BigInteger,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
)

from sqlalchemy.orm import relationship
from app.db.database import Base


class Attachment(Base):
    __tablename__ = "attachments"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    message_id = Column(
        Integer,
        ForeignKey("messages.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )

    filename = Column(
        String(255),
        nullable=False,
    )

    stored_filename = Column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )

    file_path = Column(
        String(500),
        nullable=False,
    )

    file_size = Column(
        BigInteger,
        nullable=False,
    )

    mime_type = Column(
        String(100),
        nullable=False,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    # ------------------------
    # Relationships
    # ------------------------

    user = relationship(
        "User",
        back_populates="attachments",
    )

    message = relationship(
        "Message",
        back_populates="attachments",
    )

    def __repr__(self):
        return (
            f"<Attachment("
            f"id={self.id}, "
            f"filename='{self.filename}', "
            f"user_id={self.user_id}, "
            f"message_id={self.message_id})>"
        )