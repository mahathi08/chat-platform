from collections import defaultdict

from fastapi import WebSocket


class ConnectionManager:
    """
    Manages all active websocket connections.
    """

    def __init__(self):

        # user_id -> websocket
        self.active_connections: dict[int, WebSocket] = {}

        # room_id -> user_ids
        self.channel_rooms: dict[int, set[int]] = defaultdict(set)
        self.server_rooms: dict[int, set[int]] = defaultdict(set)
        self.dm_rooms: dict[int, set[int]] = defaultdict(set)

    # =====================================================
    # Connection
    # =====================================================

    async def connect(
        self,
        websocket: WebSocket,
        user_id: int,
    ):
        await websocket.accept()

        self.active_connections[user_id] = websocket

    async def disconnect(
        self,
        user_id: int,
    ):
        self.active_connections.pop(
            user_id,
            None,
        )

        self.remove_user_from_all_rooms(
            user_id,
        )

    # =====================================================
    # Lookup
    # =====================================================

    def is_connected(
        self,
        user_id: int,
    ) -> bool:

        return user_id in self.active_connections

    def get_connection(
        self,
        user_id: int,
    ) -> WebSocket | None:

        return self.active_connections.get(
            user_id
        )

    # =====================================================
    # Send
    # =====================================================

    async def send_personal_message(
        self,
        user_id: int,
        data: dict,
    ):

        websocket = self.get_connection(
            user_id
        )

        if websocket is None:
            return

        try:

            await websocket.send_json(
                data
            )

        except Exception:

            await self.disconnect(
                user_id
            )

    async def broadcast(
        self,
        data: dict,
    ):

        disconnected = []

        for (
            user_id,
            websocket,
        ) in self.active_connections.items():

            try:

                await websocket.send_json(
                    data
                )

            except Exception:

                disconnected.append(
                    user_id
                )

        for user_id in disconnected:

            await self.disconnect(
                user_id
            )

    async def broadcast_to_users(
        self,
        users: set[int],
        data: dict,
    ):

        for user_id in list(users):

            await self.send_personal_message(
                user_id,
                data,
            )

    # =====================================================
    # Room Broadcasts
    # =====================================================

    async def broadcast_to_channel(
        self,
        channel_id: int,
        data: dict,
    ):

        users = self.channel_rooms.get(
            channel_id,
            set(),
        )

        await self.broadcast_to_users(
            users,
            data,
        )

    async def broadcast_to_server(
        self,
        server_id: int,
        data: dict,
    ):

        users = self.server_rooms.get(
            server_id,
            set(),
        )

        await self.broadcast_to_users(
            users,
            data,
        )

    async def broadcast_to_conversation(
        self,
        conversation_id: int,
        data: dict,
    ):

        users = self.dm_rooms.get(
            conversation_id,
            set(),
        )

        await self.broadcast_to_users(
            users,
            data,
        )

    # =====================================================
    # Cleanup
    # =====================================================

    def remove_user_from_all_rooms(
        self,
        user_id: int,
    ):

        for room in self.channel_rooms.values():
            room.discard(user_id)

        for room in self.server_rooms.values():
            room.discard(user_id)

        for room in self.dm_rooms.values():
            room.discard(user_id)

        self.channel_rooms = defaultdict(
            set,
            {
                k: v
                for k, v in self.channel_rooms.items()
                if v
            },
        )

        self.server_rooms = defaultdict(
            set,
            {
                k: v
                for k, v in self.server_rooms.items()
                if v
            },
        )

        self.dm_rooms = defaultdict(
            set,
            {
                k: v
                for k, v in self.dm_rooms.items()
                if v
            },
        )


manager = ConnectionManager()