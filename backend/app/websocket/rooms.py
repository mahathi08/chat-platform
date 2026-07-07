from app.websocket.manager import manager


# =====================================================
# Channel Rooms
# =====================================================

def join_channel(
    channel_id: int,
    user_id: int,
):
    manager.channel_rooms[channel_id].add(user_id)


def leave_channel(
    channel_id: int,
    user_id: int,
):
    manager.channel_rooms[channel_id].discard(user_id)


# =====================================================
# Server Rooms
# =====================================================

def join_server(
    server_id: int,
    user_id: int,
):
    manager.server_rooms[server_id].add(user_id)


def leave_server(
    server_id: int,
    user_id: int,
):
    manager.server_rooms[server_id].discard(user_id)


# =====================================================
# Conversation Rooms
# =====================================================

def join_conversation(
    conversation_id: int,
    user_id: int,
):
    manager.dm_rooms[conversation_id].add(user_id)


def leave_conversation(
    conversation_id: int,
    user_id: int,
):
    manager.dm_rooms[conversation_id].discard(user_id)


# =====================================================
# Broadcast Helpers
# =====================================================

async def broadcast_to_channel(
    channel_id: int,
    data: dict,
):
    await manager.broadcast_to_channel(
        channel_id,
        data,
    )


async def broadcast_to_server(
    server_id: int,
    data: dict,
):
    await manager.broadcast_to_server(
        server_id,
        data,
    )


async def broadcast_to_conversation(
    conversation_id: int,
    data: dict,
):
    await manager.broadcast_to_conversation(
        conversation_id,
        data,
    )


# =====================================================
# Cleanup
# =====================================================

def remove_empty_rooms():
    manager.channel_rooms = {
        room: users
        for room, users in manager.channel_rooms.items()
        if users
    }

    manager.server_rooms = {
        room: users
        for room, users in manager.server_rooms.items()
        if users
    }

    manager.dm_rooms = {
        room: users
        for room, users in manager.dm_rooms.items()
        if users
    }