from enum import Enum


class UserStatus(str, Enum):
    ONLINE = "ONLINE"
    OFFLINE = "OFFLINE"
    IDLE = "IDLE"
    DO_NOT_DISTURB = "DO_NOT_DISTURB"


class MemberRole(str, Enum):
    OWNER = "OWNER"
    ADMIN = "ADMIN"
    MODERATOR = "MODERATOR"
    MEMBER = "MEMBER"


class ChannelType(str, Enum):
    TEXT = "TEXT"
    VOICE = "VOICE"
    ANNOUNCEMENT = "ANNOUNCEMENT"
    PRIVATE = "PRIVATE"


class NotificationType(str, Enum):
    MESSAGE = "MESSAGE"
    DIRECT_MESSAGE = "DIRECT_MESSAGE"
    MENTION = "MENTION"
    SERVER_INVITE = "SERVER_INVITE"
    FRIEND_REQUEST = "FRIEND_REQUEST"
    SYSTEM = "SYSTEM"


class MessageType(str, Enum):
    DEFAULT = "DEFAULT"
    SYSTEM = "SYSTEM"
    JOIN = "JOIN"
    LEAVE = "LEAVE"
    PINNED = "PINNED"


class InviteStatus(str, Enum):
    ACTIVE = "ACTIVE"
    EXPIRED = "EXPIRED"
    REVOKED = "REVOKED"