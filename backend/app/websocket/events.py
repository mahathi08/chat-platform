from fastapi import WebSocket

from app.models.user import User

from app.websocket.rooms import (
    join_channel,
    leave_channel,
    join_server,
    leave_server,
    join_conversation,
    leave_conversation,
    broadcast_to_channel,
)

from app.websocket.presence import (
    start_typing,
    stop_typing,
)


# =====================================================
# Main Event Dispatcher
# =====================================================

async def handle_event(
    websocket: WebSocket,
    user: User,
    data: dict,
):
    event = data.get("event")

    if not event:
        await websocket.send_json(
            {
                "event": "error",
                "message": "Missing event.",
            }
        )
        return

    # -------------------------------
    # Ping
    # -------------------------------

    if event == "ping":

        await websocket.send_json(
            {
                "event": "pong",
            }
        )

    # -------------------------------
    # Channel
    # -------------------------------

    elif event == "join_channel":

        await handle_join_channel(
            user,
            data,
        )

    elif event == "leave_channel":

        await handle_leave_channel(
            user,
            data,
        )

    # -------------------------------
    # Server
    # -------------------------------

    elif event == "join_server":

        await handle_join_server(
            user,
            data,
        )

    elif event == "leave_server":

        await handle_leave_server(
            user,
            data,
        )

    # -------------------------------
    # Direct Messages
    # -------------------------------

    elif event == "join_dm":

        await handle_join_dm(
            user,
            data,
        )

    elif event == "leave_dm":

        await handle_leave_dm(
            user,
            data,
        )

    # -------------------------------
    # Typing
    # -------------------------------

    elif event == "typing_start":

        await handle_typing_start(
            user,
            data,
        )

    elif event == "typing_stop":

        await handle_typing_stop(
            user,
            data,
        )

    else:

        await websocket.send_json(
            {
                "event": "error",
                "message": f"Unknown event '{event}'.",
            }
        )


# =====================================================
# Channel
# =====================================================

async def handle_join_channel(
    user: User,
    data: dict,
):
    channel_id = int(data["channel_id"])

    join_channel(
        channel_id,
        user.id,
    )


async def handle_leave_channel(
    user: User,
    data: dict,
):
    leave_channel(
        int(data["channel_id"]),
        user.id,
    )


# =====================================================
# Server
# =====================================================

async def handle_join_server(
    user: User,
    data: dict,
):
    join_server(
        int(data["server_id"]),
        user.id,
    )


async def handle_leave_server(
    user: User,
    data: dict,
):
    leave_server(
        int(data["server_id"]),
        user.id,
    )


# =====================================================
# Direct Messages
# =====================================================

async def handle_join_dm(
    user: User,
    data: dict,
):
    join_conversation(
        int(data["conversation_id"]),
        user.id,
    )


async def handle_leave_dm(
    user: User,
    data: dict,
):
    leave_conversation(
        int(data["conversation_id"]),
        user.id,
    )


# =====================================================
# Typing
# =====================================================

async def handle_typing_start(
    user: User,
    data: dict,
):
    channel_id = int(data["channel_id"])

    start_typing(
        channel_id,
        user.id,
    )

    await broadcast_to_channel(
        channel_id,
        {
            "event": "typing_start",
            "channel_id": channel_id,
            "user_id": user.id,
        },
    )


async def handle_typing_stop(
    user: User,
    data: dict,
):
    channel_id = int(data["channel_id"])

    stop_typing(
        channel_id,
        user.id,
    )

    await broadcast_to_channel(
        channel_id,
        {
            "event": "typing_stop",
            "channel_id": channel_id,
            "user_id": user.id,
        },
    )