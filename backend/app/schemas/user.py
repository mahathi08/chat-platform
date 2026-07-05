from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.enums import UserStatus


class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)


class UserUpdate(BaseModel):
    username: Optional[str] = Field(default=None, min_length=3, max_length=50)
    bio: Optional[str] = Field(default=None, max_length=500)
    avatar_url: Optional[str] = None


class UserStatusUpdate(BaseModel):
    status: UserStatus


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8, max_length=128)


class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    avatar_url: Optional[str]
    bio: Optional[str]
    status: UserStatus
    last_seen: Optional[datetime]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserProfile(BaseModel):
    id: int
    username: str
    avatar_url: Optional[str]
    bio: Optional[str]
    status: UserStatus
    last_seen: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)


class UserSearch(BaseModel):
    username: str


class UserListResponse(BaseModel):
    users: list[UserResponse]

    model_config = ConfigDict(from_attributes=True)