from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class DirectMessageCreate(BaseModel):
    content: str = Field(..., min_length=1, max_length=4000)
    reply_to_id: Optional[int] = None


class DirectMessageUpdate(BaseModel):
    content: str = Field(..., min_length=1, max_length=4000)


class DirectMessageRead(BaseModel):
    is_read: bool = True


class DirectMessageResponse(BaseModel):
    id: int

    conversation_id: int

    sender_id: int

    content: str

    reply_to_id: Optional[int]

    is_read: bool
    is_edited: bool
    is_deleted: bool

    created_at: datetime
    edited_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)


class DirectMessageListResponse(BaseModel):
    messages: list[DirectMessageResponse]

    model_config = ConfigDict(from_attributes=True)