from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
from app.api.dependencies.database import get_db
from app.api.dependencies.server import (
    get_server_admin,
    get_server_owner,
)

from app.models.server_member import ServerMember
from app.models.user import User

from app.schemas.server import (
    ServerCreate,
    ServerUpdate,
    ServerResponse,
    ServerListResponse,
)

from app.services.server_service import (
    create_server,
    get_server_by_id,
    get_user_servers,
    update_server,
    delete_server,
    join_server,
    leave_server,
)

router = APIRouter(
    prefix="/servers",
    tags=["Servers"],
)


@router.post(
    "/",
    response_model=ServerResponse,
    status_code=status.HTTP_201_CREATED,
)
def create(
    data: ServerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Create a new server.
    """
    return create_server(
        db,
        current_user.id,
        data,
    )


@router.get(
    "/",
    response_model=ServerListResponse,
)
def my_servers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get all servers of current user.
    """
    return get_user_servers(
        db,
        current_user.id,
    )


@router.get(
    "/{server_id}",
    response_model=ServerResponse,
)
def get(
    server_id: int,
    db: Session = Depends(get_db),
):
    """
    Get server details.
    """
    return get_server_by_id(
        db,
        server_id,
    )


@router.put(
    "/{server_id}",
    response_model=ServerResponse,
)
def update(
    server_id: int,
    data: ServerUpdate,
    db: Session = Depends(get_db),
    member: ServerMember = Depends(get_server_admin),
):
    """
    Update server.
    """
    return update_server(
        db,
        server_id,
        data,
    )


@router.delete(
    "/{server_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete(
    server_id: int,
    db: Session = Depends(get_db),
    member: ServerMember = Depends(get_server_owner),
):
    """
    Delete server.
    """
    delete_server(
        db,
        server_id,
    )

    return None


@router.post(
    "/{server_id}/join",
    status_code=status.HTTP_200_OK,
)
def join(
    server_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Join server.
    """
    return join_server(
        db,
        server_id,
        current_user.id,
    )


@router.post(
    "/{server_id}/leave",
    status_code=status.HTTP_200_OK,
)
def leave(
    server_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Leave server.
    """
    return leave_server(
        db,
        server_id,
        current_user.id,
    )