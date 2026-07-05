from fastapi import (
    WebSocket,
    WebSocketDisconnect,
    WebSocketException,
)

from app.api.dependencies.websocket import (
    authenticate_websocket,
)

from app.websocket.events import (
    handle_event,
)

from app.websocket.manager import (
    manager,
)

from app.websocket.presence import (
    set_online,
    set_offline,
)


async def websocket_connection(
    websocket: WebSocket,
):
    """
    Main websocket connection handler.
    """

    try:

        user = await authenticate_websocket(
            websocket,
        )

        await manager.connect(
            websocket,
            user.id,
        )

        set_online(
            user.id,
        )

        while True:

            data = await websocket.receive_json()

            await handle_event(
                websocket,
                user,
                data,
            )

    except (
        WebSocketDisconnect,
        WebSocketException,
    ):
        pass

    finally:

        if "user" in locals():

            await manager.disconnect(
                user.id,
            )

            set_offline(
                user.id,
            )