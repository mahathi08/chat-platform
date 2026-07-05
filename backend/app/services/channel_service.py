from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.channel import Channel
from app.models.server import Server

from app.schemas.channel import (
    ChannelCreate,
    ChannelUpdate,
    ChannelListResponse,
)


# =====================================================
# Helpers
# =====================================================

def get_server(
    db: Session,
    server_id: int,
) -> Server:
    """
    Get server by ID.
    """

    server = (
        db.query(Server)
        .filter(Server.id == server_id)
        .first()
    )

    if server is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Server not found.",
        )

    return server


def get_channel(
    db: Session,
    channel_id: int,
) -> Channel:
    """
    Get channel by ID.
    """

    channel = (
        db.query(Channel)
        .filter(Channel.id == channel_id)
        .first()
    )

    if channel is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Channel not found.",
        )

    return channel


# =====================================================
# Create
# =====================================================

def create_channel(
    db: Session,
    server_id: int,
    data: ChannelCreate,
) -> Channel:
    """
    Create a channel.
    """

    get_server(db, server_id)

    existing = (
        db.query(Channel)
        .filter(
            Channel.server_id == server_id,
            Channel.name == data.name,
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Channel already exists.",
        )

    channel = Channel(
        server_id=server_id,
        name=data.name,
        description=data.description,
        type=data.type,
        position=data.position,
    )

    db.add(channel)

    db.commit()

    db.refresh(channel)

    return channel


# =====================================================
# Read
# =====================================================

def get_channel_by_id(
    db: Session,
    channel_id: int,
) -> Channel:
    """
    Get one channel.
    """

    return get_channel(
        db,
        channel_id,
    )


def get_server_channels(
    db: Session,
    server_id: int,
) -> ChannelListResponse:
    """
    Get all channels.
    """

    get_server(
        db,
        server_id,
    )

    channels = (
        db.query(Channel)
        .filter(
            Channel.server_id == server_id
        )
        .order_by(
            Channel.position.asc(),
            Channel.id.asc(),
        )
        .all()
    )

    return ChannelListResponse(
        channels=channels,
    )


# =====================================================
# Update
# =====================================================

def update_channel(
    db: Session,
    channel_id: int,
    data: ChannelUpdate,
) -> Channel:
    """
    Update channel.
    """

    channel = get_channel(
        db,
        channel_id,
    )

    if data.name is not None:
        channel.name = data.name

    if data.description is not None:
        channel.description = data.description

    if data.position is not None:
        channel.position = data.position

    if getattr(data, "type", None) is not None:
        channel.type = data.type

    db.commit()

    db.refresh(channel)

    return channel


# =====================================================
# Delete
# =====================================================

def delete_channel(
    db: Session,
    channel_id: int,
):
    """
    Delete a channel.
    """

    channel = get_channel(
        db,
        channel_id,
    )

    db.delete(channel)

    db.commit()