from datetime import datetime, UTC

from app.models.enums import UserStatus


# ==========================
# Online / Offline
# ==========================

_online_users: set[int] = set()

_typing_users: dict[int, set[int]] = {}


def set_online(
    user_id: int,
):
    _online_users.add(user_id)

    _user_status[user_id] = UserStatus.ONLINE


def set_offline(
    user_id: int,
):
    _online_users.discard(user_id)

    _user_status[user_id] = UserStatus.OFFLINE

    update_last_seen(user_id)

    # Remove the user from every typing set
    for users in _typing_users.values():
        users.discard(user_id)


def is_online(
    user_id: int,
) -> bool:

    return user_id in _online_users


def online_users():

    return list(_online_users)


# ==========================
# Last Seen
# ==========================

_last_seen: dict[int, datetime] = {}


def update_last_seen(
    user_id: int,
):

    _last_seen[user_id] = datetime.now(
        UTC,
    )


def get_last_seen(
    user_id: int,
):

    return _last_seen.get(
        user_id,
    )


# ==========================
# Typing Indicator
# ==========================

def start_typing(
    channel_id: int,
    user_id: int,
):

    if channel_id not in _typing_users:

        _typing_users[channel_id] = set()

    _typing_users[channel_id].add(
        user_id,
    )


def stop_typing(
    channel_id: int,
    user_id: int,
):
    if channel_id not in _typing_users:
        return

    _typing_users[channel_id].discard(user_id)

    if not _typing_users[channel_id]:
        del _typing_users[channel_id]


def typing_users(
    channel_id: int,
):

    return list(_typing_users.get(channel_id, set()))


# ==========================
# Status
# ==========================

_user_status: dict[
    int,
    UserStatus,
] = {}


def set_status(
    user_id: int,
    status: UserStatus,
):

    _user_status[
        user_id
    ] = status


def get_status(
    user_id: int,
):

    return _user_status.get(
        user_id,
        UserStatus.OFFLINE,
    )


# ==========================
# Cleanup
# ==========================

def remove_user(
    user_id: int,
):
    set_offline(user_id)

    _user_status.pop(user_id, None)