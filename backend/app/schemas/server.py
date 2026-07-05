from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.user import UserProfile


class ServerCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    icon_url: Optional[str] = None


class ServerUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    description: Optional[str] = None
    icon_url: Optional[str] = None


class ServerResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    icon_url: Optional[str]
    owner_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ServerMemberResponse(BaseModel):
    id: int
    role: str
    joined_at: datetime
    user: UserProfile

    model_config = ConfigDict(from_attributes=True)


class ServerListResponse(BaseModel):
    servers: list[ServerResponse]

    model_config = ConfigDict(from_attributes=True)