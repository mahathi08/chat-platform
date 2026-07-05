from fastapi import (
    APIRouter,
    WebSocket,
)

from app.websocket.connection import (
    websocket_connection,
)

router = APIRouter(
    tags=["WebSocket"],
)


@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
):
    """
    WebSocket endpoint.
    """

    await websocket_connection(
        websocket,
    )