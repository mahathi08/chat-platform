from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.models.enums import UserStatus


class WebSocketMessage(BaseModel):
    event: str
    data: dict


class JoinRoomEvent(BaseModel):
    room_id: int


class LeaveRoomEvent(BaseModel):
    room_id: int


class TypingEvent(BaseModel):
    room_id: int
    user_id: int
    is_typing: bool


class PresenceEvent(BaseModel):
    user_id: int
    status: UserStatus
    last_seen: Optional[datetime] = None


class HeartbeatEvent(BaseModel):
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)