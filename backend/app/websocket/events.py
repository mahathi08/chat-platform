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
    broadcast_to_server,
    broadcast_to_conversation,
)

from app.websocket.presence import (
    start_typing,
    stop_typing,
)

from app.websocket.manager import manager

async def handle_event(
    websocket: WebSocket,
    user: User,
    data: dict,
):

    event = data.get("event")

    if event == "ping":

        await websocket.send_json(
            {
                "event": "pong",
            }
        )

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
                "message": "Unknown event.",
            }
        )

async def handle_join_channel(
    user: User,
    data: dict,
):

    channel_id = data["channel_id"]

    join_channel(
        channel_id,
        user.id,
    )

async def handle_leave_channel(
    user: User,
    data: dict,
):

    leave_channel(
        data["channel_id"],
        user.id,
    )

async def handle_join_server(
    user: User,
    data: dict,
):

    join_server(
        data["server_id"],
        user.id,
    )

async def handle_leave_server(
    user: User,
    data: dict,
):

    leave_server(
        data["server_id"],
        user.id,
    )

async def handle_join_dm(
    user: User,
    data: dict,
):

    join_conversation(
        data["conversation_id"],
        user.id,
    )

async def handle_leave_dm(
    user: User,
    data: dict,
):

    leave_conversation(
        data["conversation_id"],
        user.id,
    )


async def handle_typing_start(
    user: User,
    data: dict,
):

    channel_id = data["channel_id"]

    start_typing(
        channel_id,
        user.id,
    )

    await broadcast_to_channel(
        channel_id,
        {
            "event": "typing_start",
            "user_id": user.id,
        },
    )

async def handle_typing_stop(
    user: User,
    data: dict,
):

    channel_id = data["channel_id"]

    stop_typing(
        channel_id,
        user.id,
    )

    await broadcast_to_channel(
        channel_id,
        {
            "event": "typing_start",
            "user_id": user.id,
        },
    )

    