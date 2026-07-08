from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
from app.api.dependencies.database import get_db

from app.models.server import Server
from app.models.server_member import ServerMember
from app.models.user import User
from app.models.enums import MemberRole


def get_server(
    server_id: int,
    db: Session = Depends(get_db),
) -> Server:

    server = (
        db.query(Server)
        .filter(Server.id == server_id)
        .first()
    )

    if server is None:
        raise HTTPException(
            status_code=404,
            detail="Server not found.",
        )

    return server


def get_server_member(
    server_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ServerMember:

    member = (
        db.query(ServerMember)
        .filter(
            ServerMember.server_id == server_id,
            ServerMember.user_id == current_user.id,
        )
        .first()
    )

    if member is None:
        raise HTTPException(
            status_code=403,
            detail="You are not a member of this server.",
        )

    return member


def get_server_admin(
    member: ServerMember = Depends(get_server_member),
) -> ServerMember:

    if member.role not in (
        MemberRole.OWNER,
        MemberRole.ADMIN,
    ):
        raise HTTPException(
            status_code=403,
            detail="Administrator permission required.",
        )

    return member


def get_server_owner(
    member: ServerMember = Depends(get_server_member),
) -> ServerMember:

    if member.role != MemberRole.OWNER:
        raise HTTPException(
            status_code=403,
            detail="Owner permission required.",
        )

    return member