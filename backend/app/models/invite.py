from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime,
    Enum,
)
from sqlalchemy.orm import relationship
from app.db.database import Base
from app.models.enums import InviteStatus


class Invite(Base):
    __tablename__ = "invites"

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

    creator_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )

    code = Column(
        String(64),
        unique=True,
        nullable=False,
        index=True,
    )

    status = Column(
        Enum(InviteStatus),
        default=InviteStatus.ACTIVE,
        nullable=False,
    )

    max_uses = Column(
        Integer,
        default=0,
        nullable=False,
    )

    uses = Column(
        Integer,
        default=0,
        nullable=False,
    )

    expires_at = Column(
        DateTime,
        nullable=True,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    # -------------------------
    # Relationships
    # -------------------------

    server = relationship(
        "Server",
        back_populates="invites",
    )

    creator = relationship(
        "User",
        back_populates="created_invites",
    )

    def __repr__(self):
        return (
            f"<Invite(code='{self.code}', "
            f"server={self.server_id})>"
        )