from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import ChannelType


class ChannelCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(default=None, max_length=500)
    topic: Optional[str] = Field(default=None, max_length=255)
    type: ChannelType = ChannelType.TEXT
    position: int = 0
    is_private: bool = False


class ChannelUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    description: Optional[str] = Field(default=None, max_length=500)
    topic: Optional[str] = Field(default=None, max_length=255)
    position: Optional[int] = None
    is_private: Optional[bool] = None


class ChannelResponse(BaseModel):
    id: int
    server_id: int
    name: str
    description: Optional[str]
    topic: Optional[str]
    type: ChannelType
    position: int
    is_private: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ChannelListResponse(BaseModel):
    channels: list[ChannelResponse]

    model_config = ConfigDict(from_attributes=True)