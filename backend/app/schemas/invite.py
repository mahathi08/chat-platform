from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import InviteStatus


# =====================================================
# Create Invite
# =====================================================

class InviteCreate(BaseModel):
    max_uses: int = Field(
        default=0,
        ge=0,
    )

    expires_at: Optional[datetime] = None

    creator_id: Optional[int] = None


# =====================================================
# Join Invite
# =====================================================

class InviteUseRequest(BaseModel):
    code: str = Field(
        ...,
        min_length=6,
        max_length=64,
    )


# =====================================================
# Server Preview
# =====================================================

class InviteServerPreview(BaseModel):
    id: int
    name: str
    description: Optional[str]
    icon_url: Optional[str]

    model_config = ConfigDict(
        from_attributes=True,
    )


# =====================================================
# Invite Response
# =====================================================

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

    server: Optional[InviteServerPreview] = None

    model_config = ConfigDict(
        from_attributes=True,
    )


# =====================================================
# Invite List
# =====================================================

class InviteListResponse(BaseModel):
    invites: list[InviteResponse]

    model_config = ConfigDict(
        from_attributes=True,
    )