from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import MessageType


class MessageCreate(BaseModel):
    content: str = Field(..., min_length=1, max_length=4000)
    reply_to_id: Optional[int] = None


class MessageUpdate(BaseModel):
    content: str = Field(..., min_length=1, max_length=4000)


class ReplyMessageRequest(BaseModel):
    reply_to_id: int
    content: str = Field(..., min_length=1, max_length=4000)


class PinMessageRequest(BaseModel):
    is_pinned: bool = True


class MessageResponse(BaseModel):
    id: int
    channel_id: int
    author_id: int

    content: str

    message_type: MessageType

    reply_to_id: Optional[int]

    is_edited: bool
    is_deleted: bool
    is_pinned: bool

    created_at: datetime
    edited_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)


class MessageListResponse(BaseModel):
    messages: list[MessageResponse]

    model_config = ConfigDict(from_attributes=True)