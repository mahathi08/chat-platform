from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import InviteStatus


class InviteCreate(BaseModel):
    max_uses: int = Field(default=0, ge=0)
    expires_at: Optional[datetime] = None


class InviteUseRequest(BaseModel):
    code: str = Field(..., min_length=6, max_length=64)


class InviteResponse(BaseModel):
    id: int

    server_id: int

    creator_id: Optional[int]

    code: str

    status: InviteStatus

    max_uses: int
    uses: int

    expires_at: Optional[datetime]

    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class InviteListResponse(BaseModel):
    invites: list[InviteResponse]

    model_config = ConfigDict(from_attributes=True)