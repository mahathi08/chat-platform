from fastapi import APIRouter, WebSocket

from app.websocket.connection import websocket_connection

router = APIRouter(tags=["WebSocket"])


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    Main websocket endpoint.

    Flow:

        Client
            ↓
        /api/v1/ws
            ↓
        Authenticate JWT
            ↓
        Accept websocket
            ↓
        Register connection
            ↓
        Handle events forever
    """

    print("=" * 60)
    print("WEBSOCKET CONNECTION REQUEST")
    print("=" * 60)

    await websocket_connection(websocket)