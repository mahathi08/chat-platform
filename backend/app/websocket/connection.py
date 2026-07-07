from fastapi import (
    WebSocket,
    WebSocketDisconnect,
    WebSocketException,
)

from app.api.dependencies.websocket import authenticate_websocket
from app.websocket.events import handle_event
from app.websocket.manager import manager
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

    user = None

    try:

        print("WS: Authenticating...")

        user = await authenticate_websocket(websocket)

        print(f"WS: Authenticated user {user.id}")

        await manager.connect(
            websocket,
            user.id,
        )

        print(f"WS: Connected user {user.id}")

        set_online(user.id)

        while True:

            data = await websocket.receive_json()

            print("WS EVENT:", data)

            await handle_event(
                websocket,
                user,
                data,
            )

    except WebSocketDisconnect:

        print("WS: Client disconnected")

    except WebSocketException as e:

        print("WS Exception:", e)

        try:
            await websocket.close(code=1008)
        except Exception:
            pass

    except Exception as e:

        print("WS Unexpected Error:", repr(e))

        try:
            await websocket.close(code=1011)
        except Exception:
            pass

    finally:

        if user is not None:

            await manager.disconnect(user.id)

            set_offline(user.id)

            print(f"WS: User {user.id} offline")