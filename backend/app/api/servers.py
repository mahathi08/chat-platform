from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.api.dependencies import (
    get_db,
    get_current_user,
)

from app.models.user import User

from app.schemas.server import (
    ServerCreate,
    ServerResponse,
)

from app.services.server_service import (
    create_server,
    delete_server,
    get_server,
    get_servers,
)

router = APIRouter(
    prefix="/servers",
    tags=["Servers"]
)


@router.get(
    "",
    response_model=list[ServerResponse]
)

def all_servers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return get_servers(db)

@router.get(
    "/{server_id}",
    response_model=ServerResponse
)
def one(
    server_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    server = get_server(
        db,
        server_id
    )

    if not server:

        raise HTTPException(
            status_code=404,
            detail="Server not found"
        )

    return server

@router.delete(
    "/{server_id}"
)
def remove(
    server_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    server = delete_server(
        db,
        server_id
    )

    if not server:

        raise HTTPException(
            status_code=404,
            detail="Server not found"
        )

    return {
        "message": "Deleted"
    }


@router.post(
    "",
    response_model=ServerResponse
)
def create_server_endpoint(
    server: ServerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return create_server(
        db=db,
        name=server.name,
        owner_id=current_user.id,
    )