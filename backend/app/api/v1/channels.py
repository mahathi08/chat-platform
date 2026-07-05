from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
from app.api.dependencies.database import get_db
from app.api.dependencies.server import get_server_member

from app.models.server_member import ServerMember
from app.models.user import User

from app.schemas.channel import (
    ChannelCreate,
    ChannelUpdate,
    ChannelResponse,
    ChannelListResponse,
)

from app.services.channel_service import (
    create_channel,
    get_channel_by_id,
    get_server_channels,
    update_channel,
    delete_channel,
)

router = APIRouter(
    prefix="/channels",
    tags=["Channels"],
)


@router.post(
    "/servers/{server_id}",
    response_model=ChannelResponse,
    status_code=status.HTTP_201_CREATED,
)
def create(
    server_id: int,
    data: ChannelCreate,
    db: Session = Depends(get_db),
    member: ServerMember = Depends(get_server_member),
):
    """
    Create a channel in a server.
    """
    return create_channel(
        db,
        server_id,
        data,
    )


@router.get(
    "/servers/{server_id}",
    response_model=ChannelListResponse,
)
def list_channels(
    server_id: int,
    db: Session = Depends(get_db),
    member: ServerMember = Depends(get_server_member),
):
    """
    Get all channels in a server.
    """
    return get_server_channels(
        db,
        server_id,
    )


@router.get(
    "/{channel_id}",
    response_model=ChannelResponse,
)
def get(
    channel_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get channel details.
    """
    return get_channel_by_id(
        db,
        channel_id,
    )


@router.put(
    "/{channel_id}",
    response_model=ChannelResponse,
)
def update(
    channel_id: int,
    data: ChannelUpdate,
    db: Session = Depends(get_db),
    member: ServerMember = Depends(get_server_member),
):
    """
    Update channel.
    """
    return update_channel(
        db,
        channel_id,
        data,
    )


@router.delete(
    "/{channel_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete(
    channel_id: int,
    db: Session = Depends(get_db),
    member: ServerMember = Depends(get_server_member),
):
    """
    Delete channel.
    """
    delete_channel(
        db,
        channel_id,
    )

    return None