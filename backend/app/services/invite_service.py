from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.invite import Invite
from app.models.server_member import ServerMember
import secrets
from app.models.enums import MemberRole

from app.schemas.invite import (
    InviteCreate,
    InviteListResponse,
)

def get_invite(
    db: Session,
    invite_code: str,
) -> Invite:

    invite = (
        db.query(Invite)
        .filter(
            Invite.code == invite_code,
        )
        .first()
    )

    if invite is None:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invite not found.",
        )

    return invite

import secrets


def create_invite(
    db: Session,
    server_id: int,
    data: InviteCreate,
) -> Invite:

    code = secrets.token_urlsafe(8)

    while (
        db.query(Invite)
        .filter(Invite.code == code)
        .first()
    ):
        code = secrets.token_urlsafe(8)

    invite = Invite(
        code=code,
        server_id=server_id,
        creator_id=data.creator_id,
        expires_at=data.expires_at,
        max_uses=data.max_uses,
    )

    db.add(invite)

    db.commit()

    db.refresh(invite)

    return invite

def get_server_invites(
    db: Session,
    server_id: int,
) -> InviteListResponse:

    invites = (
        db.query(Invite)
        .filter(
            Invite.server_id == server_id,
        )
        .all()
    )

    return InviteListResponse(
        invites=invites,
    )

def validate_invite(
    invite: Invite,
):

    if invite.expires_at:

        if invite.expires_at < datetime.now(datetime.UTC).replace(tzinfo=None):

            raise HTTPException(
                status.HTTP_400_BAD_REQUEST,
                detail="Invite expired.",
            )

    if (
        invite.max_uses
        and invite.uses >= invite.max_uses
    ):

        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            detail="Invite has reached its usage limit.",
        )

def join_with_invite(
    db: Session,
    invite_code: str,
    user_id: int,
):

    invite = get_invite(
        db,
        invite_code,
    )

    validate_invite(invite)

    existing = (
        db.query(ServerMember)
        .filter(
            ServerMember.server_id == invite.server_id,
            ServerMember.user_id == user_id,
        )
        .first()
    )

    if existing:

        raise HTTPException(
            status.HTTP_409_CONFLICT,
            detail="Already a member.",
        )

    member = ServerMember(
        server_id=invite.server_id,
        user_id=user_id,
        role=MemberRole.MEMBER,
    )

    db.add(member)

    invite.uses += 1

    db.commit()

    return {
        "message": "Joined server successfully.",
    }

def revoke_invite(
    db: Session,
    invite_code: str,
):

    invite = get_invite(
        db,
        invite_code,
    )

    db.delete(invite)

    db.commit()


def delete_expired_invites(
    db: Session,
):

    (
        db.query(Invite)
        .filter(
            Invite.expires_at < datetime.now(datetime.UTC).replace(tzinfo=None)
        )
        .delete()
    )

    db.commit()

