from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.server import Server
from app.models.server_member import ServerMember

from app.models.enums import (
    MemberRole,
)

from app.schemas.server import (
    ServerCreate,
    ServerUpdate,
    ServerListResponse,
)

def get_server(
    db: Session,
    server_id: int,
) -> Server:

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


def get_server_member(
    db: Session,
    server_id: int,
    user_id: int,
) -> ServerMember | None:

    return (
        db.query(ServerMember)
        .filter(
            ServerMember.server_id == server_id,
            ServerMember.user_id == user_id,
        )
        .first()
    )


def create_server(
    db: Session,
    owner_id: int,
    data: ServerCreate,
) -> Server:
    """
    Create a new server.
    """

    existing = (
        db.query(Server)
        .filter(
            Server.name == data.name,
            Server.owner_id == owner_id,
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You already have a server with this name.",
        )

    server = Server(
        name=data.name,
        description=data.description,
        icon_url=data.icon_url,
        owner_id=owner_id,
    )

    db.add(server)
    db.flush()

    member = ServerMember(
        server_id=server.id,
        user_id=owner_id,
        role=MemberRole.OWNER,
    )

    db.add(member)

    db.commit()

    db.refresh(server)

    return server


def get_server_by_id(
    db: Session,
    server_id: int,
) -> Server:

    return get_server(
        db,
        server_id,
    )


def get_user_servers(
    db: Session,
    user_id: int,
) -> ServerListResponse:

    memberships = (
        db.query(ServerMember)
        .filter(
            ServerMember.user_id == user_id,
        )
        .all()
    )

    servers = [
        member.server
        for member in memberships
    ]

    return ServerListResponse(
        servers=servers,
    )

def update_server(
    db: Session,
    server_id: int,
    data: ServerUpdate,
) -> Server:

    server = get_server(
        db,
        server_id,
    )

    if data.name is not None:

        server.name = data.name

    if data.description is not None:

        server.description = data.description

    if data.icon_url is not None:

        server.icon_url = data.icon_url

    db.commit()

    db.refresh(server)

    return server


def delete_server(
    db: Session,
    server_id: int,
) -> None:

    server = get_server(
        db,
        server_id,
    )

    db.delete(server)

    db.commit()


def join_server(
    db: Session,
    server_id: int,
    user_id: int,
):

    server = get_server(
        db,
        server_id,
    )

    member = get_server_member(
        db,
        server_id,
        user_id,
    )

    if member:

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Already a member.",
        )

    member = ServerMember(
        server_id=server.id,
        user_id=user_id,
        role=MemberRole.MEMBER,
    )

    db.add(member)

    db.commit()

    return {
        "message": "Joined server successfully."
    }

def leave_server(
    db: Session,
    server_id: int,
    user_id: int,
):

    member = get_server_member(
        db,
        server_id,
        user_id,
    )

    if member is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Membership not found.",
        )

    if member.role == MemberRole.OWNER:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Owner cannot leave the server. Transfer ownership first.",
        )

    db.delete(member)

    db.commit()

    return {
        "message": "Left server."
    }

def get_server_members(
    db: Session,
    server_id: int,
):

    get_server(
        db,
        server_id,
    )

    return (
        db.query(ServerMember)
        .filter(
            ServerMember.server_id == server_id
        )
        .all()
    )

def kick_member(
    db: Session,
    server_id: int,
    user_id: int,
):

    member = get_server_member(
        db,
        server_id,
        user_id,
    )

    if member is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Member not found.",
        )

    if member.role == MemberRole.OWNER:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot kick server owner.",
        )

    db.delete(member)

    db.commit()

    return {
        "message": "Member removed."
    }
def transfer_ownership(
    db: Session,
    server_id: int,
    new_owner_id: int,
):

    server = get_server(
        db,
        server_id,
    )

    current_owner = get_server_member(
        db,
        server_id,
        server.owner_id,
    )

    new_owner = get_server_member(
        db,
        server_id,
        new_owner_id,
    )

    if current_owner is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Current owner membership not found.",
        )

    if new_owner is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="New owner must be a server member.",
        )

    if new_owner.role == MemberRole.OWNER:
        return server

    current_owner.role = MemberRole.ADMIN

    new_owner.role = MemberRole.OWNER

    server.owner_id = new_owner_id

    db.commit()

    db.refresh(server)

    return server


def promote_member(
    db: Session,
    server_id: int,
    user_id: int,
):

    member = get_server_member(
        db,
        server_id,
        user_id,
    )

    if member is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Member not found.",
        )

    if member.role == MemberRole.OWNER:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Owner is already the highest role.",
        )

    if member.role == MemberRole.ADMIN:
        return member

    member.role = MemberRole.ADMIN

    db.commit()

    db.refresh(member)

    return member



def demote_member(
    db: Session,
    server_id: int,
    user_id: int,
):

    member = get_server_member(
        db,
        server_id,
        user_id,
    )
    if member is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Member not found.",
        )

    if member.role == MemberRole.OWNER:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot demote owner.",
        )

    if member.role == MemberRole.MEMBER:
        return member

    member.role = MemberRole.MEMBER

    db.commit()

    db.refresh(member)

    return member

