from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    DateTime,
    Enum,
    Boolean,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship

from app.db.database import Base
from app.models.enums import MemberRole


class ServerMember(Base):
    __tablename__ = "server_members"

    __table_args__ = (
        UniqueConstraint(
            "server_id",
            "user_id",
            name="uq_server_member",
        ),
    )

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    server_id = Column(
        Integer,
        ForeignKey("servers.id", ondelete="CASCADE"),
        nullable=False,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    role = Column(
        Enum(MemberRole),
        default=MemberRole.MEMBER,
        nullable=False,
    )

    nickname = Column(
        String(100),
        nullable=True,
    )

    is_muted = Column(
        Boolean,
        default=False,
        nullable=False,
    )

    is_banned = Column(
        Boolean,
        default=False,
        nullable=False,
    )

    joined_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    # -----------------------------
    # Relationships
    # -----------------------------

    server = relationship(
        "Server",
        back_populates="members",
    )

    user = relationship(
        "User",
        back_populates="server_memberships",
    )

    def __repr__(self):
        return (
            f"<ServerMember(server={self.server_id}, "
            f"user={self.user_id}, role={self.role.value})>"
        )