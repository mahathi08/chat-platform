from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
from app.api.dependencies.database import get_db
from app.api.dependencies.server import get_server_admin

from app.models.server_member import ServerMember
from app.models.user import User

from app.schemas.invite import (
    InviteCreate,
    InviteResponse,
    InviteListResponse,
)

from app.services.invite_service import (
    create_invite,
    get_server_invites,
    get_invite,
    join_with_invite,
    revoke_invite,
)

router = APIRouter(
    prefix="/invites",
    tags=["Invites"],
)


@router.post(
    "/servers/{server_id}",
    response_model=InviteResponse,
    status_code=status.HTTP_201_CREATED,
)
def create(
    server_id: int,
    data: InviteCreate,
    db: Session = Depends(get_db),
    member: ServerMember = Depends(get_server_admin),
):
    """
    Create a server invite.
    """

    return create_invite(
        db=db,
        server_id=server_id,
        data=data,
    )


@router.get(
    "/servers/{server_id}",
    response_model=InviteListResponse,
)
def list_server_invites(
    server_id: int,
    db: Session = Depends(get_db),
    member: ServerMember = Depends(get_server_admin),
):
    """
    List all active invites for a server.
    """

    return get_server_invites(
        db=db,
        server_id=server_id,
    )


@router.get(
    "/{invite_code}",
    response_model=InviteResponse,
)
def get(
    invite_code: str,
    db: Session = Depends(get_db),
):
    """
    Get invite information.
    """

    return get_invite(
        db=db,
        invite_code=invite_code,
    )


@router.post(
    "/{invite_code}/join",
    status_code=status.HTTP_200_OK,
)
def join(
    invite_code: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Join a server using an invite.
    """

    return join_with_invite(
        db=db,
        invite_code=invite_code,
        user_id=current_user.id,
    )


@router.delete(
    "/{invite_code}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def revoke(
    invite_code: str,
    db: Session = Depends(get_db),
    member: ServerMember = Depends(get_server_admin),
):
    """
    Revoke an invite.
    """

    revoke_invite(
        db=db,
        invite_code=invite_code,
    )

    return None