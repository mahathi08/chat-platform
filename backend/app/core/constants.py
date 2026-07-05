from enum import Enum


# ==========================
# User
# ==========================

DEFAULT_USER_AVATAR = "/uploads/defaults/avatar.png"
DEFAULT_USER_STATUS = "offline"


# ==========================
# Server
# ==========================

MAX_SERVER_NAME_LENGTH = 100
MAX_SERVER_DESCRIPTION_LENGTH = 500

DEFAULT_SERVER_ICON = "/uploads/defaults/server.png"


# ==========================
# Channel
# ==========================

MAX_CHANNEL_NAME_LENGTH = 50

DEFAULT_CHANNEL_POSITION = 0


# ==========================
# Messages
# ==========================

MAX_MESSAGE_LENGTH = 2000

MAX_REPLY_DEPTH = 5


# ==========================
# Attachments
# ==========================

MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024  # 10 MB

ALLOWED_IMAGE_EXTENSIONS = {
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
}

ALLOWED_FILE_EXTENSIONS = {
    ".pdf",
    ".zip",
    ".rar",
    ".txt",
    ".doc",
    ".docx",
    ".ppt",
    ".pptx",
    ".xls",
    ".xlsx",
}


# ==========================
# Pagination
# ==========================

DEFAULT_PAGE = 1

DEFAULT_PAGE_SIZE = 25

MAX_PAGE_SIZE = 100


# ==========================
# Presence
# ==========================

PRESENCE_TIMEOUT_SECONDS = 60


# ==========================
# WebSocket Events
# ==========================

class WSEvent(str, Enum):
    CONNECT = "connect"

    DISCONNECT = "disconnect"

    MESSAGE = "message"

    MESSAGE_EDIT = "message_edit"

    MESSAGE_DELETE = "message_delete"

    TYPING_START = "typing_start"

    TYPING_STOP = "typing_stop"

    USER_ONLINE = "user_online"

    USER_OFFLINE = "user_offline"

    USER_STATUS = "user_status"

    JOIN_CHANNEL = "join_channel"

    LEAVE_CHANNEL = "leave_channel"

    NOTIFICATION = "notification"

    HEARTBEAT = "heartbeat"


# ==========================
# Notification Types
# ==========================

class NotificationType(str, Enum):
    MESSAGE = "message"

    DIRECT_MESSAGE = "direct_message"

    MENTION = "mention"

    SERVER_INVITE = "server_invite"

    FRIEND_REQUEST = "friend_request"


# ==========================
# Roles
# ==========================

OWNER_ROLE = "owner"

ADMIN_ROLE = "admin"

MEMBER_ROLE = "member"