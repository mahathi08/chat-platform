from datetime import datetime, UTC
import secrets

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.invite import Invite
from app.models.server_member import ServerMember
from app.models.enums import (
    MemberRole,
    InviteStatus,
)
from app.schemas.invite import (
    InviteCreate,
    InviteListResponse,
)


# ==========================================================
# Helpers
# ==========================================================

from sqlalchemy.orm import joinedload

def get_invite(
    db: Session,
    invite_code: str,
) -> Invite:

    invite = (
        db.query(Invite)
        .options(joinedload(Invite.server))
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

def validate_invite(
    invite: Invite,
):

    if invite.status != InviteStatus.ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invite is no longer active.",
        )

    if (
        invite.expires_at
        and invite.expires_at
        < datetime.now(UTC).replace(tzinfo=None)
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invite expired.",
        )

    if (
        invite.max_uses > 0
        and invite.uses >= invite.max_uses
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invite usage limit reached.",
        )


# ==========================================================
# Create Invite
# ==========================================================

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
        server_id=server_id,
        creator_id=data.creator_id,
        code=code,
        expires_at=data.expires_at,
        max_uses=data.max_uses,
        status=InviteStatus.ACTIVE,
    )

    db.add(invite)

    db.commit()

    db.refresh(invite)

    return invite


# ==========================================================
# List Invites
# ==========================================================

def get_server_invites(
    db: Session,
    server_id: int,
) -> InviteListResponse:

    invites = (
        db.query(Invite)
        .filter(
            Invite.server_id == server_id,
        )
        .order_by(
            Invite.created_at.desc()
        )
        .all()
    )

    return InviteListResponse(
        invites=invites,
    )


# ==========================================================
# Join Server
# ==========================================================

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
            status_code=status.HTTP_409_CONFLICT,
            detail="You are already a member of this server.",
        )

    member = ServerMember(
        server_id=invite.server_id,
        user_id=user_id,
        role=MemberRole.MEMBER,
    )

    db.add(member)

    invite.uses += 1

    if (
        invite.max_uses > 0
        and invite.uses >= invite.max_uses
    ):
        invite.status = InviteStatus.EXPIRED

    db.commit()

    db.refresh(invite)

    return {
        "message": "Joined server successfully.",
        "server_id": invite.server_id,
    }


# ==========================================================
# Revoke Invite
# ==========================================================

def revoke_invite(
    db: Session,
    invite_code: str,
):

    invite = get_invite(
        db,
        invite_code,
    )

    invite.status = InviteStatus.REVOKED

    db.commit()


# ==========================================================
# Cleanup
# ==========================================================

def delete_expired_invites(
    db: Session,
):

    (
        db.query(Invite)
        .filter(
            Invite.status == InviteStatus.EXPIRED
        )
        .delete()
    )

    db.commit()